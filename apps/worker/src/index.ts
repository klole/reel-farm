import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import { PassThrough } from "node:stream";
import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import archiver from "archiver";
import { PgBoss } from "pg-boss";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import sharp from "sharp";
import { asset, db, draftRevision, renderArtifact, renderOutbox, renderRequest, workerHeartbeat, pool } from "@oss/db";
import { assertDocumentAssets, DocumentValidationError, documentContainsImageRequirement, parseDocument } from "@oss/contracts";
import type { AssetReference, ImageBlock } from "@oss/contracts";
import { makeExportManifest, makePostText } from "@oss/core";
import { embeddedFontCss, fontSetHash, FONT_SET_VERSION, renderSlideHtml } from "@oss/renderer/server";
import { readStorageFile, writeStorageFile, ensureMediaRoot } from "@oss/storage";

const QUEUE = "oss.render.v1";
const WORKER_NAME = "render-worker";
const WORKER_BUILD = process.env.RENDERER_BUILD_ID ?? "oss-renderer-0.1.0";
const LEASE_MS = 120_000;
const RENDER_DEADLINE_MS = 120_000;
let boss: PgBoss | undefined;
let browser: Browser | undefined;

const browserEnvironment = {
  PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin",
  HOME: "/tmp",
  LANG: "C.UTF-8",
  LC_ALL: "C.UTF-8",
  ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH } : {})
};

type RenderImage = { filename: string; storageKey: string; slideId: string; sha256: string; bytes: number; width: number; height: number; acceptedAssetHashes: string[] };

async function heartbeat(status: string, lastError: string | null = null): Promise<void> {
  await db.insert(workerHeartbeat).values({ workerName: WORKER_NAME, status, buildId: WORKER_BUILD, lastSeenAt: new Date(), lastError }).onConflictDoUpdate({ target: workerHeartbeat.workerName, set: { status, buildId: WORKER_BUILD, lastSeenAt: new Date(), lastError } });
}

async function resetStaleRequests(): Promise<void> {
  await db.execute(sql`UPDATE render_request SET status = 'queued', lease_token = NULL, lease_expires_at = NULL, error_code = 'WORKER_RECLAIMED', error_message = 'The renderer restarted while this request was active.' WHERE status = 'rendering' AND lease_expires_at < NOW()`);
  await db.execute(sql`UPDATE render_outbox SET sent_at = NULL, lease_token = NULL, lease_expires_at = NULL, available_at = NOW() WHERE sent_at IS NOT NULL AND render_request_id IN (SELECT id FROM render_request WHERE status = 'queued')`);
}

async function enqueueOutbox(): Promise<void> {
  if (!boss) return;
  const token = randomUUID();
  const rows = await db.execute<{ id: string; render_request_id: string }>(sql`WITH candidate AS (SELECT id FROM render_outbox WHERE sent_at IS NULL AND available_at <= NOW() AND (lease_expires_at IS NULL OR lease_expires_at < NOW()) ORDER BY created_at LIMIT 10 FOR UPDATE SKIP LOCKED) UPDATE render_outbox AS outbox SET lease_token = ${token}, lease_expires_at = NOW() + INTERVAL '30 seconds', attempts = outbox.attempts + 1 FROM candidate WHERE outbox.id = candidate.id RETURNING outbox.id, outbox.render_request_id`);
  for (const row of rows.rows) {
    try {
      await boss.send(QUEUE, { renderRequestId: row.render_request_id }, { singletonKey: `render-${row.render_request_id}`, singletonSeconds: 60 });
      await db.execute(sql`UPDATE render_outbox SET sent_at = NOW(), lease_token = NULL, lease_expires_at = NULL, last_error = NULL WHERE id = ${row.id} AND lease_token = ${token}`);
    } catch (error) {
      await db.execute(sql`UPDATE render_outbox SET lease_token = NULL, lease_expires_at = NULL, available_at = NOW() + INTERVAL '2 seconds', last_error = ${error instanceof Error ? error.message.slice(0, 500) : 'queue send failed'} WHERE id = ${row.id} AND lease_token = ${token}`);
      await heartbeat("degraded", "The durable render queue could not accept a request.");
    }
  }
}

