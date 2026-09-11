import { NextResponse } from "next/server";
import { z } from "zod";
import { assertMutationRequest, jsonError, requireOwner } from "../../../../../src/lib/request";
import { getProjectBundle, saveDraft } from "../../../../../src/lib/domain";

export const runtime = "nodejs";
const Save = z.object({ expectedHeadRevisionId: z.string().uuid(), mutationId: z.string().uuid(), document: z.unknown() }).strict();

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try { const { projectId } = await context.params; const owner = await requireOwner(request); return NextResponse.json(await getProjectBundle(owner.workspace.id, projectId)); } catch (error) { return jsonError(error); }
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try { await assertMutationRequest(request); const { projectId } = await context.params; const owner = await requireOwner(request); const parsed = Save.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_SAVE", message: "The save payload is incomplete." } }, { status: 400 }); const result = await saveDraft({ workspaceId: owner.workspace.id, userId: owner.session.user.id, projectId, expectedHeadRevisionId: parsed.data.expectedHeadRevisionId, mutationId: parsed.data.mutationId, documentInput: parsed.data.document }); return NextResponse.json({ revision: result.revision, idempotent: result.idempotent }); } catch (error) { return jsonError(error); }
}
