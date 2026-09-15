# Source witnesses — not executed runtime reproductions

Inspected T12: `cc9da96079fc681ce162a99bd4e3df21f05cb382`.

## Database target witness

The inspected proof source contains the following relationships (irrelevant body lines omitted):

```ts
async function migrationSql(name: string, sql: string,
  database = "oss", user = "oss", password?: string,
  verboseErrors = false): Promise<CommandOutput> {
  // ...
  args.push("db", "psql", "-U", user, "-d", database,
    "-v", "ON_ERROR_STOP=1");
  // ...
}

// Inside runMarkerObserverRegression:
const runSetup = async (name: string, sql: string): Promise<boolean> => {
  const output = await migrationSql(name, sql);
  // ...
};
```

The same routine passes `fixtureDatabase` explicitly to its table creation and positive-marker insertion, but does not pass it for the REVOKE/GRANT call through runSetup. Source deduction: that call selects `oss`.

## Invocation witness

The process results have `invocationId`, but the finalizer's commands map selects only command, startedAt, endedAt, exitCode, logPath, and optional reportPath. The validator builds `commandNames` and rejects `new Set(commandNames).size !== commands.length`. Source deduction: two legitimate repeated schema/marker query invocations trigger that duplicate-text error.

No PostgreSQL statement or application verifier was executed here. These excerpts are explanatory selections from the connector source, not an independently rehashed full source checkout. Exact pinned file references and Git-returned blob IDs are in 06_REFERENCES.md.
