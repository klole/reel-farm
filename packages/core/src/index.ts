import { createHash } from "node:crypto";
import type { SlideDocument } from "@oss/contracts";
import { RENDERER_BUILD_ID, canonicalizeDocument, formatPostText } from "@oss/contracts";

export { assertDocumentAssets, cloneDocument, createDefaultDocument, DocumentValidationError, DocumentSchema, formatPostText, makeCanvas, parseDocument, reflowSlide } from "@oss/contracts";

export function hashDocument(document: SlideDocument): string {
  return createHash("sha256").update(canonicalizeDocument(document), "utf8").digest("hex");
}

export type ManifestImage = {
  filename: string;
  slideId: string;
  mime: "image/jpeg";
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  acceptedAssetHashes: string[];
};

export type ExportManifest = {
  exportSchemaVersion: "oss.export/1";
  revisionId: string;
  revisionHash: string;
  rendererBuildId: string;
  fontSetVersion: string;
  fontSetHash: string;
  canvas: { width: number; height: number; colorSpace: "srgb" };
  images: ManifestImage[];
  postTextSha256: string;
  validation: { status: "passed"; slideCount: number; diagnostics: string[] };
  createdAt: string;
};

export function makePostText(document: SlideDocument): string {
  return formatPostText(document.post) + "\n";
}

export function makeExportManifest(input: {
  document: SlideDocument;
  revisionId: string;
  revisionHash: string;
  fontSetVersion: string;
  fontSetHash: string;
  images: ManifestImage[];
  postTextSha256: string;
  createdAt?: string;
}): ExportManifest {
  return {
    exportSchemaVersion: "oss.export/1",
    revisionId: input.revisionId,
    revisionHash: input.revisionHash,
    rendererBuildId: RENDERER_BUILD_ID,
    fontSetVersion: input.fontSetVersion,
    fontSetHash: input.fontSetHash,
    canvas: { width: input.document.canvas.width, height: input.document.canvas.height, colorSpace: input.document.canvas.colorSpace },
    images: input.images,
    postTextSha256: input.postTextSha256,
    validation: { status: "passed", slideCount: input.document.slides.length, diagnostics: [] },
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}
