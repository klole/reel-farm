import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, workspace } from "@oss/db";
import { maybeSession } from "../src/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await db.select({ id: workspace.id }).from(workspace).where(eq(workspace.singletonKey, "primary"));
  if (rows.length === 0) redirect("/setup");
  const session = await maybeSession(new Headers(await headers()));
  if (!session) redirect("/login");
  redirect("/projects");
}
