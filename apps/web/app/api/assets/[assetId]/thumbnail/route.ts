import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { asset, db } from "@oss/db";
import { readStorageFile } from "@oss/storage";
import { jsonError, requireOwner } from "../../../../../src/lib/request";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ assetId: string }> }) {
  try { const { assetId } = await context.params; const owner = await requireOwner(request); const [row] = await db.select().from(asset).where(and(eq(asset.id, assetId), eq(asset.workspaceId, owner.workspace.id), eq(asset.acceptanceState, "accepted"))); if (!row) return NextResponse.json({ error: { code: "ASSET_NOT_FOUND", message: "That local image is unavailable." } }, { status: 404 }); const body = await readStorageFile(row.thumbnailKey); return new Response(body as unknown as BodyInit, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Disposition": "inline" } }); } catch (error) { return jsonError(error); }
}