async function claimRequest(requestId: string): Promise<{ request: typeof renderRequest.$inferSelect; revision: typeof draftRevision.$inferSelect } | null> {
  return db.transaction(async (tx) => {
    const [row] = await tx.select({ request: renderRequest, revision: draftRevision }).from(renderRequest).innerJoin(draftRevision, eq(draftRevision.id, renderRequest.revisionId)).where(eq(renderRequest.id, requestId)).for("update");
    if (!row || row.request.status === "ready" || row.request.status === "failed") return null;
    const leaseToken = randomUUID();
    const [updated] = await tx.update(renderRequest).set({ status: "rendering", attempts: row.request.attempts + 1, leaseToken, leaseExpiresAt: new Date(Date.now() + LEASE_MS), startedAt: row.request.startedAt ?? new Date(), errorCode: null, errorMessage: null }).where(and(eq(renderRequest.id, requestId), or(eq(renderRequest.status, "queued"), and(eq(renderRequest.status, "rendering"), lt(renderRequest.leaseExpiresAt, new Date()))))).returning();
    return updated ? { request: updated, revision: row.revision } : null;
  });
}

function assetDataUrl(mime: string, bytes: Buffer): string { return `data:${mime};base64,${bytes.toString("base64")}`; }
function digest(data: Buffer): string { return createHash("sha256").update(data).digest("hex"); }

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([operation, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error(`RENDER_TIMEOUT: ${label}`)), timeoutMs); })]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function zipBuffers(entries: Array<{ name: string; data: Buffer }>): Promise<Buffer> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough(); const chunks: Buffer[] = [];
  stream.on("data", (chunk: Buffer) => chunks.push(chunk));
  const ended = new Promise<void>((resolve, reject) => {
    stream.once("end", () => resolve());
    stream.once("error", reject);
  });
  archive.on("error", (error) => stream.destroy(error));
  archive.pipe(stream);
  for (const entry of entries) archive.append(entry.data, { name: entry.name });
  await archive.finalize();
  await ended;
  return Buffer.concat(chunks);
}

async function markFailure(requestId: string, leaseToken: string | null, errorCode: string, message: string, transient: boolean): Promise<void> {
  await db.transaction(async (tx) => {
    const [row] = await tx.select().from(renderRequest).where(eq(renderRequest.id, requestId)).for("update");
    if (!row || row.leaseToken !== leaseToken || row.status === "ready") return;
    const canRetry = transient && row.attempts < row.maxAttempts;
    await tx.update(renderRequest).set({ status: canRetry ? "queued" : "failed", errorCode, errorMessage: message.slice(0, 1000), leaseToken: null, leaseExpiresAt: null, completedAt: canRetry ? null : new Date() }).where(eq(renderRequest.id, requestId));
    if (canRetry) await tx.update(renderOutbox).set({ sentAt: null, availableAt: new Date(Date.now() + Math.min(30_000, 1_000 * 2 ** row.attempts)), leaseToken: null, leaseExpiresAt: null, lastError: message.slice(0, 500) }).where(eq(renderOutbox.renderRequestId, requestId));
  });
}

