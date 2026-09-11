import { NextResponse } from "next/server";
import { z } from "zod";
import { assertMutationRequest, jsonError, requireOwner } from "../../../src/lib/request";
import { createProject, getProjects } from "../../../src/lib/domain";

export const runtime = "nodejs";
const CreateProject = z.object({ name: z.string() }).strict();

export async function GET(request: Request) {
  try { const owner = await requireOwner(request); return NextResponse.json({ projects: await getProjects(owner.workspace.id) }); } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try { await assertMutationRequest(request); const owner = await requireOwner(request); const parsed = CreateProject.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "A project name is required." } }, { status: 400 }); const result = await createProject(owner.workspace.id, owner.session.user.id, parsed.data.name); return NextResponse.json(result, { status: 201 }); } catch (error) { return jsonError(error); }
}
