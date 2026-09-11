import { NextResponse } from "next/server";
import { jsonError, requireOwner } from "../../../../../../src/lib/request";
import { getRenderForOwner } from "../../../../../../src/lib/domain";
import { readStorageFile } from "@oss/storage";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ requestId: string; index: string }> }) {
  try { const { requestId, index } = await context.params; const owner = await requireOwner(request); const result = await getRenderForOwner(owner.workspace.id, requestId); if (!result.artifact) return NextResponse.json({ error: { code: "ARTIFACT_NOT_READY", message: "The final image is not ready." } }, { status: 409 }); const item = (result.artifact.images as Array<{ filename: string; storageKey: string; sha256: string }>)[Number(index)]; if (!item || !Number.isInteger(Number(index))) return NextResponse.json({ error: { code: "IMAGE_NOT_FOUND", message: "That slide image is not available." } }, { status: 404 }); const body = await readStorageFile(item.storageKey); return new Response(body as unknown as BodyInit, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", ETag: `"${item.sha256}"` } }); } catch (error) { return jsonError(error); }
}
