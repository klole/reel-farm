import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { createSyntheticFixtureDirectory } from "../helpers/fixtures.ts";
import { readZipEntries } from "../helpers/zip.ts";
import { recordGateEvidence } from "../helpers/gates.ts";

const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r2/local");
const demoCopy = [
  ["Make room for one thing", "An original demo about arranging a small workspace."],
  ["Start with the surface", "Move the items you are not using into a tray."],
  ["Keep the next tool nearby", "This example uses a notebook, a pen, and a glass of water."],
  ["Give small items a place", "A single container is enough for this example."],
  ["Leave some space open", "Let the main subject have room in the composition."],
  ["Choose your next step", "Write one small task before adding more."],
  ["Make it your own", "Replace these slides with your own images and words."]
] as const;
const layouts = ["Photo caption", "Editorial card", "Statement", "Editorial card", "Statement", "Photo caption", "Statement"] as const;

function sha256(data: Buffer): string { return createHash("sha256").update(data).digest("hex"); }

async function fillSelectedSlide(page: import("@playwright/test").Page, headline: string, body: string): Promise<void> {
  await page.getByRole("button", { name: "headline", exact: true }).click();
  await page.getByLabel("Headline").fill(headline);
  await page.getByRole("button", { name: "body", exact: true }).click();
  await page.getByLabel("Supporting text").fill(body);
}

async function selectLayout(page: import("@playwright/test").Page, layout: string): Promise<void> {
  await page.getByRole("button", { name: layout, exact: true }).click();
}

