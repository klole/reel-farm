function requiredTarget(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`A non-empty ${label} is required for migration SQL.`);
  return value;
}

/**
 * Build the exact argv used by the migration proof's psql adapter.
 *
 * The database is deliberately required here. Callers that need the main
 * database must pass "oss" explicitly; table/schema-local operations cannot
 * accidentally fall through to that target.
 */
export function buildMigrationSqlArgs({ database, user, password, sql, verboseErrors = false }) {
  const targetDatabase = requiredTarget(database, "database");
  const targetUser = requiredTarget(user, "user");
  if (typeof sql !== "string" || sql.length === 0) throw new Error("Migration SQL must be a non-empty string.");

  const args = ["exec", "-T"];
  if (typeof password === "string" && password.length > 0) args.push("-e", `PGPASSWORD=${password}`);
  args.push("db", "psql", "-U", targetUser, "-d", targetDatabase, "-v", "ON_ERROR_STOP=1");
  if (verboseErrors === true) args.push("-v", "VERBOSITY=verbose");
  args.push("-Atc", sql);
  return args;
}

/**
 * Create the production migration SQL adapter around the proof's compose
 * runner. Tests can inject a database-aware command runner while exercising
 * the same argument builder used by the real proof.
 */
export function createMigrationSqlAdapter(execute) {
  if (typeof execute !== "function") throw new Error("A migration SQL command executor is required.");
  return async function migrationSql(name, sql, database, user = "oss", password, verboseErrors = false) {
    const args = buildMigrationSqlArgs({ database, user, ...(password ? { password } : {}), sql, verboseErrors });
    return execute(name, args);
  };
}