async function renderRequestById(requestId: string): Promise<void> {
  const claimed = await claimRequest(requestId);
  if (!claimed) return;
  const { request, revision } = claimed;
  let renderContext: BrowserContext | undefined;
  let page: Page | undefined;
  try {
    const document = parseDocument(revision.document);
    const deadline = Date.now() + RENDER_DEADLINE_MS;
    const imageIds = document.slides.flatMap((slide) => slide.blocks.filter((block): block is ImageBlock => block.type === "image" && Boolean(block.assetId)).map((block) => block.assetId as string));
    const assetRows = imageIds.length ? await db.select().from(asset).where(and(eq(asset.workspaceId, request.workspaceId), inArray(asset.id, imageIds))) : [];
    const references = new Map<string, AssetReference>(assetRows.map((row) => [row.id, { id: row.id, workspaceId: row.workspaceId, derivativeHash: row.derivativeHash, acceptanceState: row.acceptanceState }]));
    assertDocumentAssets(document, references, request.workspaceId);
    for (const slide of document.slides) if (documentContainsImageRequirement(slide)) {
      const image = slide.blocks.find((block) => block.type === "image");
      if (!image || !image.assetId) throw new DocumentValidationError([{ code: "custom", path: ["slides", slide.id], message: "This layout needs a selected local image before it can render." }]);
    }
    const sources: Record<string, { src: string; alt: string }> = {};
    for (const row of assetRows) {
      let derivative: Buffer;
      try { derivative = await readStorageFile(row.derivativeKey); } catch { throw new Error(`RENDER_IMAGE_MISSING: accepted derivative ${row.id} could not be read.`); }
      if (digest(derivative) !== row.derivativeHash) throw new Error(`RENDER_IMAGE_HASH_MISMATCH: accepted derivative ${row.id} changed after upload.`);
      sources[row.id] = { src: assetDataUrl(row.mime, derivative), alt: row.originalName };
    }
    if (!browser) browser = await chromium.launch({ headless: true, env: browserEnvironment, ...(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {}) });
    renderContext = await browser.newContext({ viewport: { width: document.canvas.width, height: document.canvas.height }, deviceScaleFactor: 1, javaScriptEnabled: true, acceptDownloads: false, serviceWorkers: "block" });
    page = await renderContext.newPage();
    await page.route("**/*", async (route) => { const url = route.request().url(); if (url.startsWith("data:") || url === "about:blank") await route.continue(); else await route.abort("blockedbyclient"); });
    const fontCss = embeddedFontCss();
    const images: RenderImage[] = [];
    for (const [index, slide] of document.slides.entries()) {
      if (Date.now() >= deadline) throw new Error("RENDER_TIMEOUT: render deadline exceeded before the next slide.");
      const html = renderSlideHtml(document, slide, sources, fontCss);
      await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 20_000 });
      const diagnostics = await withTimeout(page.evaluate(async () => {
        const browserDocument = window.document;
        await browserDocument.fonts.ready;
        const fontChecks = [browserDocument.fonts.check('400 16px "Inter"'), browserDocument.fonts.check('700 16px "Inter"'), browserDocument.fonts.check('400 16px "Source Serif 4"'), browserDocument.fonts.check('700 16px "Source Serif 4"')];
        const imageChecks = Array.from(browserDocument.images).map((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight }));
        const overflow = Array.from(browserDocument.querySelectorAll<HTMLElement>("[data-text-block]")).filter((node) => node.scrollHeight > node.clientHeight + 2).map((node) => node.dataset.textBlock ?? "unknown");
        return { fontChecks, imageChecks, overflow };
      }), 10_000, `font/image diagnostics for slide ${index + 1}`);
      if (diagnostics.fontChecks.some((value) => !value)) throw new Error("RENDER_FONT_MISSING: a required local font face did not load.");
      if (diagnostics.imageChecks.some((image) => !image.complete || image.width === 0 || image.height === 0)) throw new Error("RENDER_IMAGE_MISSING: a local derivative did not decode.");
      if (diagnostics.overflow.length) throw new Error(`TEXT_OVERFLOW: ${diagnostics.overflow.join(", ")}`);
      const jpeg = await page.screenshot({ type: "jpeg", quality: 95, animations: "disabled", timeout: 20_000, clip: { x: 0, y: 0, width: document.canvas.width, height: document.canvas.height } });
      const buffer = Buffer.from(jpeg);
      const metadata = await sharp(buffer).metadata();
      if (metadata.format !== "jpeg" || metadata.width !== document.canvas.width || metadata.height !== document.canvas.height) throw new Error("RENDER_OUTPUT_INVALID: final JPEG dimensions or format did not match the canvas.");
      const storageKey = `renders/${request.id}/attempt-${request.attempts}/${String(index + 1).padStart(2, "0")}.jpg`;
      await writeStorageFile(storageKey, buffer);
      const acceptedHashes = slide.blocks.filter((block): block is ImageBlock & { assetId: string } => block.type === "image" && typeof block.assetId === "string").map((block) => references.get(block.assetId)?.derivativeHash).filter((value): value is string => Boolean(value));
      images.push({ filename: `${String(index + 1).padStart(2, "0")}.jpg`, storageKey, slideId: slide.id, sha256: digest(buffer), bytes: buffer.byteLength, width: document.canvas.width, height: document.canvas.height, acceptedAssetHashes: acceptedHashes });
    }
    const postText = Buffer.from(makePostText(document), "utf8");
    const manifestImages = images.map((image) => ({ filename: image.filename, slideId: image.slideId, sha256: image.sha256, bytes: image.bytes, width: image.width, height: image.height, acceptedAssetHashes: image.acceptedAssetHashes, mime: "image/jpeg" as const }));
    const manifest = makeExportManifest({ document, revisionId: revision.id, revisionHash: revision.contentHash, fontSetVersion: FONT_SET_VERSION, fontSetHash: fontSetHash(), images: manifestImages, postTextSha256: digest(postText) });
    const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + "\n", "utf8");
    const zipKey = `renders/${request.id}/attempt-${request.attempts}/export.zip`;
    const imageEntries = await Promise.all(images.map(async (image) => ({ name: image.filename, data: await readStorageFile(image.storageKey) })));
    await writeStorageFile(zipKey, await zipBuffers([...imageEntries, { name: "post.txt", data: postText }, { name: "manifest.json", data: manifestBytes }]));
    await db.transaction(async (tx) => {
      const [current] = await tx.select().from(renderRequest).where(eq(renderRequest.id, request.id)).for("update");
      if (!current || current.leaseToken !== request.leaseToken || current.status === "ready") return;
      const [artifact] = await tx.insert(renderArtifact).values({ renderRequestId: request.id, revisionId: revision.id, revisionHash: revision.contentHash, rendererBuildId: WORKER_BUILD, fontSetHash: manifest.fontSetHash, canvasWidth: document.canvas.width, canvasHeight: document.canvas.height, images, manifest, zipKey }).onConflictDoNothing().returning();
      if (artifact) await tx.update(renderRequest).set({ status: "ready", leaseToken: null, leaseExpiresAt: null, completedAt: new Date(), errorCode: null, errorMessage: null }).where(eq(renderRequest.id, request.id));
    });
    await heartbeat("ready");
  } catch (error) {
    const permanent = error instanceof DocumentValidationError || (error instanceof Error && /TEXT_OVERFLOW|RENDER_FONT_MISSING|RENDER_IMAGE_MISSING|RENDER_IMAGE_HASH_MISMATCH|RENDER_OUTPUT_INVALID|UNSUPPORTED/.test(error.message));
    await markFailure(request.id, request.leaseToken, permanent ? "RENDER_VALIDATION_FAILED" : "RENDER_TRANSIENT_FAILED", error instanceof Error ? error.message : "The renderer failed.", !permanent);
    await heartbeat("degraded", error instanceof Error ? error.message.slice(0, 500) : "render failed");
  } finally {
    await page?.close().catch(() => undefined);
    await renderContext?.close().catch(() => undefined);
  }
}

