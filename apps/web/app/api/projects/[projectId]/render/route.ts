import { NextResponse } from "next/server";
import { z } from "zod";
import { assertMutationRequest, jsonError, requireOwner } from "../../../../../src/lib/request";
import { requestRender } from "../../../../../src/lib/domain";

export const runtime = "nodejs";
const RenderInput = z.object({ revisionId: z.string().uuid(), clientRequestId: z.string().uuid() }).strict();

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try { await assertMutationRequest(request); const { projectId } = await context.params; const owner = await requireOwner(request); const parsed = RenderInput.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_RENDER_REQUEST", message: "The saved revision and render identity are required." } }, { status: 400 }); const result = await requestRender({ workspaceId: owner.workspace.id, userId: owner.session.user.id, projectId, revisionId: parsed.data.revisionId, clientRequestId: parsed.data.clientRequestId }); return NextResponse.json({ request: result }, { status: 202 }); } catch (error) { return jsonError(error); }
}
