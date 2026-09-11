import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { asset, db } from "@oss/db";
import { discardStagedAsset, promoteAsset, removeStorageFile, stageAsset, MAX_UPLOAD_BYTES } from "@oss/storage";
import { assertMutationRequest, jsonError, requireOwner } from "../../../src/lib/request";

export const runtime = "nodejs";
const MAX_BATCH_FILES = 20;
const MAX_BATCH_BYTES = 100 * 1024 * 1024;
// Multipart metadata is bounded separately from image bytes. The stream
// guard runs before request.formData(), so a missing or dishonest
// Content-Length cannot cause an unbounded multipart parse.
const MAX_MULTIPART_OVERHEAD = 2 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_BATCH_BYTES + MAX_MULTIPART_OVERHEAD;

class UploadRequestTooLarge extends Error {
  constructor() { super("The upload request exceeds the safe multipart limit."); this.name = "UploadRequestTooLarge"; }
}

function boundedBodyRequest(request: Request): Request {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_REQUEST_BYTES)) throw new UploadRequestTooLarge();
  if (!request.body) return request;
  const reader = request.body.getReader();
  let received = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = await reader.read();
        if (chunk.done) { controller.close(); return; }
        received += chunk.value.byteLength;
        if (received > MAX_REQUEST_BYTES) {
          await reader.cancel("multipart request limit exceeded");
          controller.error(new UploadRequestTooLarge());
          return;
        }
        controller.enqueue(chunk.value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel(reason) { await reader.cancel(reason); }
  });
  return new Request(request, { body: stream, duplex: "half" } as RequestInit);
}

function displayName(name: string): string {
  return Array.from(name, (character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f ? "_" : character;
  }).join("").slice(0, 255) || "untitled-image";
}

export async function GET(request: Request) {
  try { const owner = await requireOwner(request); const rows = await db.select({ id: asset.id, originalName: asset.originalName, mime: asset.mime, width: asset.width, height: asset.height, derivativeHash: asset.derivativeHash, thumbnailKey: asset.thumbnailKey, rightsAssertion: asset.rightsAssertion, createdAt: asset.createdAt }).from(asset).where(and(eq(asset.workspaceId, owner.workspace.id), eq(asset.acceptanceState, "accepted"))).orderBy(desc(asset.createdAt)); return NextResponse.json({ assets: rows }); } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try {
    await assertMutationRequest(request);
    const owner = await requireOwner(request);
    const form = await boundedBodyRequest(request).formData();
    const values = form.getAll("files").filter((value): value is File => value instanceof File);
    const rightsAssertion = form.get("rightsAssertion") === "true";
    if (!rightsAssertion) return NextResponse.json({ error: { code: "RIGHTS_ASSERTION_REQUIRED", message: "Confirm that you own or have permission to use each image." } }, { status: 400 });
    if (values.length === 0 || values.length > MAX_BATCH_FILES) return NextResponse.json({ error: { code: "BATCH_LIMIT", message: "Choose between 1 and 20 images per batch." } }, { status: 400 });
    if (values.some((file) => file.size > MAX_UPLOAD_BYTES) || values.reduce((sum, file) => sum + file.size, 0) > MAX_BATCH_BYTES) return NextResponse.json({ error: { code: "UPLOAD_LIMIT", message: "The batch exceeds the safe upload limit." } }, { status: 413 });
    const results: Array<Record<string, unknown>> = [];
    for (const file of values) {
      let staged: Awaited<ReturnType<typeof stageAsset>> | undefined;
      try {
        staged = await stageAsset(owner.workspace.id, displayName(file.name), Buffer.from(await file.arrayBuffer()));
        await promoteAsset(staged);
        const [saved] = await db.insert(asset).values({ id: staged.id, workspaceId: owner.workspace.id, originalName: displayName(file.name), sourceKind: "upload", uploadedBy: owner.session.user.id, rightsAssertion: true, originalHash: staged.normalized.originalHash, derivativeHash: staged.normalized.derivativeHash, mime: staged.normalized.mime, width: staged.normalized.width, height: staged.normalized.height, originalBytes: staged.normalized.original.byteLength, derivativeBytes: staged.normalized.derivative.byteLength, storageKey: staged.finalKeys.original, derivativeKey: staged.finalKeys.derivative, thumbnailKey: staged.finalKeys.thumbnail, acceptanceState: "accepted" }).returning();
        if (!saved) throw new Error("Asset insert returned no row.");
        results.push({ ok: true, asset: { id: saved.id, originalName: saved.originalName, mime: saved.mime, width: saved.width, height: saved.height, derivativeHash: saved.derivativeHash, thumbnailUrl: `/api/assets/${saved.id}/thumbnail` } });
      } catch (error) {
        if (staged) {
          try { await discardStagedAsset(staged); } catch { /* preserve the original upload error */ }
          await Promise.all(Object.values(staged.finalKeys).map((key) => removeStorageFile(key).catch(() => undefined)));
        }
        results.push({ ok: false, filename: displayName(file.name), code: error instanceof Error && "code" in error ? String((error as { code: unknown }).code) : "UPLOAD_FAILED", message: error instanceof Error ? error.message : "The image was not accepted." });
      }
    }
    return NextResponse.json({ results }, { status: results.some((result) => result.ok) ? 201 : 422 });
  } catch (error) {
    if (error instanceof UploadRequestTooLarge) return NextResponse.json({ error: { code: "UPLOAD_LIMIT", message: error.message } }, { status: 413 });
    return jsonError(error);
  }
}
