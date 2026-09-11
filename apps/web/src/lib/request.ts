import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, workspace } from "@oss/db";
import { getSession } from "./auth";

export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

export function jsonError(error: unknown): NextResponse {
  if (error instanceof HttpError) return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.status });
  console.error("request_failure", error instanceof Error ? error.name : "unknown");
  return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "The local operation could not be completed." } }, { status: 500 });
}

export async function requireOwner(request: Request) {
  try {
    const session = await getSession(request.headers);
    const [ownerWorkspace] = await db.select().from(workspace).where(eq(workspace.ownerUserId, session.user.id));
    if (!ownerWorkspace) throw new HttpError(403, "WORKSPACE_NOT_FOUND", "The owner workspace is unavailable.");
    return { session, workspace: ownerWorkspace };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "UNAUTHENTICATED", "Sign in is required.");
  }
}

function sameSecret(a: string, b: string): boolean {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function assertMutationRequest(request: Request): Promise<void> {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (origin && origin !== expected) throw new HttpError(403, "ORIGIN_REJECTED", "The request origin is not allowed.");
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new HttpError(403, "ORIGIN_REJECTED", "Cross-site state changes are not allowed.");
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("oss_csrf")?.value;
  const headerToken = request.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken || !sameSecret(cookieToken, headerToken)) throw new HttpError(403, "CSRF_REJECTED", "Refresh the page and try again.");
}

export function requestId(request: Request): string {
  const supplied = request.headers.get("x-request-id");
  return supplied && /^[a-zA-Z0-9._-]{1,80}$/.test(supplied) ? supplied : createHash("sha256").update(randomBytes(16)).digest("hex").slice(0, 24);
}
