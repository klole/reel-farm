const STATUS = Object.freeze({ PASS: "PASS", FAIL: "FAIL", NOT_RUN: "NOT_RUN" });

function now() {
  return new Date().toISOString();
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

function notRun(reason) {
  return { status: STATUS.NOT_RUN, reason };
}

function commandExit(value) {
  return value && Number.isInteger(value.exit_code) ? value.exit_code : null;
}

function terminalObservation(observation, expectedExit) {
  const cli = observation?.cli ?? observation?.command ?? observation;
  const container = observation?.container;
  const cliExit = commandExit(cli);
  const containerExit = commandExit(container);
  const timedOut = cli?.timed_out === true || container?.timed_out === true;
  const terminalState = container?.state ?? null;
  const terminal = !timedOut && cliExit !== null && (container ? terminalState === "exited" && containerExit !== null : true);
  const matches = container
    ? expectedExit === 0 ? cliExit === 0 && containerExit === 0 : cliExit !== null && cliExit !== 0 && containerExit !== 0
    : cliExit === expectedExit;
  return { pass: terminal && matches && observation?.assertion_ok !== false, cliExit, containerExit, timedOut, terminalState };
}

function stageFromCommand(observation, expectedExit = 0) {
  const terminal = terminalObservation(observation, expectedExit);
  return {
    expected_exit_code: expectedExit,
    cli_exit_code: terminal.cliExit,
    inspected_container_exit_code: terminal.containerExit,
    terminal_state: terminal.terminalState,
    timed_out: terminal.timedOut,
    ...(observation && typeof observation === "object" ? observation : {}),
    status: terminal.pass ? STATUS.PASS : STATUS.FAIL
  };
}

function stageFromAssertion(observation) {
  if (!observation || typeof observation !== "object") return { status: STATUS.FAIL, reason: "The migration assertion returned no observation." };
  if (observation.status === STATUS.PASS || observation.status === STATUS.FAIL || observation.status === STATUS.NOT_RUN) return observation;
  return { ...observation, status: observation.ok === true ? STATUS.PASS : STATUS.FAIL };
}

function attachFailure(result, stageName, detail) {
  const text = errorText(detail);
  result.failures.push({ stage: stageName, error: text });
  if (!result.primary_failure) result.primary_failure = { stage: stageName, error: text };
}

function markLaterStages(result, stageNames, reason) {
  for (const name of stageNames) if (result.stages[name]?.status === STATUS.NOT_RUN) result.stages[name] = notRun(reason);
}

export function isSuccessfulMigrationTerminal(observation) {
  return terminalObservation(observation, 0).pass;
}

export function isSuccessfulExpectedFailure(observation) {
  const terminal = terminalObservation(observation, 1);
  return terminal.pass && observation?.marker_count === 0 && observation?.error_observed === true;
}

export async function runMigrationFirstQualification({ identity, adapter, writeResult }) {
  const result = {
    schema_version: 1,
    record_kind: "CH001_MIGRATION_VERIFICATION",
    classification: "R11_MIGRATION_FIRST",
    run_id: identity.run_id,
    implementation_commit: identity.implementation_commit,
    source_tree: identity.source_tree ?? null,
    image: identity.image ?? null,
    database: identity.database ?? null,
    prebuild_module_import: identity.module_import ?? null,
    started_at: now(),
    ended_at: null,
    persisted_before_worker_readiness: false,
    worker_readiness_attempted: false,
    migration_qualified: false,
    failures: [],
    primary_failure: null,
    stages: {
      module_import: notRun("Post-build final-image module import was not reached."),
      build: notRun("Not reached."),
      database_start: notRun("Not reached."),
      database_ready: notRun("Not reached."),
      fresh_precondition: notRun("Not reached."),
      fresh: notRun("Not reached."),
      schema: notRun("Not reached."),
      sentinel: notRun("Not reached."),
      repeat: notRun("Not reached."),
      repeat_assertions: notRun("Not reached."),
      failure_control: notRun("Not reached."),
      fixture_cleanup: notRun("Not reached.")
    }
  };
  let fixtureCreated = false;
  let stopReason = "Migration-first qualification did not complete.";
  const laterStages = ["database_start", "database_ready", "fresh_precondition", "fresh", "schema", "sentinel", "repeat", "failure_control"];

  try {
    try {
      result.stages.build = stageFromCommand(await adapter.buildImages());
    } catch (error) {
      result.stages.build = { status: STATUS.FAIL, error: errorText(error) };
    }
    if (result.stages.build.status !== STATUS.PASS) {
      stopReason = "Final image build did not reach a measured success.";
      attachFailure(result, "build", result.stages.build.error ?? stopReason);
    } else {
      try { result.stages.module_import = stageFromAssertion(await adapter.verifyModuleImport()); }
      catch (error) { result.stages.module_import = { status: STATUS.FAIL, error: errorText(error) }; }
      if (result.stages.module_import.status !== STATUS.PASS) {
        stopReason = "Post-build @oss/db module import in the final image did not pass.";
        attachFailure(result, "module_import", result.stages.module_import.reason ?? result.stages.module_import.error ?? stopReason);
      } else {
        try { result.stages.database_start = stageFromCommand(await adapter.startDatabase()); }
        catch (error) { result.stages.database_start = { status: STATUS.FAIL, error: errorText(error) }; }
        if (result.stages.database_start.status !== STATUS.PASS) {
          stopReason = "The owned database container did not start successfully.";
          attachFailure(result, "database_start", result.stages.database_start.error ?? stopReason);
        } else {
          try { result.stages.database_ready = stageFromAssertion(await adapter.waitForDatabase()); }
          catch (error) { result.stages.database_ready = { status: STATUS.FAIL, error: errorText(error) }; }
          if (result.stages.database_ready.status !== STATUS.PASS) {
            stopReason = "Database readiness was not measured as healthy.";
            attachFailure(result, "database_ready", result.stages.database_ready.error ?? stopReason);
          } else {
            try { result.stages.fresh_precondition = stageFromAssertion(await adapter.confirmFreshMarkerAbsent()); }
            catch (error) { result.stages.fresh_precondition = { status: STATUS.FAIL, error: errorText(error) }; }
            if (result.stages.fresh_precondition.status !== STATUS.PASS) {
              stopReason = "Fresh database marker absence was not proven.";
              attachFailure(result, "fresh_precondition", result.stages.fresh_precondition.error ?? stopReason);
            } else {
              try { result.stages.fresh = stageFromCommand(await adapter.runMigration("fresh")); }
              catch (error) { result.stages.fresh = { status: STATUS.FAIL, error: errorText(error) }; }
              if (result.stages.fresh.status !== STATUS.PASS) {
                stopReason = "Fresh shipped migration did not produce matching CLI and inspected container exit 0.";
                attachFailure(result, "fresh", result.stages.fresh.error ?? stopReason);
              } else {
                try { result.stages.schema = stageFromAssertion(await adapter.inspectSchema()); }
                catch (error) { result.stages.schema = { status: STATUS.FAIL, error: errorText(error) }; }
                if (result.stages.schema.status !== STATUS.PASS) {
                  stopReason = "Fresh migration schema or completion-marker assertions failed.";
                  attachFailure(result, "schema", result.stages.schema.error ?? stopReason);
                } else {
                  try { result.stages.sentinel = stageFromAssertion(await adapter.createSentinel()); fixtureCreated = result.stages.sentinel.status === STATUS.PASS || result.stages.sentinel.fixture_allocated === true; }
                  catch (error) { result.stages.sentinel = { status: STATUS.FAIL, error: errorText(error) }; }
                  if (result.stages.sentinel.status !== STATUS.PASS) {
                    stopReason = "Same-database repeat sentinel setup failed.";
                    attachFailure(result, "sentinel", result.stages.sentinel.error ?? stopReason);
                  } else {
                    try { result.stages.repeat = stageFromCommand(await adapter.runMigration("repeat")); }
                    catch (error) { result.stages.repeat = { status: STATUS.FAIL, error: errorText(error) }; }
                    if (result.stages.repeat.status !== STATUS.PASS) {
                      stopReason = "Same-database repeat migration did not produce matching exit 0.";
                      attachFailure(result, "repeat", result.stages.repeat.error ?? stopReason);
                    } else {
                      try { result.stages.repeat_assertions = stageFromAssertion(await adapter.inspectRepeatState()); }
                      catch (error) { result.stages.repeat_assertions = { status: STATUS.FAIL, error: errorText(error) }; }
                      if (result.stages.repeat_assertions.status !== STATUS.PASS) {
                        stopReason = "Same-database marker, schema, timestamp, or sentinel assertions failed.";
                        attachFailure(result, "repeat_assertions", result.stages.repeat_assertions.error ?? stopReason);
                      } else {
                        try {
                          const failureObservation = await adapter.runFailureControl();
                          result.stages.failure_control = { ...failureObservation, status: isSuccessfulExpectedFailure(failureObservation) ? STATUS.PASS : STATUS.FAIL };
                        }
                        catch (error) { result.stages.failure_control = { status: STATUS.FAIL, error: errorText(error) }; }
                        if (!isSuccessfulExpectedFailure(result.stages.failure_control)) {
                          stopReason = "Controlled SQL/permission failure did not remain a nonzero failure without a completion marker.";
                          attachFailure(result, "failure_control", result.stages.failure_control.error ?? stopReason);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } finally {
    markLaterStages(result, [...laterStages, "repeat_assertions"], stopReason);
    try {
      if (fixtureCreated || result.stages.failure_control.status !== STATUS.NOT_RUN) result.stages.fixture_cleanup = stageFromAssertion(await adapter.cleanupFixtures());
      else result.stages.fixture_cleanup = notRun("No migration fixture was allocated.");
    } catch (error) {
      result.stages.fixture_cleanup = { status: STATUS.FAIL, error: errorText(error) };
    }
    if (result.stages.fixture_cleanup.status === STATUS.FAIL) attachFailure(result, "fixture_cleanup", result.stages.fixture_cleanup.error ?? "Migration fixture cleanup failed.");
    const required = ["module_import", "build", "database_start", "database_ready", "fresh_precondition", "fresh", "schema", "sentinel", "repeat", "repeat_assertions", "failure_control"];
    result.migration_qualified = result.failures.length === 0 && required.every((name) => result.stages[name]?.status === STATUS.PASS) && result.stages.fixture_cleanup.status !== STATUS.FAIL;
    result.status = result.migration_qualified ? STATUS.PASS : STATUS.FAIL;
    result.persisted_before_worker_readiness = true;
    result.ended_at = now();
    await writeResult(result);
  }
  return result;
}

export { STATUS as MIGRATION_STATUS };
