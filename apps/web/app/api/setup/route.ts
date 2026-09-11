import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db, pool, workspace } from "@oss/db";
import { eq } from "drizzle-orm";
import { auth } from "../../../src/lib/auth";
import { assertMutationRequest, HttpError, jsonError } from "../../../src/lib/request";

export const runtime = "nodejs";
const SetupSchema = z.object({ token: z.string().min(16).max(200), name: z.string().trim().min(1).max(100), email: z.string().email().max(254), password: z.string().min(12).max(128) }).strict();

function equalSecret(received: string, expected: string): boolean {
  const a = Buffer.from(received); const b = Buffer.from(expected); return a.length === b.length && timingSafeEqual(a, b);
}

async function withSetupLock<T>(operation: () => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(hashtextextended($1, 0))", ["open-slideshow-studio-owner-setup"]);
    return await operation();
  } finally {
    try { await client.query("SELECT pg_advisory_unlock(hashtextextended($1, 0))", ["open-slideshow-studio-owner-setup"]); } finally { client.release(); }
  }
}

export async function GET() {
  try { const rows = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.singletonKey, "primary")); return NextResponse.json({ setupRequired: rows.length === 0 }); } catch { return NextResponse.json({ setupRequired: true, status: "database_unavailable" }, { status: 503 }); }
}

export async function POST(request: Request) {
  try {
    await assertMutationRequest(request);
    const parsed = SetupSchema.safeParse(await request.json());
    if (!parsed.success) throw new HttpError(400, "INVALID_SETUP", "Enter a valid name, email, token, and password of at least 12 characters.");
    const expected = process.env.BOOTSTRAP_TOKEN;
    if (!expected || !equalSecret(parsed.data.token, expected)) throw new HttpError(403, "INVALID_SETUP_TOKEN", "That setup token is not valid.");
    await withSetupLock(async () => {
      const existing = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.singletonKey, "primary"));
      if (existing.length > 0) throw new HttpError(409, "SETUP_CLOSED", "This private installation already has an owner.");
      await auth.api.signUpEmail({ body: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), password: parsed.data.password }, headers: new Headers({ "x-oss-bootstrap": expected }) });
    });
    return NextResponse.json({ ok: true });
  } catch (error) { return jsonError(error); }
}
