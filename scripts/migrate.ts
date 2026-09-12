import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "@oss/db";

const migrationId = "0001_ch001";
const migration = await readFile(resolve(process.cwd(), "migrations/0001_ch001.sql"), "utf8");

// The metadata table is bootstrapped inside the same transaction as the
// migration. The advisory transaction lock serializes two web/worker startup
// paths without requiring a manual database preparation step. PostgreSQL DDL
// used by this migration is transactional, so a failed application cannot
// leave a completion record for a partially applied schema.
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", ["open-slideshow-studio-schema-migrations"]);
  await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  const existing = await client.query<{ id: string }>("SELECT id FROM schema_migrations WHERE id = $1", [migrationId]);
  if (existing.rows.length === 0) {
    await client.query(migration);
    await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [migrationId]);
    console.log(`Applied migration ${migrationId}.`);
  } else {
    console.log(`Migration ${migrationId} already applied.`);
  }
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  client.release();
  await pool.end();
}
