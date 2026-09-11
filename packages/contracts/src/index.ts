import { z } from "zod";

export const DOCUMENT_SCHEMA_VERSION = "oss.slide/1" as const;
export const CANONICALIZATION_VERSION = "oss.canonical/1" as const;
export const RENDERER_BUILD_ID = process.env.RENDERER_BUILD_ID ?? "oss-renderer-0.1.0";

export const FONT_CATALOG = {
  inter: { label: "Inter", family: "Inter", weights: [400, 700] as const },
  sourceSerif: { label: "Source Serif 4", family: "Source Serif 4", weights: [400, 700] as const }
} as const;
export type FontId = keyof typeof FONT_CATALOG;

export const LAYOUT_CATALOG = {
  photoCaption: { label: "Photo caption", version: "photo-caption/1" },
  editorialCard: { label: "Editorial card", version: "editorial-card/1" },
  statement: { label: "Statement", version: "statement/1" }
} as const;
export type LayoutId = keyof typeof LAYOUT_CATALOG;

export const CANVAS_PRESETS = {
  portrait: { label: "9:16 portrait", width: 1080, height: 1920 },
  feed: { label: "4:5 feed", width: 1080, height: 1350 }
} as const;
export type CanvasPreset = keyof typeof CANVAS_PRESETS;

const finite = (message: string) => z.number().refine(Number.isFinite, message);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hexadecimal color.");
const id = z.string().uuid();

export const BoxSchema = z.object({
  x: finite("x must be finite"),
  y: finite("y must be finite"),
  width: finite("width must be finite"),
  height: finite("height must be finite")
}).strict().superRefine((box, ctx) => {
  if (box.width <= 0) ctx.addIssue({ code: "custom", path: ["width"], message: "width must be positive" });
  if (box.height <= 0) ctx.addIssue({ code: "custom", path: ["height"], message: "height must be positive" });
});
export type Box = z.infer<typeof BoxSchema>;

export const CanvasSchema = z.object({
  preset: z.enum(["portrait", "feed"]),
  width: z.literal(1080),
  height: z.union([z.literal(1920), z.literal(1350)]),
  colorSpace: z.literal("srgb")
}).strict().superRefine((canvas, ctx) => {
  const expected = CANVAS_PRESETS[canvas.preset];
  if (canvas.height !== expected.height) {
    ctx.addIssue({ code: "custom", path: ["height"], message: "Canvas dimensions do not match its preset." });
  }
});
export type Canvas = z.infer<typeof CanvasSchema>;

const TextStyleSchema = z.object({
  fontId: z.enum(["inter", "sourceSerif"]),
  weight: z.union([z.literal(400), z.literal(700)]),
  fontSize: finite("fontSize must be finite").min(28).max(160),
  lineHeight: finite("lineHeight must be finite").min(1).max(1.8),
  align: z.enum(["left", "center", "right"]),
  color: hexColor,
  panel: z.boolean(),
  placement: z.enum(["top", "middle", "bottom"])
}).strict();

export const TextBlockSchema = z.object({
  id,
  type: z.literal("text"),
  slot: z.enum(["headline", "body"]),
  text: z.string().max(1500),
  box: BoxSchema,
  style: TextStyleSchema
}).strict();
export type TextBlock = z.infer<typeof TextBlockSchema>;

export const ImageBlockSchema = z.object({
  id,
  type: z.literal("image"),
  assetId: id.nullable(),
  expectedDerivativeHash: z.string().regex(/^[0-9a-f]{64}$/).nullable(),
  box: BoxSchema,
  fit: z.enum(["cover", "contain"]),
  focalPoint: z.object({ x: finite("focal x must be finite").min(0).max(1), y: finite("focal y must be finite").min(0).max(1) }).strict(),
  backgroundColor: hexColor
}).strict();
export type ImageBlock = z.infer<typeof ImageBlockSchema>;

export const BlockSchema = z.discriminatedUnion("type", [TextBlockSchema, ImageBlockSchema]);
export type Block = z.infer<typeof BlockSchema>;

