import { NextResponse } from "next/server";
import { z } from "zod";
import { assertMutationRequest, jsonError, requireOwner } from "../../../../src/lib/request";
import { getProjectBundle, renameProject } from "../../../../src/lib/domain";

export const runtime = "nodejs";
const Rename = z.object({ name: z.string() }).strict();

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try { const { projectId } = await context.params; const owner = await requireOwner(request); return NextResponse.json(await getProjectBundle(owner.workspace.id, projectId)); } catch (error) { return jsonError(error); }
}

export async function PATCH(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try { await assertMutationRequest(request); const { projectId } = await context.params; const owner = await requireOwner(request); const parsed = Rename.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "A project name is required." } }, { status: 400 }); return NextResponse.json({ project: await renameProject(owner.workspace.id, projectId, parsed.data.name) }); } catch (error) { return jsonError(error); }
}
