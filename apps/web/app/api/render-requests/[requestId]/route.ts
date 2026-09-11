import { NextResponse } from "next/server";
import { jsonError, requireOwner } from "../../../../src/lib/request";
import { getRenderForOwner, workerStatus } from "../../../../src/lib/domain";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ requestId: string }> }) {
  try { const { requestId } = await context.params; const owner = await requireOwner(request); const result = await getRenderForOwner(owner.workspace.id, requestId); return NextResponse.json({ request: result.request, artifact: result.artifact, worker: await workerStatus() }); } catch (error) { return jsonError(error); }
}
