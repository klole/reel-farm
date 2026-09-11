import { createHash } from "node:crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db, asset, draft, draftRevision, project, renderArtifact, renderOutbox, renderRequest, saveMutation, workerHeartbeat } from "@oss/db";
import type { ImageBlock, SlideDocument } from "@oss/contracts";
import { assertDocumentAssets, CANONICALIZATION_VERSION, DocumentValidationError, parseDocument, RENDERER_BUILD_ID } from "@oss/contracts";
import { createDefaultDocument } from "@oss/contracts";
import { hashDocument } from "@oss/core";
import { probeStorage } from "@oss/storage";
import { HttpError } from "./request";

export function payloadHash(value: string): string { return createHash("sha256").update(value).digest("hex"); }

export async function getProjects(workspaceId: string) {
  return db.select({ id: project.id, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt, lastSavedAt: project.lastSavedAt, draftId: draft.id, headRevisionId: draft.headRevisionId }).from(project).innerJoin(draft, eq(draft.projectId, project.id)).where(eq(project.workspaceId, workspaceId)).orderBy(desc(project.lastSavedAt));
}

export async function getProjectBundle(workspaceId: string, projectId: string) {
  const [row] = await db.select({ project, draft, revision: draftRevision }).from(project).innerJoin(draft, eq(draft.projectId, project.id)).leftJoin(draftRevision, eq(draftRevision.id, draft.headRevisionId)).where(and(eq(project.id, projectId), eq(project.workspaceId, workspaceId)));
  if (!row) throw new HttpError(404, "PROJECT_NOT_FOUND", "That project is not available.");
  const assets = await db.select({ id: asset.id, originalName: asset.originalName, mime: asset.mime, width: asset.width, height: asset.height, derivativeHash: asset.derivativeHash, thumbnailKey: asset.thumbnailKey, acceptanceState: asset.acceptanceState, rightsAssertion: asset.rightsAssertion }).from(asset).where(and(eq(asset.workspaceId, workspaceId), eq(asset.acceptanceState, "accepted"))).orderBy(desc(asset.createdAt));
  const heartbeat = await db.select().from(workerHeartbeat).where(eq(workerHeartbeat.workerName, "render-worker"));
  return { project: row.project, draft: row.draft, revision: row.revision, assets, worker: heartbeat[0] ?? null };
}

export async function createProject(workspaceId: string, userId: string, name: string) {
  const cleanName = name.trim().replace(/\s+/g, " ");
  if (cleanName.length < 1 || cleanName.length > 120) throw new HttpError(400, "INVALID_PROJECT_NAME", "Project names must be 1–120 characters.");
  return db.transaction(async (tx) => {
    const [newProject] = await tx.insert(project).values({ workspaceId, name: cleanName }).returning();
    if (!newProject) throw new Error("Project insert returned no row.");
    const [newDraft] = await tx.insert(draft).values({ projectId: newProject.id }).returning();
    if (!newDraft) throw new Error("Draft insert returned no row.");
    const document = createDefaultDocument();
    const [revision] = await tx.insert(draftRevision).values({ draftId: newDraft.id, revisionNumber: 1, document, contentHash: hashDocument(document), canonicalizationVersion: CANONICALIZATION_VERSION, createdBy: userId }).returning();
    if (!revision) throw new Error("Revision insert returned no row.");
    await tx.update(draft).set({ headRevisionId: revision.id, updatedAt: new Date() }).where(eq(draft.id, newDraft.id));
    return { project: newProject, draft: { ...newDraft, headRevisionId: revision.id }, revision };
  });
}

export async function renameProject(workspaceId: string, projectId: string, name: string) {
  const cleanName = name.trim().replace(/\s+/g, " ");
  if (cleanName.length < 1 || cleanName.length > 120) throw new HttpError(400, "INVALID_PROJECT_NAME", "Project names must be 1–120 characters.");
  const [updated] = await db.update(project).set({ name: cleanName, updatedAt: new Date() }).where(and(eq(project.id, projectId), eq(project.workspaceId, workspaceId))).returning();
  if (!updated) throw new HttpError(404, "PROJECT_NOT_FOUND", "That project is not available.");
  return updated;
}

