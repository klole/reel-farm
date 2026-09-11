import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { maybeSession } from "../../src/lib/auth";
import ProjectsView from "../../src/components/ProjectsView";
import { getProjects } from "../../src/lib/domain";
import { db, workspace } from "@oss/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await maybeSession(new Headers(await headers()));
  if (!session) redirect("/login");
  const [ownerWorkspace] = await db.select().from(workspace).where(eq(workspace.ownerUserId, session.user.id));
  if (!ownerWorkspace) redirect("/setup");
  const projects = await getProjects(ownerWorkspace.id);
  return <ProjectsView initialProjects={projects.map((project) => ({ ...project, createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt.toISOString(), lastSavedAt: project.lastSavedAt.toISOString() }))} ownerName={session.user.name} />;
}
