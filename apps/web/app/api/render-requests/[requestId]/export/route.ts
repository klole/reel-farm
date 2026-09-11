import { NextResponse } from "next/server";
import { jsonError, requireOwner } from "../../../../../src/lib/request";
import { getRenderForOwner } from "../../../../../src/lib/domain";
import { readStorageFile } from "@oss/storage";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ requestId: string }> }) {
  try { const { requestId } = await context.params; const owner = await requireOwner(request); const result = await getRenderForOwner(owner.workspace.id, requestId); if (!result.artifact) return NextResponse.json({ error: { code: "ARTIFACT_NOT_READY", message: "The ordered export is not ready." } }, { status: 409 }); const body = await readStorageFile(result.artifact.zipKey); return new Response(body as unknown as BodyInit, { headers: { "Content-Type": "application/zip", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Disposition": `attachment; filename="oss-slideshow-${requestId.slice(0, 8)}.zip"` } }); } catch (error) { return jsonError(error); }
}
