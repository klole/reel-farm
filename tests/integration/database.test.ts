import { randomUUID } from "node:crypto";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Pool } from "pg";
import sharp from "sharp";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for the real integration suite.");
if (process.env.CH001_ALLOW_DISPOSABLE_DATABASE !== "1" || !process.env.CH001_DISPOSABLE_RUN_ID) throw new Error("The integration suite requires an explicitly marked disposable CH-001 run.");

const pool = new Pool({ connectionString: databaseUrl, max: 2, connectionTimeoutMillis: 5_000 });

describe("CH-001 disposable PostgreSQL integration", () => {
  it("connects to the marked database and finds the complete migrated schema", async () => {
    const result = await pool.query<{ current_database: string; migration_id: string | null }>("SELECT current_database(), (SELECT id FROM schema_migrations WHERE id = '0001_ch001') AS migration_id");
    expect(result.rows[0]?.migration_id).toBe("0001_ch001");
    const tables = await pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])", [["workspace", "project", "draft", "draft_revision", "asset", "render_request", "render_outbox", "render_artifact", "worker_heartbeat", "save_mutation"]]);
    expect(new Set(tables.rows.map((row) => row.table_name))).toEqual(new Set(["workspace", "project", "draft", "draft_revision", "asset", "render_request", "render_outbox", "render_artifact", "worker_heartbeat", "save_mutation"]));
  });

  it("keeps render intent and its outbox row in one committed transaction", async () => {
    const client = await pool.connect();
    const ids = { user: `ch001-test-${randomUUID()}`, workspace: randomUUID(), project: randomUUID(), draft: randomUUID(), revision: randomUUID(), request: randomUUID(), outbox: randomUUID() };
    try {
      await client.query("BEGIN");
      await client.query("INSERT INTO \"user\" (id, name, email) VALUES ($1, 'Synthetic Integration Owner', $2)", [ids.user, `${ids.user}@invalid.test`]);
      await client.query("INSERT INTO workspace (id, singleton_key, owner_user_id) VALUES ($1, $2, $3)", [ids.workspace, `ch001-${ids.workspace}`, ids.user]);
      await client.query("INSERT INTO project (id, workspace_id, name) VALUES ($1, $2, 'Synthetic integration project')", [ids.project, ids.workspace]);
      await client.query("INSERT INTO draft (id, project_id) VALUES ($1, $2)", [ids.draft, ids.project]);
      const document = JSON.stringify({ schemaVersion: "oss.slide/1", synthetic: true });
      await client.query("INSERT INTO draft_revision (id, draft_id, revision_number, document, content_hash, canonicalization_version, created_by) VALUES ($1, $2, 1, $3::jsonb, $4, 'oss.canonical/1', $5)", [ids.revision, ids.draft, document, "a".repeat(64), ids.user]);
      await client.query("UPDATE draft SET head_revision_id = $1 WHERE id = $2", [ids.revision, ids.draft]);
      await client.query("INSERT INTO render_request (id, workspace_id, draft_id, revision_id, client_request_id, payload_hash, renderer_build_id) VALUES ($1, $2, $3, $4, $5, $6, 'test-renderer')", [ids.request, ids.workspace, ids.draft, ids.revision, `request-${ids.request}`, "b".repeat(64)]);
      await client.query("INSERT INTO render_outbox (id, render_request_id) VALUES ($1, $2)", [ids.outbox, ids.request]);
      await client.query("COMMIT");
      const joined = await client.query("SELECT r.revision_id, o.render_request_id FROM render_request r JOIN render_outbox o ON o.render_request_id = r.id WHERE r.id = $1", [ids.request]);
      expect(joined.rows).toHaveLength(1);
      expect(joined.rows[0].revision_id).toBe(ids.revision);
      expect(joined.rows[0].render_request_id).toBe(ids.request);
      const replay = await client.query("INSERT INTO save_mutation (draft_id, actor_user_id, mutation_id, payload_hash, revision_id) VALUES ($1, $2, $3, $4, $5) RETURNING mutation_id", [ids.draft, ids.user, `mutation-${ids.request}`, "c".repeat(64), ids.revision]);
      expect(replay.rows[0].mutation_id).toBe(`mutation-${ids.request}`);
      await expect(client.query("INSERT INTO save_mutation (draft_id, actor_user_id, mutation_id, payload_hash, revision_id) VALUES ($1, $2, $3, $4, $5)", [ids.draft, ids.user, `mutation-${ids.request}`, "c".repeat(64), ids.revision])).rejects.toThrow();
    } finally {
      await client.query("ROLLBACK").catch(() => undefined);
      await client.query("DELETE FROM workspace WHERE id = $1", [ids.workspace]).catch(() => undefined);
      await client.query("DELETE FROM \"user\" WHERE id = $1", [ids.user]).catch(() => undefined);
      client.release();
    }
  });

  it("probes and stages local media without leaving health or staging debris", async () => {
    const mediaRoot = await mkdtemp(resolve(tmpdir(), "oss-ch001-media-"));
    const previousRoot = process.env.MEDIA_ROOT;
    process.env.MEDIA_ROOT = mediaRoot;
    try {
      const storage = await import("../../packages/storage/src/index.ts");
      await storage.probeStorage();
      const healthEntries = await readdir(resolve(mediaRoot, "health")).catch(() => []);
      expect(healthEntries).toEqual([]);
      const original = await sharp({ create: { width: 64, height: 96, channels: 3, background: "#c65a3a" } }).jpeg().toBuffer();
      const staged = await storage.stageAsset("integration-workspace", "marker.jpg", original);
      expect(await storage.storageFileExists(staged.finalKeys.original)).toBe(false);
      await storage.promoteAsset(staged);
      expect((await storage.readStorageFile(staged.finalKeys.original)).equals(original)).toBe(true);
      expect(await storage.storageFileExists(staged.finalKeys.derivative)).toBe(true);
      await storage.removeStorageFile(staged.finalKeys.original);
      await storage.removeStorageFile(staged.finalKeys.derivative);
      await storage.removeStorageFile(staged.finalKeys.thumbnail);
    } finally {
      if (previousRoot === undefined) delete process.env.MEDIA_ROOT;
      else process.env.MEDIA_ROOT = previousRoot;
      await rm(mediaRoot, { recursive: true, force: true });
    }
  });
});

afterAll(async () => { await pool.end(); });
