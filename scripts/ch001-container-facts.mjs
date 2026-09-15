function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value, redact, limit = 512) {
  if (typeof value !== "string") return null;
  return redact(value.slice(0, limit));
}

function stringArray(value, redact, limit = 64) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) return null;
  return value.slice(0, limit).map((entry) => redact(entry.slice(0, 512)));
}

function integerOrNull(value) {
  return Number.isInteger(value) ? value : null;
}

function selectedComposeLabels(value, redact) {
  const labels = isRecord(value) ? value : {};
  return {
    project: text(labels["com.docker.compose.project"], redact, 128),
    service: text(labels["com.docker.compose.service"], redact, 128),
    container_number: text(labels["com.docker.compose.container-number"], redact, 32)
  };
}

function selectedMounts(value, redact) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 32).flatMap((mount) => {
    if (!isRecord(mount)) return [];
    return [{
      destination: text(mount.Destination, redact, 256),
      type: text(mount.Type, redact, 64),
      read_only: typeof mount.RW === "boolean" ? !mount.RW : null
    }];
  });
}

/**
 * Project a Docker container inspection into the small public contract used by
 * the migration proof. The raw Docker object is intentionally not returned.
 */
export function projectMigrationContainerInspection(value, fallbackName = null, redact = (entry) => entry) {
  if (!isRecord(value)) return { inspection_status: "FAIL", reason: "Docker container inspection was not a JSON object." };
  const state = isRecord(value.State) ? value.State : {};
  const config = isRecord(value.Config) ? value.Config : {};
  return {
    inspection_status: "PASS",
    id: text(value.Id, redact, 128),
    name: text(value.Name, redact, 256) ?? text(fallbackName, redact, 256),
    image_id: text(value.Image, redact, 128),
    project_identity: selectedComposeLabels(value.Config?.Labels, redact),
    state: text(state.Status, redact, 64),
    exit_code: integerOrNull(state.ExitCode),
    error: text(state.Error, redact, 1_024),
    started_at: text(state.StartedAt, redact, 64),
    finished_at: text(state.FinishedAt, redact, 64),
    user: text(config.User, redact, 256),
    working_directory: text(config.WorkingDir, redact, 512),
    process: {
      path: text(value.Path, redact, 512),
      args: stringArray(value.Args, redact)
    },
    configured_process: {
      entrypoint: stringArray(config.Entrypoint, redact),
      cmd: stringArray(config.Cmd, redact)
    },
    mounts: selectedMounts(value.Mounts, redact)
  };
}

/**
 * Project Docker image facts without publishing Config.Env values or the
 * unrestricted image inspection document.
 */
export function projectDockerImageInspection(value, fallbackId = null, redact = (entry) => entry) {
  if (!isRecord(value)) return { inspection_status: "FAIL", reason: "Docker image inspection was not a JSON object." };
  const config = isRecord(value.Config) ? value.Config : {};
  const environment = Array.isArray(config.Env) ? config.Env : [];
  return {
    inspection_status: "PASS",
    id: text(value.Id, redact, 128) ?? text(fallbackId, redact, 128),
    repo_digests: Array.isArray(value.RepoDigests) ? value.RepoDigests.filter((entry) => typeof entry === "string").slice(0, 32).map((entry) => redact(entry.slice(0, 512))) : [],
    created: text(value.Created, redact, 64),
    user: text(config.User, redact, 256),
    environment_keys: environment.flatMap((entry) => {
      if (typeof entry !== "string") return [];
      const key = entry.split("=", 1)[0];
      return key.length > 0 ? [redact(key.slice(0, 128))] : [];
    })
  };
}
