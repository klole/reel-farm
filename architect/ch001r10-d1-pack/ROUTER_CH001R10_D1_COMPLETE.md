# Complete router packet — CH-001R-r10-D1

Router-only diagnostic execution; not a new Luna implementation chapter. The ZIP contains the receipt template and review record.


---

<a id="doc-readme-md"></a>

# CH-001R-r10-D1 — Router migration reproduction

**Assignment owner:** the existing workflow-capable router, not a new Luna implementation chapter.  
**Target:** Open Slideshow Studio v0.1.0.  
**Decision:** proceed to controlled evidence collection; no application or migration acceptance.  
**Reviewed T10:** `ec7cc08d6ed229af9780318858d8051202851746`.  
**Reviewed E10:** `f512c9c02620ea600404cd304782a37e6689a109`.

R10 delivered a diagnostic implementation and a host-only import failure. It did not repair or run the migration in the final Docker image. The next useful step is to obtain that runtime evidence, not send Luna back to the same Docker-less editing environment with another speculative application assignment.

## Read and execute

Read [the review](#doc-01-review-md), then [the router execution instructions](#doc-02-router-execution-md). Use [the receipt specification](#doc-03-receipt-and-stop-md) and [the JSON template](sandbox:/mnt/data/CH001R_r10_D1_Router_Pack/router-receipt.template.json) to return actual results. [Source references](#doc-04-sources-md) distinguish repository evidence from external command documentation.

Select one route:

- **Route A, preferred:** migration-only reproduction on an existing capable local Docker host. No browser launch, AppArmor change, workflow dispatch, or application UI journey.
- **Route B, conditional fallback:** one manually elected, fresh run of the existing T10 hosted workflow when Route A cannot supply a capable environment. This consumes the existing r10 one-request allowance; it is not an additional retry budget.

These routes are mutually exclusive for this assignment. Do not dispatch after Route A has produced useful failure/success evidence. Return that evidence for architect review. If neither route can run safely, return an environment-blocked receipt.

## Scope and authority

This packet clarifies router execution and supersedes the command recipe in `docs/evidence/CH-001R-r10/router-reproduction.md` where they differ. It does not authorize an application edit, a new dependency, a migration SQL change, a worker/security change, a new workflow, or a new product chapter.

The executable assignment committed at P10 is the historical authority for judging Luna's r10 work. Conversation-local variants of the older packet are not retroactive permission to change dependencies. This D1 continuation does not retrospectively fault Luna for choosing its explicitly allowed diagnostic-only mode.

Keep `application_acceptance=false`, accepted version `none`, and root `awaiting_review`. Do not replace the original 72-gate ledger with a diagnostic checklist. Historical hosted runs and artifacts remain immutable.

The architect performed read-only source/handoff review and created this packet. No Docker command, application test, migration, hosted dispatch, or sandbox change was executed by the architect in this review. Delivery here is not a send to an external router or Luna session.


---

<a id="doc-01-review-md"></a>

# Architect review — T10/E10 diagnostic handoff

## Verdict

**DIAGNOSTIC HANDOFF REVIEWED; RUNTIME REPRODUCTION STILL REQUIRED.**

No v0.1 acceptance, no verified migration repair, and no new feature chapter. The next authorized operation is router-owned diagnostic execution under CH-001R-r10-D1.

## Identity and status observations

The repository reference read returned E10 `f512c9c02620ea600404cd304782a37e6689a109`. Git commit metadata identifies T10 `ec7cc08d6ed229af9780318858d8051202851746` as E10's direct parent. E10 tree is `61cd887e1f60a66e15bce6815aac02201860c574`; the handoff records T10 tree `9e43ac5c00801f7d523405dbe5874d64264fa7cc`. [S1, S2]

The handoff reports completion mode `DIAGNOSTICS_READY_FOR_ROUTER_REPRODUCTION`. Its repair checklist is 9 PASS / 0 FAIL / 9 NOT_RUN, separate from the local application ledger of 4 source-only PASS / 0 FAIL / 68 NOT_RUN. These are the implementation agent's recorded results, not test reruns by this architect. [S2, S4]

The E10-filtered GitHub query for `workflow_dispatch` returned zero runs at review. This corroborates the supplied no-dispatch update for E10; it is not a claim about every historical head or every possible dispatch request. There is no fresh T10 hosted artifact or hosted proof result in this handoff. [S9]

The workflow identity is recorded as unchanged from T9: blob `35fa339aac2fcb024cd476ff38d87d27eb6482af`, file SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`. The router must recheck actual current publication bytes immediately before any request. [S2]

## D1-F01 — A real host import failure, not yet a container cause

The recorded root `pnpm db:migrate` invocation exited 1 with `ERR_MODULE_NOT_FOUND` for `@oss/db`. It failed during module loading; the handoff does not claim PostgreSQL was contacted. Docker, a final-image ID, fresh migration, repeat migration, and schema observations remain NOT_RUN/null. [S2, S3]

This is stronger evidence for the importer hypothesis than the earlier synthetic resolver example. It still does not recover the missing exception from historical T9 run `34937329430`, and it does not establish what the shipped T10 image will do.

No migration or dependency repair was made. The actual P10 assignment required the final-image exception before repairing this boundary and explicitly permitted diagnostic-only completion when Docker was unavailable. Luna stayed within that instruction. [S6]

**Disposition:** collect the T10 container's real stderr and exit state. Do not add `@oss/db`, invent SQLSTATE, change imports, or rewrite migration SQL in this router continuation. A proven image-loading defect will support a subsequent specific code authorization.

## D1-F02 — Diagnostics and teardown were improved in source, not live-qualified

The inspected T10 coordinator validates a fresh project, sets the startup-attempt flag before `compose up`, and distinguishes that flag from a successful startup. Its finalization invokes diagnostics/teardown before sanitization and manifest hashing. The new helper includes stopped services, bounded logs, explicit malformed-state handling, and scoped cleanup. [S7, S8]

These changes address the earlier source-level control-flow gap. This review does not turn mocked helper tests or an early no-startup run into proof of real Docker cleanup, sibling-resource preservation, or the full failure matrix.

Route A independently establishes migration facts. It does not by itself live-qualify the entire T10 proof coordinator. Route B exercises the existing coordinator, with the limitations of the actual resulting run reported.

## D1-F03 — The committed router recipe is not the executable authority for D1

Several details in the committed recipe can obstruct useful diagnosis: [S5]

1. It describes T9-first then T10 testing, but its checkout example selects T10. Revision labels must match the actual checkout; this packet deliberately selects T10 for current diagnosis and makes no claim to reproduce the historical T9 execution.
2. It tests `ps --format json` with shell string emptiness. A parser, or a successful IDs-only query, should determine whether there are containers. An empty array is not an empty shell string; failed commands must not be mistaken for an empty inventory. The supported formats also vary across Compose versions. [S11]
3. It uses foreground `compose up ... migrate` without a service-exit selection or explicit process bound. Docker documents that `up` may start dependencies and attaches to container output; the selected container's exit is available via `--exit-code-from`. This D1 route instead uses a retained one-off migration container with a separately ready database, and records both CLI and container exits. [S12, S13]
4. A plan saying “bounded” is not an actual timeout. Every operation needs a finite runner deadline and guaranteed, scoped cleanup once resources may have been allocated.
5. `dispatch_purpose=diagnose_migration` is receipt metadata, not a supported extra workflow input. The inspected unchanged workflow history has only `implementation_sha` and `sandbox_qualification`; the fallback request must use only those two inputs.

These are procedure corrections, not claims that a new Docker reproduction failed. Do not copy the old recipe verbatim and create another avoidable execution loop.

## D1-F04 — Keep evidence types and availability separate

The handoff references clean/hosted-like prefix reports and local proof files under gitignored `artifacts/`. Those paths are not downloadable evidence merely because the handoff names them. Retrieve and preserve them separately if they are needed to credit the corresponding checks. Do not relabel a later execution as the original local result. [S2]

This need not prevent collecting the missing container exception. It does prevent overstating what this architect independently validated. The repair checklist's PASS entries remain reported observations; the application contract is unchanged.

## Next decision boundary

A container failure with useful sanitized stderr and an owned cleanup receipt is a **successful diagnostic capture**, not a passing migration. An unexpected migration success requires fresh/repeat/schema evidence, but still does not accept the application.

Return the first usable container result. Do not keep patching and rerunning until something turns green. The architect will authorize any code repair from the observed boundary, preserving the now-working CI/bootstrap and host-sandbox configuration.


---

<a id="doc-02-router-execution-md"></a>

# Router execution — CH-001R-r10-D1

## 1. Hard limits

Do not edit executable repository files. Do not dispatch automatically. Do not rerun old Actions records. Do not change dependency/lock contents, SQL, migration markers, Compose dependencies, worker isolation, or host sandbox policy to obtain a successful result.

At most one fresh hosted T10 request is available under this continuation **in total**, not one per branch, operator, recipe, or packet revision. This is the unconsumed r10 request allowance. A rejected, failed, cancelled, or ambiguous submission is not permission to submit another one.

Choose Route A when an already authorized Docker-capable machine is available. Route B is a fallback for unavailable local capability, not an automatic sequel to Route A. A migration failure after local setup is useful evidence; it is not “environment unavailable” just because the migration failed.

The router may create temporary local scripts solely to supervise the exact commands below with deadlines, collect selected diagnostics, and form receipts. Keep those scripts outside the application checkout and include their source/hash in the receipt. They may not modify production behavior, create a new workflow, provision a new VM, access user data, or add dependencies to the app.

## 2. Verify source and current publication

Expected T10: `ec7cc08d6ed229af9780318858d8051202851746`. Expected reviewed E10: `f512c9c02620ea600404cd304782a37e6689a109`.

Use the existing authorized repository clone. Fetch read-only as needed. Record the current `origin/main`, confirm T10 is an ancestor, and inspect any progress beyond E10. Documentation-only advancement is acceptable if explicitly recorded. An unrelated executable change, a prior T10 dispatch, or an uncertain execution history is a stop condition—not a reason to reset or force-push.

Record actual SHAs/trees, not symbolic T10 strings in the receipt. A detached disposable worktree or clean clone of exact T10 is acceptable. Do not operate on the router's normal working directory, load its `.env`, or remove unrelated work. Verify the checkout is clean and no untracked source, dependencies, or Compose override is present.

### Current diagnosis versus historical reconstruction

The primary local target is **exact T10**. T10 has no migration correction, and its handoff reports the migration/image/dependency inputs unchanged. Confirm that with a source comparison covering at least:

```text
Dockerfile
.dockerignore
compose.yaml
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
.npmrc
.nvmrc
tsconfig.json
tsconfig.base.json
scripts/migrate.ts
packages/db/
```

Compare against T9 `6014a247b124a186a1abfcb6d65a7ef024cf8cfc`. Record any difference; do not conceal one. This comparison does not prove identical built images, because external image tags and build-time sources may vary.

A T10-only execution is sufficient to supply the current missing runtime observation. Do not label it “T9 hosted cause confirmed.” Building T9 again is not required by this D1 continuation; a separate historical reconstruction needs a distinct reason and separate evidence, not a relabeled T10 result.

## 3. Route A — isolated final-image migration

### A1. Capability and environment before allocation

Confirm a working local Docker daemon and Compose. Record CLI, server, Compose, platform, and architecture. Use the project's existing Linux/amd64 target. If a Mac requires emulation, record that explicitly; if unavailable, choose Route B before trying to repair the Docker host.

Confirm the Docker context/endpoint is the intended disposable local host. Refuse an unexpected remote/production Docker endpoint. Do not modify daemon settings or install unrelated virtualization. Preserve authorized Docker credential-helper access for image pulls, but do not publish its configuration.

Use explicit command arguments and a controlled child environment. Remove inherited `COMPOSE_FILE`, `COMPOSE_PROJECT_NAME`, `COMPOSE_PROFILES`, application database/auth values, `NODE_OPTIONS`, and environment-file overrides that could redirect the operation. Do not source an environment file as executable shell code. Keep a selected Docker context fixed across all calls.

Generate a fresh lowercase run ID with a random suffix and a project name such as `oss-ch001-r10d1-<timestamp>-<randomhex>`. Enforce a bounded length, valid characters, and one project per diagnostic attempt. Generate strong synthetic auth/bootstrap values. Store them in a private mode-0600 env file outside the image build context. No user credentials, real provider keys, or real account sessions are needed.

Bind every Compose command to the same explicit source, project, and env file. In a Bash-based operator wrapper, this argument array is the required form:

```bash
C=(docker compose --project-directory "$ROOT" -f "$ROOT/compose.yaml" \
   --project-name "$PROJECT" --env-file "$ENV_FILE")
```

`ROOT`, `PROJECT`, and `ENV_FILE` are validated literal paths/values, never shell fragments. With another language use the equivalent argument list, not `shell=True` or `eval`.

The private env file needs the existing required synthetic auth/bootstrap fields and a syntactically valid local `APP_ORIGIN`. Only `db` and `migrate` are started. Do not publish database ports or start web/worker to diagnose module loading. No browser executable or sandbox opt-in is needed for Route A.

### A2. Deadlines, cleanup ownership, and diagnostic limits

Use an actual process supervisor; do not rely on a comment, a browser timeout, or Compose's container shutdown timeout as the overall deadline. A Python subprocess deadline is acceptable on Mac/Linux when GNU `timeout` is unavailable. Record whether a command exited normally, was signalled, exceeded its deadline, or failed to spawn.

Recommended maximums: 20 seconds for each read-only state/log call; 120 seconds for database readiness; 120 seconds for each migration; 1,200 seconds for the image build; 60 seconds for teardown. Bound captured output, and mark truncation. Private build logs may use a larger finite cap than service diagnostics. A clipped/missing migration exception is `DIAGNOSTICS_INCOMPLETE`, not an invented cause.

Install an exit/finally cleanup handler **before the first operation that can allocate Docker resources**. Arm it only after validating fresh ownership. Set allocation-attempted before starting Docker operations that can create containers or networks. Preserve the primary failure if diagnostics or cleanup also fail. A timed-out CLI may leave a container running; capture its actual state, then perform scoped teardown.

Preallocation must separately and successfully show no project containers, volumes, or networks. Suitable IDs-only queries are:

```bash
docker ps --all --quiet --filter "label=com.docker.compose.project=$PROJECT"
docker volume ls --quiet --filter "label=com.docker.compose.project=$PROJECT"
docker network ls --quiet --filter "label=com.docker.compose.project=$PROJECT"
```

Check each command's exit independently, then validate the output. A nonzero/timeout/truncated result does not prove absence. Any preexisting target resource is a refusal with **no teardown of that project**. A resource-free label query does not authorize touching explicit external volumes; verify the selected Compose file has no external/shared data mounts or global volume names before proceeding.

Validate configuration without printing interpolated secrets:

```bash
"${C[@]}" config --quiet
```

### A3. Build the real final image and start only PostgreSQL

Build the shipped migration image, with no source or `node_modules` bind mount and no hand-added workspace symlink:

```bash
"${C[@]}" build migrate
"${C[@]}" up --detach --wait --wait-timeout 120 db
```

Record both command results. Do not proceed past a failed build or failed database readiness. Verify the database is the new project's healthy container and has no published host port. Preserve the database volume until all conditional repeat/schema checks are done.

Do not substitute a host `pnpm db:migrate`, direct SQL execution, a copied dependency tree, or a custom `psql` migration runner. The purpose is to observe the actual service command in the final image.

### A4. Run and retain the migration container

Use the service-defined default entrypoint/command and a unique one-off name:

```bash
FIRST_CONTAINER="$PROJECT-migrate-first"
"${C[@]}" run --no-deps -T --name "$FIRST_CONTAINER" migrate
```

Use the process bound established above. Do **not** use `--rm`: preserve the exited container until diagnostics are captured. Do not supply an overriding command, entrypoint, user, working directory, extra host mount, or broad privilege option. `--no-deps` is used only because this diagnostic has independently established that the same isolated database is healthy; the application's normal `service_completed_successfully` dependency is unchanged.

Retain the CLI return and independently inspect the container. Record selected fields only: container ID, project/service label, actual state, exit code, OOM flag, image ID, configured user, working directory, entrypoint/command, and mount **types/destinations** needed to show no host dependency tree is masking the image. Avoid publishing full `docker inspect`, `.Config.Env`, host filesystem sources, or credentials.

Capture bounded timestamped migration stderr/stdout, plus relevant PostgreSQL state/logs, before removal. Use the retained container's logs when a Compose service-log query does not include a one-off container. An unsuccessful inspection means “unknown,” not exit 0 or no container.

For example, the operator may call `docker logs --timestamps --tail 500 "$FIRST_CONTAINER"` and allowlisted `docker container inspect --format ...`; apply the same bound and public sanitization. Both command logs and inspected container exits belong in the receipt. A Compose CLI error or deadline is not automatically the migration's exit code.

Classify only the stage supported by actual output: package loading, exported-file loading, configuration, connection, SQL, or unknown. Preserve an observed exception class/code and a useful redacted stack excerpt. Never populate SQLSTATE for a module-loading failure. Do not reconstruct historical T9 stderr.

### A5. Branch on the result; do not turn diagnosis into implementation

**First migration fails:** capture the inner error and stopped state, then cleanup and return `CONTAINER_FAILURE_CAPTURED` if the required evidence and teardown are complete. Do not add dependencies or change SQL. Do not rerun the same failed candidate, start the UI, or dispatch hosted proof afterward merely to obtain another copy of the error.

**First migration unexpectedly succeeds:** retain the same database volume and image. Use the isolated database to inspect the expected tables and exactly one `0001_ch001` migration marker. Create a small deterministic sentinel in a dedicated diagnostic schema, not an application table. Invoke the same service command in a second uniquely named retained one-off container:

```bash
REPEAT_CONTAINER="$PROJECT-migrate-repeat"
"${C[@]}" run --no-deps -T --name "$REPEAT_CONTAINER" migrate
```

Confirm its actual exit, already-applied behavior, one migration marker, and unchanged sentinel. Use bounded `psql` calls with `ON_ERROR_STOP=1` against **only the validated diagnostic database**. Do not delete/recreate the database between first and repeat, and do not hand-insert application completion records. Record any fresh/repeat/schema failure separately. Return to architect review; even two successful migrations do not prove worker/browser/editor/export behavior.

A controlled transaction-failure matrix and full sibling-resource test can remain pending in this diagnostic continuation. Do not claim the original r10 live requirements are all closed by collecting one exception.

### A6. Sanitize, teardown, and seal the receipt

Before teardown, retain migration/container/image/database facts. Keep raw output private; publish copies redacting generated secrets, connection-string credentials, bearer tokens, cookies, and command-file contents. Omit `.env`, auth state, and raw environment dumps. Preserve a useful exception after redaction. Failed redaction must block public delivery.

For the verified run-owned project only:

```bash
"${C[@]}" down --volumes --remove-orphans
```

Record its real outcome, then independently query remaining project-labeled containers, volumes, and networks. Retained one-off migration containers must be accounted for. If a labeled resource remains, report it; do not escalate to global prune or deletion of arbitrary IDs. Do not claim all resources removed from a successful CLI return alone.

The cleanup handler must also run after failed database startup, failed migration, timeout, or interrupted diagnostics, when ownership is known and allocation was attempted. If interrupted before a complete receipt, retain private evidence and reconcile ownership manually—do not launch another attempt automatically.

Build images/cache may remain as explicitly recorded local build artifacts; do not claim they were removed, and do not use a global image prune to tidy the machine. They are separate from disposable container/network/data-volume cleanup.

Only after diagnostics and teardown are complete: write the final summary, sanitize public files, compute their hashes, and build the public manifest. Avoid circular hashing by excluding the manifest from its own members. Preserve original outputs separately from explanatory notes.

## 4. Route B — the existing one-request hosted diagnostic allowance

Use this route only if a suitable local Docker environment is unavailable and the router deliberately elects hosted diagnosis. This is **not** a new migration-only workflow: the existing bounded workflow installs/qualifies its host browser and may proceed beyond migration if migration succeeds. Those existing steps and safeguards stay unchanged.

Before submission:

1. Verify no earlier T10 request has consumed the r10 allowance, including an accepted request under a later documentation-only definition head. The E10-only zero-run observation in this review is not a permanent global guarantee.
2. Confirm public repository/standard runner eligibility, T10 ancestry on current `origin/main`, and no executable drift between T10 and the dispatch definition. Record the actual definition SHA; do not automatically label it E10 after a new documentation commit.
3. Validate the complete published workflow with the existing pinned actionlint and verify the expected workflow blob/file identities. Preserve the working bootstrap, runtime initializer, sandbox input, and cleanup steps.
4. Preserve the T10 diagnostic-mode limitation in the dispatch receipt. `dispatch_purpose: diagnose_migration` belongs in that receipt only. Do not add an unsupported workflow input.
5. Record the intended request before submission; an uncertain network response requires reconciliation against GitHub run history, not an automatic second request.

The only permitted workflow request form is:

```bash
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha=ec7cc08d6ed229af9780318858d8051202851746 \
  -f sandbox_qualification=true
```

No command above was run by the architect. This packet does not instruct Luna to dispatch it. It is one conditional router action after the stated checks, not an auto-redispatch loop.

Record acceptance/rejection of the request and the actual run/attempt/job. Inspect the settled result and artifact; do not infer a passing proof from a green wrapper step. Retrieve the new T10 archive, verify size/digest and manifest-listed payloads, and preserve it unchanged. Extract the migration service's inner error, `compose-startup-state.json`, sanitized logs, cleanup receipt, and child proof exit.

A bootstrap failure, preflight block, ownership refusal, missing artifact, or unavailable migration log returns as the actual new boundary. Do not turn such a result into “migration failure reproduced.” If the new proof unexpectedly succeeds, return the existing bounded result for architect review; no automatic v0.1 acceptance or next chapter follows.

## 5. Historical records are read-only

No rerun is authorized for T3 `34665615514`, T4 `34669975078`, T5 `34671716094`, E6 `34675672523`, P7 `34676862756`, T7 `34678495442`, T8 `34928718810`, or T9 `34937329430`. Their evidence must not be rewritten, resumed, or used as a substitute for new stderr.

Stop after returning the selected route's actual outcome. No new product work, root-dependency fix, SQL repair, provider integration, publication, scheduling, analytics, billing, video, release/tagging, or v0.2 authorization is included.


---

<a id="doc-03-receipt-and-stop-md"></a>

# Receipt and next review

Use `router-receipt.template.json` as a schema guide, not a completed result. Preserve nulls where nothing was executed or observed. Store evidence under a new D1 directory, for example `docs/evidence/CH-001R-r10-D1/`; an evidence-only receipt commit after execution is allowed. No application implementation commit is requested by this packet.

## Required distinctions

**Local diagnostic operation:** local run ID, exact T10 checkout/tree, actual Docker/Compose/image identity, migration CLI return, inspected container return, exception stage, cleanup outcome, and all public evidence hashes.

**Hosted operation:** separate dispatch-definition commit, requested and actual checkout, run/attempt/job, artifact ID/name/bytes/digest, bootstrap/proof classifications, measured cleanup, and any observed ledger counts. Hosted proof fields stay null/false under Route A; do not copy the historical 4/0/68 ledger into a new unexecuted hosted result.

**Luna-local history:** preserve its reported checks separately. Gitignored prefix/proof files need actual retrieval before crediting their bytes; a handoff path alone is not evidence access. A later reproduction has a new identity and timestamp.

## Allowed diagnostic outcomes

- `CONTAINER_FAILURE_CAPTURED`: a real final-image invocation failed; selected state and usable sanitized inner error were captured; scoped teardown is complete. This is not a migration PASS.
- `MIGRATION_SUCCEEDED_UNEXPECTEDLY`: the actual migration succeeded; report fresh/repeat/schema/sentinel separately. Pending repeat or schema checks prevent claiming that sub-boundary is verified.
- `ENVIRONMENT_UNAVAILABLE`: no capable selected environment; no migration result claimed.
- `DIAGNOSTICS_INCOMPLETE`: execution occurred but missing/failed/truncated records or incomplete cleanup prevent the intended diagnostic closure. Preserve useful facts and the primary error.
- `SCOPE_BLOCKED`: source, ownership, publication, or permissions do not match this authorization.

Under Route B also retain the workflow's real classification verbatim. The operator's diagnostic disposition must not replace a `LIVE_PROOF_FAILED` or `CI_BOOTSTRAP_FAILURE` result with PASS.

## D1 checklist, independent of the 72 application gates

| ID | Required observation |
|---|---|
| D1-01 | Exact T10/E10/current publication identities and chosen route are recorded. |
| D1-02 | Either a capable local Docker context is verified, or the single-request hosted prerequisites are checked. |
| D1-03 | No prior project/evidence is reused; private configuration is isolated from user data. |
| D1-04 | The image-local migration command and actual exit/error are observed, or explicitly remain unobserved with a reason. |
| D1-05 | Original migration failure and any diagnostic/cleanup failures retain separate precedence and exits. |
| D1-06 | Pre-deletion service/container facts and owned cleanup are recorded; incomplete cleanup is not called complete. |
| D1-07 | Public evidence is sanitized, hash-bound, and accessible; private material is excluded. |
| D1-08 | No application edits, acceptance promotion, old-run rerun, or excess hosted submission occurred. |

`NOT_RUN` or `FAIL` is allowed in this diagnostic receipt; it prevents overstating that observation. Do not coerce all rows to PASS merely to finish the task.

## Router's final message

Return:

```text
Assignment: CH-001R-r10-D1
Route: LOCAL_DOCKER / HOSTED_FALLBACK / NONE
Outcome: <actual diagnostic outcome>
T10: ec7cc08d6ed229af9780318858d8051202851746
Evidence/receipt commit: <actual SHA or null>
Migration command reached: <actual stage or unknown>
Migration CLI exit / inspected container exit: <actual values or null>
Inner exception: <short sanitized excerpt or unavailable>
Fresh / repeat / schema: <separate results>
Diagnostics / cleanup: <separate results>
Hosted request count for r10: <actual count>
Hosted run / artifact: <actual identifiers or null>
application_acceptance=false; accepted version=none; root=awaiting_review
sent=<yes/already/no>, destination=<exact destination or none>
```

For `sent`, distinguish an evidence push from a hosted dispatch and from delivery to a chat. Do not use a single “yes” to imply all three happened.

The architect reviews the receipt before authorizing any migration code change or a new Luna implementation chapter. Do not create T11, rerun a failure, or expand the scope on the router's own initiative.


---

<a id="doc-04-sources-md"></a>

# Source references and review limits

All repository reads below are fixed to the reviewed commits except the explicitly identified branch/run-list observations. Remote observations were read during this review; no repository source was modified. Source links support the review, not future test results.

- **S1 — Publication identity.** GitHub `refs/heads/main` returned E10; Git commit metadata returned E10 tree and direct T10 parent. https://api.github.com/repos/klole/reel-farm/git/commits/f512c9c02620ea600404cd304782a37e6689a109
- **S2 — R10 handoff.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/handoffs/CH-001R-r10.md
- **S3 — Migration diagnosis.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/migration-diagnosis.json
- **S4 — R10 result ledger.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/r10-results.json
- **S5 — Existing router recipe, superseded operationally by D1.** https://github.com/klole/reel-farm/blob/f512c9c02620ea600404cd304782a37e6689a109/docs/evidence/CH-001R-r10/router-reproduction.md
- **S6 — Assignment actually published at P10.** https://github.com/klole/reel-farm/blob/df8ce7d938910949fef3840ac2c79ec9c388dc6a/architect/assignment-ch001r10-luna.md
- **S7 — Diagnostic helper at T10.** https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose-diagnostics.mjs
- **S8 — Coordinator and command runner at T10.** https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-proof.ts and https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose.ts
- **S9 — E10-only manual-run observation.** https://api.github.com/repos/klole/reel-farm/actions/runs?head_sha=f512c9c02620ea600404cd304782a37e6689a109&event=workflow_dispatch&per_page=100 — returned `total_count: 0`. Recheck before any router action; this is not a permanent dispatch lock.
- **S11 — Docker Compose ps.** https://docs.docker.com/reference/cli/docker/compose/ps/ — stopped-container selection, IDs output, and structured formatting. Current documentation describes JSON Lines; the procedure avoids string-emptiness assumptions for JSON.
- **S12 — Docker Compose up.** https://docs.docker.com/reference/cli/docker/compose/up/ — dependency startup, attached versus detached execution, service-exit selection, and readiness options.
- **S13 — Docker Compose run.** https://docs.docker.com/reference/cli/docker/compose/run/ — one-off service configuration, command overriding, no-deps, retained names, and optional removal.
- **S14 — Docker Compose down.** https://docs.docker.com/reference/cli/docker/compose/down/ — project teardown and explicit volume-removal behavior.
- **S15 — Docker Compose base command.** https://docs.docker.com/reference/cli/docker/compose/ — explicit project/config/env arguments and environment-variable precedence.
- **S16 — Docker container inspection.** https://docs.docker.com/reference/cli/docker/container/inspect/ — selected-field formatting for inspection rather than publishing unrestricted records.

## What the architect did not do

No Docker/Compose command, pnpm install, actionlint invocation, PostgreSQL migration, application test, browser qualification, GitHub write, artifact dispatch/download for a new T10 run, or external-agent send was performed during this D1 review. The reviewed handoff reports local results; they were not independently rerun here.

The packet contains a read-only review receipt and future instructions. It does not include new runtime evidence, a new application gate ledger, a historical ZIP revalidation claim, or a runnable application patch. Packet validation checks document structure and cross-file consistency only.


---

<a id="doc-router-start-prompt-md"></a>

Execute **CH-001R-r10-D1** as a router-only evidence collection continuation. Read this packet and the published T10/E10 handoff. Do not start a new Luna implementation chapter or change application source.

Reviewed T10 is `ec7cc08d6ed229af9780318858d8051202851746`; E10 is `f512c9c02620ea600404cd304782a37e6689a109`. R10 is diagnostic-only: host `@oss/db` loading failed, but the actual image migration has not been observed. Keep application acceptance false, version none, and root awaiting_review.

Prefer the corrected Route A: exact clean T10 final-image migration against an isolated local PostgreSQL instance, finite command bounds, retained migration container, selected stderr/state/image facts, and scoped cleanup. Do not blindly execute the older router recipe. No browser or AppArmor operation is required on this route. Stop and return after usable migration failure evidence; do not patch the cause.

Only when local Docker capability is unavailable, deliberately elect Route B after publication, actionlint, and one-request-history checks. It may consume at most the existing one fresh T10 workflow request with implementation_sha=T10 and sandbox_qualification=true. Put dispatch_purpose only in receipt metadata, not the workflow inputs. Do not dispatch after a useful local result, auto-retry, or rerun any historical Actions record.

Return exact local/hosted identities, actual migration and cleanup results, sanitized hash-bound evidence, pending checks, and sent status with its destination. A diagnostic capture is not a migration pass, and neither is application acceptance. Stop for architect review.
