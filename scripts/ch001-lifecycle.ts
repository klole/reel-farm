import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const baseUrl = process.env.E2E_BASE_URL;
const email = process.env.CH001_OWNER_EMAIL;
const password = process.env.CH001_OWNER_PASSWORD;
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r3/local");
const stage = process.env.CH001_LIFECYCLE_STAGE;
if (!baseUrl || !email || !password || !stage || !["worker-down", "after-restart", "after-recreate"].includes(stage)) throw new Error("Lifecycle stage, base URL, and synthetic owner credentials are required.");

type Journey = {
  projectId: string;
  headRevisionId: string;
  revisionId: string;
  acceptedAssetHashes: Array<{ id: string; derivativeHash: string }>;
  renderRequestId: string;
  zipSha256: string;
  entries: Array<{ filename: string; slideId: string; zipSha256: string; previewSha256: string }>;
};
type HealthDetails = { renderer: string; database?: string; storage?: string; worker?: string; heartbeat?: { lastSeenAt?: string } | null };
type RenderLookup = { request?: { status?: string }; artifact?: { revisionId?: string; images?: unknown[] } };

function sha256(value: Buffer): string { return createHash("sha256").update(value).digest("hex"); }
function assertCondition(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

async function readJourney(): Promise<Journey> {
  return JSON.parse(await readFile(resolve(evidenceDir, "journey-hashes.json"), "utf8")) as Journey;
}

async function jsonFetch(page: Page, path: string): Promise<{ status: number; contentType: string; body: unknown }> {
  return page.evaluate(async (inputPath) => {
    const response = await fetch(inputPath, { credentials: "same-origin", cache: "no-store" });
    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();
    return { status: response.status, contentType, body };
  }, path);
}

async function bytesFetch(page: Page, path: string): Promise<{ status: number; contentType: string; bytes: Buffer }> {
  const result = await page.evaluate(async (inputPath) => {
    const response = await fetch(inputPath, { credentials: "same-origin", cache: "no-store" });
    return { status: response.status, contentType: response.headers.get("content-type") ?? "", bytes: Array.from(new Uint8Array(await response.arrayBuffer())) };
  }, path);
  return { status: result.status, contentType: result.contentType, bytes: Buffer.from(result.bytes) };
}

async function signIn(page: Page, projectId: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Owner email").fill(email as string);
  await page.getByLabel("Password").fill(password as string);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/projects$/);
  await page.goto(`/projects/${projectId}`);
  await page.getByText("Saved to local database").waitFor({ state: "visible", timeout: 15_000 });
}

async function health(page: Page): Promise<HealthDetails> {
  const result = await jsonFetch(page, "/api/health/details");
  assertCondition(result.status === 200, `Health details returned HTTP ${result.status}.`);
  return result.body as HealthDetails;
}

async function waitForWorkerReady(page: Page, timeoutMs = 180_000): Promise<HealthDetails> {
  const deadline = Date.now() + timeoutMs;
  let last: HealthDetails | null = null;
  while (Date.now() < deadline) {
    try {
      last = await health(page);
      if (last.renderer === "ready") return last;
    } catch { /* retry while the recreated web service comes up */ }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  }
  throw new Error(`Worker did not become ready: ${JSON.stringify(last)}`);
}

async function launch(): Promise<{ browser: Browser; page: Page }> {
  const executablePath = process.env.BROWSER_EXECUTABLE_PATH || chromium.executablePath();
  const browser = await chromium.launch({
    headless: true,
    chromiumSandbox: true,
    executablePath,
    env: { PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin", HOME: "/tmp", LANG: "C.UTF-8", LC_ALL: "C.UTF-8", ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH } : {}) }
  });
  const context = await browser.newContext({ baseURL, serviceWorkers: "block", viewport: { width: 1280, height: 900 } });
  return { browser, page: await context.newPage() };
}

async function runWorkerDown(page: Page, journey: Journey): Promise<void> {
  await signIn(page, journey.projectId);
  const downHealth = await health(page);
  assertCondition(downHealth.renderer !== "ready", `Worker-down health incorrectly reported ready: ${JSON.stringify(downHealth)}`);

  const saveResponsePromise = page.waitForResponse((response) => response.request().method() === "POST" && new URL(response.url()).pathname.endsWith(`/api/projects/${journey.projectId}/draft`));
  await page.locator(".canvas-caption").click();
  await page.keyboard.press("Control+s");
  const saveResponse = await saveResponsePromise;
  assertCondition(saveResponse.ok(), `Save while worker was stopped returned HTTP ${saveResponse.status()}.`);
  await page.getByText("Saved to local database").waitFor({ state: "visible", timeout: 15_000 });

  const existingExport = await bytesFetch(page, `/api/render-requests/${journey.renderRequestId}/export`);
  assertCondition(existingExport.status === 200 && existingExport.contentType.includes("application/zip"), `Ready export was not downloadable while worker was stopped: ${existingExport.status} ${existingExport.contentType}`);
  assertCondition(sha256(existingExport.bytes) === journey.zipSha256, "Ready export bytes changed while the worker was stopped.");

  const renderResponsePromise = page.waitForResponse((response) => response.request().method() === "POST" && new URL(response.url()).pathname.endsWith(`/api/projects/${journey.projectId}/render`));
  await page.getByRole("button", { name: "Preview & export" }).click();
  const renderResponse = await renderResponsePromise;
  assertCondition(renderResponse.ok(), `Queued render request returned HTTP ${renderResponse.status()}.`);
  const renderPayload = await renderResponse.json() as { request: { id: string; status: string } };
  assertCondition(/^[0-9a-f-]{36}$/.test(renderPayload.request.id), "Queued render response did not expose a full request identity.");
  const dialog = page.getByRole("dialog", { name: "Final preview" });
  await dialog.getByText(/queued/i).waitFor({ state: "visible", timeout: 15_000 });
  await page.screenshot({ path: resolve(evidenceDir, "worker-down-queued.png"), fullPage: true });
  await writeFile(resolve(evidenceDir, "worker-down.json"), JSON.stringify({ stage: "worker-down", health: downHealth, save: { status: saveResponse.status() }, readyExport: { status: existingExport.status, contentType: existingExport.contentType, sha256: sha256(existingExport.bytes), matchesCanonical: sha256(existingExport.bytes) === journey.zipSha256 }, queuedRequest: renderPayload.request, screenshot: "worker-down-queued.png" }, null, 2) + "\n", { mode: 0o640 });
}

async function runAfterRestart(page: Page, journey: Journey): Promise<void> {
  await signIn(page, journey.projectId);
  const readyHealth = await waitForWorkerReady(page);
  const down = JSON.parse(await readFile(resolve(evidenceDir, "worker-down.json"), "utf8")) as { queuedRequest: { id: string; status: string } };
  const deadline = Date.now() + 180_000;
  let request: RenderLookup | null = null;
  while (Date.now() < deadline) {
    const result = await jsonFetch(page, `/api/render-requests/${down.queuedRequest.id}`);
    request = result.body as RenderLookup;
    if (result.status === 200 && request.request?.status === "ready" && request.artifact) break;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000));
  }
  assertCondition(request?.request?.status === "ready" && request.artifact?.revisionId && request.artifact.images, `Queued request did not complete after worker restart: ${JSON.stringify(request?.request)}`);
  const readyRequest = request as { request: { status: string }; artifact: { revisionId: string; images: unknown[] } };
  await writeFile(resolve(evidenceDir, "lifecycle-restart.json"), JSON.stringify({ stage: "after-restart", health: readyHealth, queuedRequestId: down.queuedRequest.id, status: readyRequest.request.status, revisionId: readyRequest.artifact.revisionId, imageCount: readyRequest.artifact.images.length }, null, 2) + "\n", { mode: 0o640 });
}