export const SlideSchema = z.object({
  id,
  role: z.enum(["hook", "body", "cta"]),
  layout: z.enum(["photoCaption", "editorialCard", "statement"]),
  layoutVersion: z.string().regex(/^(photo-caption|editorial-card|statement)\/1$/),
  background: z.object({ color: hexColor }).strict(),
  blocks: z.array(BlockSchema).min(1).max(3)
}).strict().superRefine((slide, ctx) => {
  const ids = slide.blocks.map((block) => block.id);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", path: ["blocks"], message: "Block IDs must be unique." });
  const slots = slide.blocks.filter((block): block is TextBlock => block.type === "text").map((block) => block.slot);
  if (new Set(slots).size !== slots.length) ctx.addIssue({ code: "custom", path: ["blocks"], message: "Each text slot may appear once." });
  const expectedVersion = LAYOUT_CATALOG[slide.layout].version;
  if (slide.layoutVersion !== expectedVersion) ctx.addIssue({ code: "custom", path: ["layoutVersion"], message: "Unknown layout version." });
});
export type Slide = z.infer<typeof SlideSchema>;

export const PostSchema = z.object({
  title: z.string().max(150),
  caption: z.string().max(3000),
  hashtags: z.array(z.string().regex(/^#[\p{L}\p{N}_-]+$/u)).max(20)
}).strict();

export const DocumentSchema = z.object({
  schemaVersion: z.literal(DOCUMENT_SCHEMA_VERSION),
  canvas: CanvasSchema,
  language: z.string().regex(/^[a-z]{2,8}(?:-[A-Z]{2})?$/),
  post: PostSchema,
  slides: z.array(SlideSchema).min(1).max(20)
}).strict().superRefine((document, ctx) => {
  const slideIds = document.slides.map((slide) => slide.id);
  if (new Set(slideIds).size !== slideIds.length) ctx.addIssue({ code: "custom", path: ["slides"], message: "Slide IDs must be unique." });
  for (const [slideIndex, slide] of document.slides.entries()) {
    for (const [blockIndex, block] of slide.blocks.entries()) {
      const bounds = { x: 0, y: 0, width: document.canvas.width, height: document.canvas.height };
      if (block.box.x < bounds.x || block.box.y < bounds.y || block.box.x + block.box.width > bounds.width || block.box.y + block.box.height > bounds.height) {
        ctx.addIssue({ code: "custom", path: ["slides", slideIndex, "blocks", blockIndex, "box"], message: "Block must remain inside the canvas." });
      }
      if (block.type === "text" && block.slot === "headline" && [...block.text].length > 300) {
        ctx.addIssue({ code: "custom", path: ["slides", slideIndex, "blocks", blockIndex, "text"], message: "Headline is too long." });
      }
    }
  }
});
export type SlideDocument = z.infer<typeof DocumentSchema>;

export class DocumentValidationError extends Error {
  readonly issues: z.ZodIssue[];
  constructor(issues: z.ZodIssue[]) {
    super(issues.length ? issues.map((issue) => issue.message).join("; ") : "The slideshow document is invalid.");
    this.name = "DocumentValidationError";
    this.issues = issues;
  }
}

// The bundled font set is deliberately a Latin/Latin-extended corpus for
// v0.1.0. Rejecting other scripts here makes the limitation explicit instead
// of allowing Chromium to substitute a missing glyph during export.
function isSupportedSlideCodePoint(codePoint: number): boolean {
  return codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d
    || (codePoint >= 0x20 && codePoint <= 0x7e)
    || (codePoint >= 0xa0 && codePoint <= 0x24f)
    || (codePoint >= 0x300 && codePoint <= 0x36f)
    || (codePoint >= 0x1e00 && codePoint <= 0x1eff)
    || (codePoint >= 0x2000 && codePoint <= 0x206f)
    || (codePoint >= 0x20a0 && codePoint <= 0x20cf);
}

export type UnsupportedSlideGlyph = { slideId: string; blockId: string; glyph: string; codePoint: number };

export function unsupportedSlideGlyphs(document: SlideDocument): UnsupportedSlideGlyph[] {
  const unsupported: UnsupportedSlideGlyph[] = [];
  for (const slide of document.slides) for (const block of slide.blocks) {
    if (block.type !== "text") continue;
    for (const glyph of Array.from(block.text)) {
      const codePoint = glyph.codePointAt(0);
      if (codePoint !== undefined && !isSupportedSlideCodePoint(codePoint) && !unsupported.some((item) => item.slideId === slide.id && item.blockId === block.id && item.codePoint === codePoint)) unsupported.push({ slideId: slide.id, blockId: block.id, glyph, codePoint });
    }
  }
  return unsupported;
}

export function parseDocument(input: unknown): SlideDocument {
  const result = DocumentSchema.safeParse(input);
  if (!result.success) throw new DocumentValidationError(result.error.issues);
  const unsupported = unsupportedSlideGlyphs(result.data);
  if (unsupported.length) throw new DocumentValidationError(unsupported.map((item) => ({ code: "custom", path: ["slides", item.slideId, item.blockId, "text"], message: `Unsupported glyph U+${item.codePoint.toString(16).toUpperCase().padStart(4, "0")}; v0.1.0 supports the bundled Latin/Latin-extended text corpus only.` })));
  return result.data;
}

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return "00000000-0000-4000-8000-" + Math.random().toString(16).slice(2).padEnd(12, "0").slice(0, 12);
}

export function makeCanvas(preset: CanvasPreset = "portrait"): Canvas {
  return { preset, width: 1080, height: CANVAS_PRESETS[preset].height, colorSpace: "srgb" };
}

function textBlock(slot: "headline" | "body", text: string, box: Box, style: Partial<TextBlock["style"]> = {}): TextBlock {
  return {
    id: newId(), type: "text", slot, text, box,
    style: {
      fontId: "inter", weight: slot === "headline" ? 700 : 400, fontSize: slot === "headline" ? 86 : 38,
      lineHeight: slot === "headline" ? 1.08 : 1.35, align: "left", color: "#FFFDF8", panel: slot === "headline", placement: "bottom", ...style
    }
  };
}

function imageBlock(box: Box): ImageBlock {
  return { id: newId(), type: "image", assetId: null, expectedDerivativeHash: null, box, fit: "cover", focalPoint: { x: 0.5, y: 0.5 }, backgroundColor: "#D8D2C8" };
}

export function reflowSlide(slide: Slide, canvas: Canvas, layout: LayoutId = slide.layout): Slide {
  const previousHeadline = slide.blocks.find((block): block is TextBlock => block.type === "text" && block.slot === "headline");
  const previousBody = slide.blocks.find((block): block is TextBlock => block.type === "text" && block.slot === "body");
  const previousImage = slide.blocks.find((block): block is ImageBlock => block.type === "image");
  const w = canvas.width;
  const h = canvas.height;
  let blocks: Block[];
  if (layout === "photoCaption") {
    blocks = [
      previousImage ? { ...previousImage, box: { x: 0, y: 0, width: w, height: h } } : imageBlock({ x: 0, y: 0, width: w, height: h }),
      textBlock("headline", previousHeadline?.text ?? "A considered beginning", { x: 76, y: h - 630, width: w - 152, height: 250 }, { ...previousHeadline?.style, placement: "bottom", panel: true }),
      textBlock("body", previousBody?.text ?? "Add a short supporting thought.", { x: 76, y: h - 330, width: w - 152, height: 190 }, { ...previousBody?.style, placement: "bottom", panel: false })
    ];
  } else if (layout === "editorialCard") {
    blocks = [
      previousImage ? { ...previousImage, box: { x: 72, y: 72, width: w - 144, height: Math.round(h * 0.54) } } : imageBlock({ x: 72, y: 72, width: w - 144, height: Math.round(h * 0.54) }),
      textBlock("headline", previousHeadline?.text ?? "A useful next step", { x: 90, y: Math.round(h * 0.64), width: w - 180, height: 180 }, { ...previousHeadline?.style, color: "#24211E", placement: "top", panel: false }),
      textBlock("body", previousBody?.text ?? "Keep the explanation close to the example.", { x: 90, y: Math.round(h * 0.78), width: w - 180, height: Math.round(h * 0.16) }, { ...previousBody?.style, color: "#5D554D", placement: "top", panel: false })
    ];
  } else {
    blocks = [
      ...(previousImage ? [{ ...previousImage, box: { x: 0, y: 0, width: w, height: h } }] : []),
      textBlock("headline", previousHeadline?.text ?? "Leave some space open", { x: 100, y: Math.round(h * 0.25), width: w - 200, height: 260 }, { ...previousHeadline?.style, color: "#26231F", align: "center", placement: "middle", panel: false }),
      textBlock("body", previousBody?.text ?? "Let the main subject have room in the composition.", { x: 130, y: Math.round(h * 0.48), width: w - 260, height: 210 }, { ...previousBody?.style, color: "#5D554D", align: "center", placement: "middle", panel: false })
    ];
  }
  blocks = blocks.map((block) => {
    const previous = block.type === "image" ? previousImage : block.slot === "headline" ? previousHeadline : previousBody;
    return previous ? { ...block, id: previous.id } : block;
  });
  return { ...slide, layout, layoutVersion: LAYOUT_CATALOG[layout].version, blocks };
}

export function createDefaultDocument(preset: CanvasPreset = "portrait"): SlideDocument {
  const canvas = makeCanvas(preset);
  const slide: Slide = {
    id: newId(), role: "hook", layout: "statement", layoutVersion: LAYOUT_CATALOG.statement.version,
    background: { color: "#F0E9DE" }, blocks: reflowSlide({
      id: newId(), role: "hook", layout: "statement", layoutVersion: LAYOUT_CATALOG.statement.version,
      background: { color: "#F0E9DE" }, blocks: [textBlock("headline", "A quiet place to begin", { x: 100, y: 480, width: 880, height: 240 }), textBlock("body", "Write your own first slide.", { x: 130, y: 900, width: 820, height: 160 })]
    }, canvas, "statement").blocks
  };
  return { schemaVersion: DOCUMENT_SCHEMA_VERSION, canvas, language: "en", post: { title: "Untitled slideshow", caption: "", hashtags: [] }, slides: [slide] };
}

export function cloneDocument(document: SlideDocument): SlideDocument {
  return parseDocument(JSON.parse(JSON.stringify(document)) as unknown);
}

function sortedValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, sortedValue(child)]));
  }
  return value;
}

