import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sql } from "drizzle-orm";
import { db, pool } from "@oss/db";

const migrationId = "0001_ch001";
const migration = await readFile(resolve(process.cwd(), "migrations/0001_ch001.sql"), "utf8");
const existing = await db.execute<{ id: string }>(sql`SELECT id FROM schema_migrations WHERE id = ${migrationId}`);
if (existing.rows.length === 0) {
  await db.execute(sql.raw(migration));
  await db.execute(sql`INSERT INTO schema_migrations (id) VALUES (${migrationId})`);
  console.log(`Applied migration ${migrationId}.`);
} else {
  console.log(`Migration ${migrationId} already applied.`);
}
await pool.end();
