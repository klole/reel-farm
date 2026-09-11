import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { maybeSession } from "../../../src/lib/auth";
import { getProjectBundle } from "../../../src/lib/domain";
import { db, workspace } from "@oss/db";
import { eq } from "drizzle-orm";
import EditorView from "../../../src/components/EditorView";

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await maybeSession(new Headers(await headers()));
  if (!session) redirect("/login");
  const [ownerWorkspace] = await db.select().from(workspace).where(eq(workspace.ownerUserId, session.user.id));
  if (!ownerWorkspace) redirect("/setup");
  try { const bundle = await getProjectBundle(ownerWorkspace.id, (await params).projectId); return <EditorView projectId={bundle.project.id} initialProjectName={bundle.project.name} />; } catch { notFound(); }
}