export function canonicalizeDocument(document: SlideDocument): string {
  return JSON.stringify(sortedValue(parseDocument(document)));
}

export function formatPostText(post: SlideDocument["post"]): string {
  const hashtags = post.hashtags.join(" ");
  return [`Title: ${post.title}`, `Caption: ${post.caption}`, `Hashtags: ${hashtags}`].join("\n");
}

export type AssetReference = { id: string; workspaceId: string; derivativeHash: string; acceptanceState: string };

export function assertDocumentAssets(document: SlideDocument, assets: Map<string, AssetReference>, workspaceId: string): void {
  for (const slide of document.slides) {
    for (const block of slide.blocks) {
      if (block.type !== "image" || block.assetId === null) continue;
      const asset = assets.get(block.assetId);
      if (!asset || asset.workspaceId !== workspaceId || asset.acceptanceState !== "accepted") {
        throw new DocumentValidationError([{ code: "custom", path: ["slides", slide.id, block.id, "assetId"], message: "The selected local image is unavailable." }]);
      }
      if (block.expectedDerivativeHash !== asset.derivativeHash) {
        throw new DocumentValidationError([{ code: "custom", path: ["slides", slide.id, block.id, "expectedDerivativeHash"], message: "The selected image changed; choose it again." }]);
      }
    }
  }
}

export function documentContainsImageRequirement(slide: Slide): boolean {
  return slide.layout !== "statement";
}

export function renderableTextBlocks(slide: Slide): TextBlock[] {
  return slide.blocks.filter((block): block is TextBlock => block.type === "text");
}
