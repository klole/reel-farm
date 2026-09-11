import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema.js";

const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";
const connectionString = process.env.DATABASE_URL ?? (isNextBuild ? "postgresql://build:build@127.0.0.1:5432/build" : undefined);
if (!connectionString) throw new Error("DATABASE_URL is required.");

export const pool = new Pool({ connectionString, max: Number(process.env.DB_POOL_MAX ?? 10), idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
export const db = drizzle(pool, { schema });

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