async function runAfterRecreate(page: Page, journey: Journey): Promise<void> {
  await signIn(page, journey.projectId);
  const healthAfter = await waitForWorkerReady(page);
  const bundle = await jsonFetch(page, `/api/projects/${journey.projectId}`);
  assertCondition(bundle.status === 200, `Project bundle after recreation returned HTTP ${bundle.status}.`);
  const data = bundle.body as { project: { id: string }; draft: { headRevisionId: string | null }; revision: { id: string; contentHash: string } | null; assets: Array<{ id: string; derivativeHash: string }> };
  assertCondition(data.project.id === journey.projectId, "Project identity changed after container recreation.");
  assertCondition(data.draft.headRevisionId === journey.headRevisionId && data.revision?.id === journey.revisionId, "Saved revision identity changed after container recreation.");
  const expectedAssets = new Map(journey.acceptedAssetHashes.map((asset) => [asset.id, asset.derivativeHash]));
  assertCondition(data.assets.length >= expectedAssets.size, "Accepted asset count decreased after container recreation.");
  for (const asset of data.assets) if (expectedAssets.has(asset.id)) assertCondition(expectedAssets.get(asset.id) === asset.derivativeHash, `Accepted asset hash changed for ${asset.id}.`);
  const existingExport = await bytesFetch(page, `/api/render-requests/${journey.renderRequestId}/export`);
  assertCondition(existingExport.status === 200 && existingExport.contentType.includes("application/zip"), `Canonical export was not downloadable after recreation: ${existingExport.status} ${existingExport.contentType}`);
  assertCondition(sha256(existingExport.bytes) === journey.zipSha256, "Canonical ZIP hash changed after container recreation.");
  const imageHashes: Array<{ filename: string; sha256: string; matchesJourney: boolean }> = [];
  for (const [index, entry] of journey.entries.entries()) {
    const image = await bytesFetch(page, `/api/render-requests/${journey.renderRequestId}/images/${index}`);
    assertCondition(image.status === 200 && image.contentType.includes("image/jpeg"), `Canonical image ${entry.filename} was not available after recreation.`);
    const imageHash = sha256(image.bytes);
    imageHashes.push({ filename: entry.filename, sha256: imageHash, matchesJourney: imageHash === entry.zipSha256 });
    assertCondition(imageHash === entry.zipSha256, `Canonical image ${entry.filename} changed after recreation.`);
  }
  await page.screenshot({ path: resolve(evidenceDir, "after-recreate.png"), fullPage: true });
  await writeFile(resolve(evidenceDir, "same-data-restart.json"), JSON.stringify({ stage: "after-recreate", health: healthAfter, projectId: data.project.id, headRevisionId: data.draft.headRevisionId, revisionId: data.revision?.id, contentHash: data.revision?.contentHash, acceptedAssetHashes: data.assets.filter((asset) => expectedAssets.has(asset.id)), readyRenderId: journey.renderRequestId, zipSha256: sha256(existingExport.bytes), imageHashes, screenshot: "after-recreate.png" }, null, 2) + "\n", { mode: 0o640 });
}

const journey = await readJourney();
const launched = await launch();
try {
  if (stage === "worker-down") await runWorkerDown(launched.page, journey);
  else if (stage === "after-restart") await runAfterRestart(launched.page, journey);
  else await runAfterRecreate(launched.page, journey);
} finally {
  await launched.page.context().close().catch(() => undefined);
  await launched.browser.close().catch(() => undefined);
}
