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