export async function saveDraft(input: { workspaceId: string; userId: string; projectId: string; expectedHeadRevisionId: string; mutationId: string; documentInput: unknown }) {
  let document: SlideDocument;
  try { document = parseDocument(input.documentInput); } catch (error) { if (error instanceof DocumentValidationError) throw new HttpError(422, "DOCUMENT_INVALID", error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")); throw error; }
  const contentHash = hashDocument(document);
  return db.transaction(async (tx) => {
    const [owned] = await tx.select({ draft, project }).from(draft).innerJoin(project, eq(project.id, draft.projectId)).where(and(eq(draft.projectId, input.projectId), eq(project.workspaceId, input.workspaceId))).for("update");
    if (!owned) throw new HttpError(404, "PROJECT_NOT_FOUND", "That project is not available.");
    const imageIds = document.slides.flatMap((slide) => slide.blocks.filter((block): block is ImageBlock => block.type === "image" && Boolean(block.assetId)).map((block) => block.assetId as string));
    const imageRows = imageIds.length ? await tx.select({ id: asset.id, workspaceId: asset.workspaceId, derivativeHash: asset.derivativeHash, acceptanceState: asset.acceptanceState }).from(asset).where(and(eq(asset.workspaceId, input.workspaceId), inArray(asset.id, imageIds))) : [];
    try { assertDocumentAssets(document, new Map(imageRows.map((row) => [row.id, row])), input.workspaceId); } catch (error) { if (error instanceof DocumentValidationError) throw new HttpError(422, "ASSET_REFERENCE_INVALID", error.issues.map((issue) => issue.message).join("; ")); throw error; }
    const existingMutation = await tx.select().from(saveMutation).where(and(eq(saveMutation.draftId, owned.draft.id), eq(saveMutation.actorUserId, input.userId), eq(saveMutation.mutationId, input.mutationId)));
    if (existingMutation[0]) {
      if (existingMutation[0].payloadHash !== contentHash) throw new HttpError(409, "MUTATION_REUSED", "That save identity was already used for different content.");
      const [revision] = await tx.select().from(draftRevision).where(eq(draftRevision.id, existingMutation[0].revisionId));
      if (!revision) throw new Error("Idempotent save revision is missing.");
      return { revision, headRevisionId: owned.draft.headRevisionId, conflict: false, idempotent: true };
    }
    if (owned.draft.headRevisionId !== input.expectedHeadRevisionId) throw new HttpError(409, "REVISION_CONFLICT", "This draft changed in another tab. Your local edit is still available; reload only after preserving it.");
    const [current] = await tx.select().from(draftRevision).where(eq(draftRevision.id, owned.draft.headRevisionId));
    if (!current) throw new Error("Draft head revision is missing.");
    if (current.contentHash === contentHash) {
      await tx.insert(saveMutation).values({ draftId: owned.draft.id, actorUserId: input.userId, mutationId: input.mutationId, payloadHash: contentHash, revisionId: current.id });
      return { revision: current, headRevisionId: current.id, conflict: false, idempotent: false };
    }
    const [revision] = await tx.insert(draftRevision).values({ draftId: owned.draft.id, revisionNumber: current.revisionNumber + 1, document, contentHash, canonicalizationVersion: CANONICALIZATION_VERSION, createdBy: input.userId }).returning();
    if (!revision) throw new Error("Revision insert returned no row.");
    await tx.update(draft).set({ headRevisionId: revision.id, updatedAt: new Date() }).where(eq(draft.id, owned.draft.id));
    await tx.update(project).set({ lastSavedAt: new Date(), updatedAt: new Date() }).where(eq(project.id, input.projectId));
    await tx.insert(saveMutation).values({ draftId: owned.draft.id, actorUserId: input.userId, mutationId: input.mutationId, payloadHash: contentHash, revisionId: revision.id });
    return { revision, headRevisionId: revision.id, conflict: false, idempotent: false };
  });
}

export async function requestRender(input: { workspaceId: string; userId: string; projectId: string; revisionId: string; clientRequestId: string }) {
  return db.transaction(async (tx) => {
    const [owned] = await tx.select({ draft, project }).from(draft).innerJoin(project, eq(project.id, draft.projectId)).where(and(eq(project.id, input.projectId), eq(project.workspaceId, input.workspaceId)));
    if (!owned) throw new HttpError(404, "PROJECT_NOT_FOUND", "That project is not available.");
    const [revision] = await tx.select().from(draftRevision).where(and(eq(draftRevision.id, input.revisionId), eq(draftRevision.draftId, owned.draft.id)));
    if (!revision) throw new HttpError(404, "REVISION_NOT_FOUND", "That saved revision is not available.");
    const payload = `${owned.draft.id}:${revision.id}:${revision.contentHash}:${RENDERER_BUILD_ID}`;
    const payloadHashValue = payloadHash(payload);
    const existing = await tx.select().from(renderRequest).where(and(eq(renderRequest.draftId, owned.draft.id), eq(renderRequest.clientRequestId, input.clientRequestId)));
    if (existing[0]) {
      if (existing[0].payloadHash !== payloadHashValue) throw new HttpError(409, "RENDER_REQUEST_REUSED", "That render request identity belongs to a different revision.");
      return existing[0];
    }
    const [request] = await tx.insert(renderRequest).values({ workspaceId: input.workspaceId, draftId: owned.draft.id, revisionId: revision.id, clientRequestId: input.clientRequestId, payloadHash: payloadHashValue, rendererBuildId: RENDERER_BUILD_ID }).returning();
    if (!request) throw new Error("Render request insert returned no row.");
    await tx.insert(renderOutbox).values({ renderRequestId: request.id });
    return request;
  });
}

export async function getRenderForOwner(workspaceId: string, requestId: string) {
  const [request] = await db.select({ request: renderRequest, artifact: renderArtifact, revision: draftRevision }).from(renderRequest).leftJoin(renderArtifact, eq(renderArtifact.renderRequestId, renderRequest.id)).innerJoin(draftRevision, eq(draftRevision.id, renderRequest.revisionId)).where(and(eq(renderRequest.id, requestId), eq(renderRequest.workspaceId, workspaceId)));
  if (!request) throw new HttpError(404, "RENDER_NOT_FOUND", "That render request is not available.");
  return request;
}

export async function workerStatus() {
  let database: "ready" | "unavailable" = "ready";
  let storage: "ready" | "unavailable" = "ready";
  try { await db.execute(sql`SELECT 1`); } catch { database = "unavailable"; }
  try { await probeStorage(); } catch { storage = "unavailable"; }

  let heartbeat: (typeof workerHeartbeat.$inferSelect) | undefined;
  try {
    [heartbeat] = await db.select().from(workerHeartbeat).where(eq(workerHeartbeat.workerName, "render-worker"));
  } catch {
    heartbeat = undefined;
  }
  const heartbeatFresh = Boolean(heartbeat && Date.now() - heartbeat.lastSeenAt.getTime() < 12_000);
  const processAlive = heartbeatFresh && heartbeat?.status !== "stopped" && heartbeat?.status !== "failed";
  const rendererReady = processAlive && heartbeat?.status === "ready" && database === "ready" && storage === "ready";
  const workerState = processAlive ? (heartbeat?.status === "ready" && database === "ready" && storage === "ready" ? "ready" : "degraded") : "offline";
  return {
    database,
    storage,
    renderer: rendererReady ? "ready" as const : processAlive ? "degraded" as const : "offline" as const,
    worker: workerState as "ready" | "degraded" | "offline",
    heartbeat: heartbeat ? { ...heartbeat, lastSeenAt: heartbeat.lastSeenAt.toISOString() } : null
  };
}
