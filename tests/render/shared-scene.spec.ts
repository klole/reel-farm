import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { createDefaultDocument, makeCanvas, newId, reflowSlide, type ImageBlock, type SlideDocument } from "../../packages/contracts/src/index.ts";
import { renderSlideHtml, sceneStyles } from "../../packages/renderer/src/index.ts";
import { embeddedFontCss } from "../../packages/renderer/src/fonts.ts";

const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r2/local");

test("shared renderer covers every layout and canvas preset in a real Chromium page", async ({ page }) => {
  await mkdir(evidenceDir, { recursive: true });
  const image = await sharp({ create: { width: 640, height: 420, channels: 4, background: { r: 198, g: 90, b: 58, alpha: 1 } } }).jpeg({ quality: 92 }).toBuffer();
  const assetId = newId();
  const imageHash = createHash("sha256").update(image).digest("hex");
  const source = { [assetId]: { src: `data:image/jpeg;base64,${image.toString("base64")}`, alt: "synthetic local marker" } };
  const results: Array<Record<string, unknown>> = [];
  for (const preset of ["portrait", "feed"] as const) {
    const canvas = makeCanvas(preset);
    for (const layout of ["photoCaption", "editorialCard", "statement"] as const) {
      const base = createDefaultDocument(preset);
      const original = base.slides[0];
      if (!original) throw new Error("Default document did not contain a slide.");
      const slide = reflowSlide(original, canvas, layout);
      const imageBlock = slide.blocks.find((block): block is ImageBlock => block.type === "image");
      if (imageBlock) { imageBlock.assetId = assetId; imageBlock.expectedDerivativeHash = imageHash; }
      const document: SlideDocument = { ...base, canvas, slides: [slide] };
      await page.setViewportSize({ width: canvas.width, height: canvas.height });
      await page.setContent(renderSlideHtml(document, slide, source, embeddedFontCss()), { waitUntil: "domcontentloaded" });
      const diagnostics = await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([document.fonts.load('400 16px "Inter"'), document.fonts.load('700 16px "Inter"'), document.fonts.load('400 16px "Source Serif 4"'), document.fonts.load('700 16px "Source Serif 4"')]);
        const images = await Promise.all(Array.from(document.images).map(async (item) => { try { await item.decode(); } catch { /* state below remains false */ } return { complete: item.complete, width: item.naturalWidth, height: item.naturalHeight }; }));
        return { fonts: [document.fonts.check('400 16px "Inter"'), document.fonts.check('700 16px "Inter"'), document.fonts.check('400 16px "Source Serif 4"'), document.fonts.check('700 16px "Source Serif 4"')], images, overflow: Array.from(document.querySelectorAll<HTMLElement>("[data-text-block]")).filter((node) => node.scrollHeight > node.clientHeight + 2).map((node) => node.dataset.textBlock) };
      });
      expect(diagnostics.fonts.every(Boolean)).toBe(true);
      expect(diagnostics.images.every((item) => item.complete && item.width > 0 && item.height > 0)).toBe(true);
      expect(diagnostics.overflow).toEqual([]);
      const jpeg = await page.screenshot({ type: "jpeg", quality: 95, clip: { x: 0, y: 0, width: canvas.width, height: canvas.height } });
      const metadata = await sharp(jpeg).metadata();
      expect(metadata.format).toBe("jpeg");
      expect(metadata.width).toBe(canvas.width);
      expect(metadata.height).toBe(canvas.height);
      results.push({ preset, layout, width: metadata.width, height: metadata.height, bytes: jpeg.byteLength });
      if (preset === "feed" && layout === "editorialCard") await writeFile(resolve(evidenceDir, "render-alternate-feed.jpg"), jpeg, { mode: 0o640 });
    }
  }
  await writeFile(resolve(evidenceDir, "render-corpus.json"), JSON.stringify({ scope: "shared-scene-real-browser-only; not a worker or database acceptance run", browserExecutable: process.env.BROWSER_EXECUTABLE_PATH ?? "playwright-managed", sceneStylesHash: sceneStyles.length, results }, null, 2) + "\n", { mode: 0o640 });
});

test("real Chromium waits for delayed local decode and rejects a missing resource", async ({ page }) => {
  await mkdir(evidenceDir, { recursive: true });
  const image = await sharp({ create: { width: 96, height: 64, channels: 3, background: "#6d8f85" } }).jpeg().toBuffer();
  const source = `data:image/jpeg;base64,${image.toString("base64")}`;
  await page.setContent("<!doctype html><html><body></body></html>", { waitUntil: "domcontentloaded" });
  const delayed = await page.evaluate(async (dataUrl) => {
    const imageElement = new Image();
    document.body.append(imageElement);
    await new Promise<void>((resolveDelay) => setTimeout(resolveDelay, 50));
    imageElement.src = dataUrl;
    await imageElement.decode();
    return { complete: imageElement.complete, width: imageElement.naturalWidth, height: imageElement.naturalHeight };
  }, source);
  const missing = await page.evaluate(async () => {
    const imageElement = new Image();
    imageElement.src = "data:image/jpeg;base64,not-a-jpeg";
    try { await imageElement.decode(); return { decoded: true, complete: imageElement.complete, width: imageElement.naturalWidth }; }
    catch { return { decoded: false, complete: imageElement.complete, width: imageElement.naturalWidth }; }
  });
  expect(delayed).toEqual({ complete: true, width: 96, height: 64 });
  expect(missing.decoded).toBe(false);
  await writeFile(resolve(evidenceDir, "resource-readiness.json"), JSON.stringify({ scope: "real browser resource barrier", delayed, missing, missing_is_not_silent_success: !missing.decoded }, null, 2) + "\n", { mode: 0o640 });
});
