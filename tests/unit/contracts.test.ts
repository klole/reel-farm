import { describe, expect, it } from "vitest";
import {
  DocumentValidationError,
  assertDocumentAssets,
  canonicalizeDocument,
  cloneDocument,
  createDefaultDocument,
  formatPostText,
  makeCanvas,
  parseDocument,
  reflowSlide
} from "../../packages/contracts/src/index.ts";
import type { ImageBlock, SlideDocument } from "../../packages/contracts/src/index.ts";

describe("slide document contracts", () => {
  it("creates a valid bounded document and preserves block IDs while reflowing", () => {
    const document = createDefaultDocument();
    const slide = document.slides[0];
    expect(slide).toBeDefined();
    if (!slide) return;
    const textIds = slide.blocks.filter((block) => block.type === "text").map((block) => block.id);
    const text = slide.blocks.filter((block) => block.type === "text").map((block) => block.text);
    const reflowed = reflowSlide(slide, makeCanvas("feed"), "editorialCard");
    expect(reflowed.blocks.filter((block) => block.type === "text").map((block) => block.id)).toEqual(textIds);
    expect(reflowed.blocks.filter((block) => block.type === "text").map((block) => block.text)).toEqual(text);
    expect(parseDocument({ ...document, canvas: makeCanvas("feed"), slides: [reflowed] }).canvas.preset).toBe("feed");
  });

  it("canonicalizes object-key insertion order but retains array semantics", () => {
    const document = createDefaultDocument();
    const equivalent = JSON.parse(JSON.stringify(document)) as SlideDocument;
    equivalent.post = { hashtags: [...document.post.hashtags], caption: document.post.caption, title: document.post.title };
    expect(canonicalizeDocument(document)).toBe(canonicalizeDocument(equivalent));
    const reordered = cloneDocument(document);
    const extra = structuredClone(reordered.slides[0]);
    if (!extra) throw new Error("default slide missing");
    extra.id = crypto.randomUUID();
    extra.blocks = extra.blocks.map((block) => ({ ...block, id: crypto.randomUUID() }));
    reordered.slides.push(extra);
    reordered.slides = [...reordered.slides].reverse();
    expect(canonicalizeDocument(document)).not.toBe(canonicalizeDocument(reordered));
  });

  it("rejects unsafe document values, IDs, counts, and layout versions", () => {
    const document = createDefaultDocument();
    const invalid = structuredClone(document) as Record<string, unknown> & { slides: Array<Record<string, unknown>> };
    const firstSlide = invalid.slides[0];
    if (!firstSlide) throw new Error("default slide missing");
    firstSlide.layoutVersion = "statement/999";
    expect(() => parseDocument(invalid)).toThrow(DocumentValidationError);
    const duplicate = createDefaultDocument();
    duplicate.slides.push(structuredClone(duplicate.slides[0]));
    expect(() => parseDocument(duplicate)).toThrow(DocumentValidationError);
  });

  it("rejects foreign, missing, and changed accepted asset references", () => {
    const document = createDefaultDocument();
    const image: ImageBlock = {
      id: crypto.randomUUID(),
      type: "image",
      assetId: crypto.randomUUID(),
      expectedDerivativeHash: "a".repeat(64),
      box: { x: 0, y: 0, width: 1080, height: 1920 },
      fit: "cover",
      focalPoint: { x: 0.5, y: 0.5 },
      backgroundColor: "#D8D2C8"
    };
    const withImage = { ...document, slides: [{ ...document.slides[0], blocks: [image] }] };
    expect(() => assertDocumentAssets(withImage, new Map(), "workspace-a")).toThrow(DocumentValidationError);
    expect(() => assertDocumentAssets(withImage, new Map([[image.assetId ?? "", { id: image.assetId ?? "", workspaceId: "workspace-b", derivativeHash: "a".repeat(64), acceptanceState: "accepted" }]]), "workspace-a")).toThrow(DocumentValidationError);
    expect(() => assertDocumentAssets(withImage, new Map([[image.assetId ?? "", { id: image.assetId ?? "", workspaceId: "workspace-a", derivativeHash: "b".repeat(64), acceptanceState: "accepted" }]]), "workspace-a")).toThrow(DocumentValidationError);
  });

  it("formats Unicode post text without losing hashtags", () => {
    expect(formatPostText({ title: "Café", caption: "A résumé — mañana.", hashtags: ["#local", "#制作"] })).toBe("Title: Café\nCaption: A résumé — mañana.\nHashtags: #local #制作");
  });
});