test("completes the seven-slide local UI journey and verifies exact preview/export bytes", async ({ page }) => {
  await mkdir(evidenceDir, { recursive: true });
  const fixtures = await createSyntheticFixtureDirectory();

  if (process.env.CH001_E2E_SETUP === "1") {
    await page.goto("/setup");
    await page.getByLabel("One-time setup token").fill(process.env.CH001_BOOTSTRAP_TOKEN ?? "");
    await page.getByLabel("Owner name").fill("Synthetic Owner");
    await page.getByLabel("Owner email").fill(process.env.CH001_OWNER_EMAIL ?? "");
    await page.getByLabel("Password").fill(process.env.CH001_OWNER_PASSWORD ?? "");
    await page.getByRole("button", { name: "Create private owner" }).click();
    await expect(page).toHaveURL(/\/login\?created=1$/);
  }

  await page.goto("/login");
  await page.getByLabel("Owner email").fill(process.env.CH001_OWNER_EMAIL ?? "");
  await page.getByLabel("Password").fill(process.env.CH001_OWNER_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.screenshot({ path: resolve(evidenceDir, "projects.png"), fullPage: true });

  await page.getByLabel("New project name").fill("A little room to focus");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+$/);
  await expect(page.getByText("Saved to local database")).toBeVisible();
  await page.getByLabel("Post title").fill("A little room to focus");
  await page.getByLabel("Caption").fill("A seven-slide example created entirely with local images and manual text.");
  await page.getByLabel("Hashtags").fill("#workspace #slideshow");

  await selectLayout(page, layouts[0]);
  await page.getByRole("button", { name: "image", exact: true }).click();
  await page.locator("input[type=checkbox]").check();
  await page.locator("#asset-upload").setInputFiles(fixtures.portrait);
  await expect(page.locator(".asset-choice")).toHaveCount(1);
  await page.locator(".asset-choice").first().click();
  await fillSelectedSlide(page, demoCopy[0][0], demoCopy[0][1]);
  // Upload while the editor has unsaved text. The asset refresh must not
  // replace the local document, selection, or session history.
  await page.locator("#asset-upload").setInputFiles(fixtures.landscape);
  await expect(page.locator(".asset-choice")).toHaveCount(2);
  await expect(page.getByLabel("Headline")).toHaveValue(demoCopy[0][0]);
  await expect(page.getByRole("button", { name: "body", exact: true })).toHaveClass(/active/);
  await expect(page.getByRole("button", { name: "Undo" })).toBeEnabled();
  await page.getByRole("button", { name: "Undo" }).click();
  await page.getByRole("button", { name: "Redo" }).click();
  await expect(page.getByLabel("Headline")).toHaveValue(demoCopy[0][0]);

  for (let index = 1; index < demoCopy.length; index += 1) {
    await page.getByRole("button", { name: "Add slide" }).click();
    await expect(page.locator(".slide-thumb")).toHaveCount(index + 1);
    await selectLayout(page, layouts[index]);
    if (layouts[index] !== "Statement") {
      await page.getByRole("button", { name: "image", exact: true }).click();
      await page.locator(".asset-choice").first().click();
    }
    await fillSelectedSlide(page, demoCopy[index][0], demoCopy[index][1]);
  }

  // Exercise the required non-drag structural operation while returning to
  // the original seven-slide deck for the final export.
  await page.getByRole("button", { name: "Duplicate selected" }).click();
  await expect(page.locator(".slide-thumb")).toHaveCount(8);
  await page.getByRole("button", { name: "Move earlier" }).click();
  await page.getByRole("button", { name: "Remove selected" }).click();
  await expect(page.locator(".slide-thumb")).toHaveCount(7);
  await page.getByRole("button", { name: "Add slide" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".slide-thumb")).toHaveCount(8);
  await page.getByRole("button", { name: "Remove selected" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".slide-thumb")).toHaveCount(7);
  await page.screenshot({ path: resolve(evidenceDir, "editor-populated.png"), fullPage: true });

  await page.getByRole("button", { name: "4:5 feed", exact: true }).click();
  await expect(page.getByText("4:5 feed · 7/20 slides")).toBeVisible();
  await expect(page.getByText("Saved to local database")).toBeVisible({ timeout: 15_000 });
  await page.screenshot({ path: resolve(evidenceDir, "editor-alternate-feed.png"), fullPage: true });
  await page.getByRole("button", { name: "9:16 portrait", exact: true }).click();
  await expect(page.getByText("9:16 portrait · 7/20 slides")).toBeVisible();
  await expect(page.getByText("Saved to local database")).toBeVisible({ timeout: 15_000 });
  await page.goto("/projects");
  const projectCard = page.locator(".project-card").filter({ hasText: "A little room to focus" });
  await projectCard.getByRole("link", { name: "Open studio" }).click();
  await expect(page.getByLabel("Headline")).toHaveValue(demoCopy[0][0], { timeout: 15_000 });

  await page.keyboard.press("Control+s");
  await expect(page.getByText("Saved to local database")).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Preview & export" }).click();
  const dialog = page.getByRole("dialog", { name: "Final preview" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Ready to hand off")).toBeVisible({ timeout: 180_000 });
  await page.screenshot({ path: resolve(evidenceDir, "final-preview.png"), fullPage: true });

  const requestLabel = await dialog.locator(".preview-meta").first().textContent();
  const requestMatch = requestLabel?.match(/Request ([0-9a-f-]+)/i);
  if (!requestMatch?.[1]) throw new Error("The final preview did not expose a render request identity.");
  const requestId = requestMatch[1];
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("link", { name: "Download ordered ZIP" }).click();
  const download = await downloadPromise;
  const zipPath = resolve(evidenceDir, "a-little-room-to-focus.zip");
  await download.saveAs(zipPath);
  const zip = await readFile(zipPath);
  const entries = readZipEntries(zip);
  expect([...entries.keys()].sort()).toEqual(["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "manifest.json", "post.txt"]);
  const manifest = JSON.parse(entries.get("manifest.json")?.data.toString("utf8") ?? "null") as { revisionId: string; images: Array<{ filename: string; slideId: string; sha256: string; bytes: number; width: number; height: number }>; postTextSha256: string };
  const post = entries.get("post.txt")?.data;
  if (!post) throw new Error("Export did not include post.txt.");
  expect(sha256(post)).toBe(manifest.postTextSha256);
  expect(post.toString("utf8")).toBe("Title: A little room to focus\nCaption: A seven-slide example created entirely with local images and manual text.\nHashtags: #workspace #slideshow\n");
  expect(manifest.images).toHaveLength(7);

  const imageChecks: Array<Record<string, unknown>> = [];
  for (let index = 0; index < 7; index += 1) {
    const filename = `${String(index + 1).padStart(2, "0")}.jpg`;
    const entry = entries.get(filename);
    if (!entry) throw new Error(`Missing ${filename} in export.`);
    const preview = await page.evaluate(async (path) => Array.from(new Uint8Array(await (await fetch(path)).arrayBuffer())), `/api/render-requests/${requestId}/images/${index}`);
    const previewBytes = Buffer.from(preview);
    const metadata = await sharp(entry.data).metadata();
    const item = manifest.images[index];
    if (!item) throw new Error(`Manifest is missing ${filename}.`);
    expect(sha256(entry.data)).toBe(item.sha256);
    expect(sha256(previewBytes)).toBe(item.sha256);
    expect(previewBytes.equals(entry.data)).toBe(true);
    expect(item.filename).toBe(filename);
    imageChecks.push({ filename, slideId: item.slideId, zipSha256: sha256(entry.data), previewSha256: sha256(previewBytes), bytes: entry.data.byteLength, width: metadata.width, height: metadata.height });
  }
  const hashReportPath = resolve(evidenceDir, "journey-hashes.json");
  await writeFile(hashReportPath, JSON.stringify({ scope: "real authenticated seven-slide UI journey", projectTitle: "A little room to focus", requestId, revisionId: manifest.revisionId, postTextSha256: manifest.postTextSha256, zipSha256: sha256(zip), entries: imageChecks }, null, 2) + "\n", { mode: 0o640 });
  await dialog.getByRole("button", { name: "Close" }).click();
  const desktopViewport = page.viewportSize();
  await page.setViewportSize({ width: 390, height: 844 });
  const accessibility = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("button, a, input, textarea, select"));
    const unlabeled = elements.filter((element) => {
      const label = element.getAttribute("aria-label")
        || element.getAttribute("title")
        || element.textContent?.trim()
        || (element.id && document.querySelector(`label[for="${element.id}"]`)?.textContent?.trim());
      return !label;
    }).map((element) => element.outerHTML.slice(0, 160));
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      unlabeled
    };
  });
  expect(accessibility.unlabeled).toEqual([]);
  await expect(page.getByRole("button", { name: "Preview & export" })).toBeVisible();
  await page.screenshot({ path: resolve(evidenceDir, "editor-narrow.png"), fullPage: true });
  await page.setViewportSize({ width: desktopViewport?.width ?? 1280, height: desktopViewport?.height ?? 900 });
  await writeFile(resolve(evidenceDir, "accessibility-report.json"), JSON.stringify({
    scope: "authenticated editor screens",
    desktopViewport,
    narrowViewport: accessibility.viewport,
    narrowDocumentWidth: accessibility.documentWidth,
    unlabeledInteractiveElements: accessibility.unlabeled,
    keyboard: ["Enter on Add slide", "Enter on Remove selected", "Control+s"]
  }, null, 2) + "\n", { mode: 0o640 });
  await recordGateEvidence([
    ...["CH001-051", "CH001-052", "CH001-053", "CH001-054", "CH001-059"].map((id) => ({ id, path: hashReportPath, kind: "E2" as const, reference: "e2e:primary-journey" })),
    { id: "CH001-061", path: resolve(evidenceDir, "accessibility-report.json"), kind: "E2" as const, reference: "e2e:primary-journey" }
  ]);
});
