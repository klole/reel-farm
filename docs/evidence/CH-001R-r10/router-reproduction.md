# Router reproduction — CH-001R-r10

This is an executable reproduction plan for a Docker-capable router host. It is limited to Open Slideshow Studio v0.1.0 migration diagnosis and the partial-startup coordinator repair. Do not rerun hosted run `34937329430`, do not use its artifact as substitute stderr, and do not use production credentials.

## 1. Prepare isolated source and synthetic environment

Use a disposable checkout of the exact T9 implementation for the baseline and the exact T10 implementation for the repaired coordinator. The identities are recorded in `source-identity.json`. Build from the checkout itself; do not bind-mount the host source or `node_modules` into the container.

```bash
set -euo pipefail

RUN_ID="r10-router-$(date -u +%Y%m%d%H%M%S)"
PROJECT="oss-ch001-r10-${RUN_ID}"
WORKTREE="/tmp/${PROJECT}"
ENV_FILE="${WORKTREE}/.env.router"

git worktree add --detach "${WORKTREE}" ec7cc08d6ed229af9780318858d8051202851746
cd "${WORKTREE}"

umask 077
{
  printf 'BETTER_AUTH_SECRET=%s\n' 'synthetic-r10-better-auth-secret'
  printf 'BOOTSTRAP_TOKEN=%s\n' 'synthetic-r10-bootstrap-token'
  printf 'APP_ORIGIN=%s\n' 'http://127.0.0.1:39110'
  printf 'CH001_WEB_PORT=%s\n' '39110'
} > "${ENV_FILE}"

docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" config >/dev/null
test -z "$(docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" ps --all --format json)"
test -z "$(docker volume ls --filter "label=com.docker.compose.project=${PROJECT}" --format '{{.Name}}')"
```

If either preallocation check is non-empty, stop. Do not remove or reuse that state. The project name and generated volumes must be unique to this run.

## 2. Capture the exact final-image migration failure

First run the T9 checkout in a fresh project/volume to capture the historical failure before evaluating T10. Repeat the same commands after changing the checkout to T10. Keep the database volume between the fresh and repeat commands; use a new project/volume for each source revision.

```bash
set +e

docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" up -d db > /tmp/${PROJECT}-db-up.log 2>&1
db_up_rc=$?
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" ps --all --format json > /tmp/${PROJECT}-ps-before.json

docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" up --build migrate > /tmp/${PROJECT}-migrate-fresh.log 2>&1
fresh_rc=$?

docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" ps --all --format json > /tmp/${PROJECT}-ps-after-fresh.json
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" logs --no-color --timestamps --tail 500 db migrate web worker > /tmp/${PROJECT}-services.log 2>&1
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" images --format json > /tmp/${PROJECT}-images.json

docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" up migrate > /tmp/${PROJECT}-migrate-repeat.log 2>&1
repeat_rc=$?
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" ps --all --format json > /tmp/${PROJECT}-ps-after-repeat.json

set -e
printf 'db_up_rc=%s fresh_rc=%s repeat_rc=%s\n' "$db_up_rc" "$fresh_rc" "$repeat_rc"
```

The primary migration exit must be retained even if diagnostics or teardown fail. Record the direct inner exception from `/tmp/${PROJECT}-migrate-fresh.log`, the stopped `migrate` exit code from the JSON state, image IDs, and the bounded logs. Redact the public copy before committing or attaching it. Keep the raw log private to the run owner.

Run the schema check only against this isolated database, for example:

```bash
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" exec -T db \
  psql -U oss -d oss -Atc \
  "SELECT id FROM schema_migrations ORDER BY id; SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
```

Do not infer a SQL or connection defect if the command fails before PostgreSQL is contacted. In particular, classify an `ERR_MODULE_NOT_FOUND` for `@oss/db` as an image/module-resolution observation only after the exact image command has produced it.

## 3. Exercise the repaired partial-startup coordinator

From the T10 checkout, run the actual proof coordinator with a fresh run ID and synthetic environment. Allow `compose up` to return nonzero. Before any run-owned `down`, inspect the generated public startup record and the private run logs. The expected behavior is:

1. startup attempt and project ownership are recorded independently of readiness;
2. `ps --all` captures the stopped `migrate` state and exit code;
3. `logs --no-color --timestamps --tail 500 db migrate web worker` is captured with bounded output;
4. public logs redact URLs, synthetic secrets, bearer values, and cookies;
5. the original `compose up` failure remains primary, while diagnostic/cleanup errors are secondary;
6. `down -v --remove-orphans` is issued only for the validated generated project, followed by scoped container/volume checks;
7. startup diagnostics and cleanup records exist before `artifact-manifest.json` is hashed.

The focused regression command remains:

```bash
pnpm test:ci
```

For a real coordinator run, retain the generated `compose-startup-state.json`, `compose-cleanup.json`, sanitized service log, private raw log location, command report, and artifact manifest. Do not attach env files or private raw logs.

## 4. Sibling-resource safety and teardown

Before the run, create an unrelated Compose project or volume with a different project label. After the failed startup and after teardown, verify it remains. The only permitted destructive command is the scoped equivalent of:

```bash
docker compose --project-name "${PROJECT}" --env-file "${ENV_FILE}" down -v --remove-orphans
```

Then verify the run-owned project has no remaining containers and no volumes with its project label. Do not use `docker system prune`, unscoped `docker volume prune`, or any global cleanup.

## 5. Router decision boundary

Do not edit migration SQL or weaken migration requirements from a host-only result. If the exact final-image exception proves a minimal module-resolution correction, make that correction in a new bounded implementation commit, rerun fresh/repeat/schema/controlled-failure checks, and record the before/after identities. If no capable runtime is available, preserve `NOT_RUN` and return the diagnostic-only evidence for architect review. Any later hosted request is router-owned, must use the published T10 ancestry, and may be at most one conditional manual request with `dispatch_purpose=diagnose_migration`.