async function main(): Promise<void> {
  await ensureMediaRoot();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required for the render worker.");
  boss = new PgBoss({ connectionString: databaseUrl });
  await boss.start();
  await boss.createQueue(QUEUE);
  await heartbeat("ready");
  await resetStaleRequests();
  await boss.work<{ renderRequestId: string }>(QUEUE, async (jobs) => { for (const job of jobs) if (job.data.renderRequestId) await renderRequestById(job.data.renderRequestId); });
  const interval = setInterval(() => { void enqueueOutbox().catch((error) => { void heartbeat("degraded", error instanceof Error ? error.message.slice(0, 500) : "outbox failure"); }); void resetStaleRequests().catch(() => undefined); void heartbeat("ready").catch(() => undefined); }, 2_000);
  const shutdown = async () => { clearInterval(interval); await heartbeat("stopped").catch(() => undefined); if (browser) await browser.close().catch(() => undefined); if (boss) await boss.stop().catch(() => undefined); await pool.end().catch(() => undefined); process.exit(0); };
  process.once("SIGTERM", () => void shutdown()); process.once("SIGINT", () => void shutdown());
  console.log(`render-worker ready (${WORKER_BUILD})`);
}

main().catch(async (error) => { console.error("worker_start_failed", error instanceof Error ? error.message : "unknown"); await heartbeat("failed", error instanceof Error ? error.message.slice(0, 500) : "unknown").catch(() => undefined); await pool.end().catch(() => undefined); process.exit(1); });
