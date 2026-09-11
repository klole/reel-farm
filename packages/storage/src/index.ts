import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import sharp, { type Metadata, type OutputInfo } from "sharp";

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_DECODED_PIXELS = 40_000_000;
export const MAX_EDGE = 16_384;

export type NormalizedAsset = {
  format: "jpeg" | "png" | "webp";
  mime: "image/jpeg" | "image/png" | "image/webp";
  original: Buffer;
  derivative: Buffer;
  thumbnail: Buffer;
  width: number;
  height: number;
  originalHash: string;
  derivativeHash: string;
};

export class AssetValidationError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "AssetValidationError";
    this.code = code;
  }
}

export function mediaRoot(): string {
  const root = process.env.MEDIA_ROOT ?? resolve(process.cwd(), "data/media");
  if (!isAbsolute(root)) throw new Error("MEDIA_ROOT must be an absolute path.");
  return root;
}

export function safeStorageKey(key: string): string {
  if (!key || key.includes("\0") || key.startsWith("/") || key.includes("\\") || key.split("/").includes("..")) throw new Error("Unsafe storage key.");
  const root = resolve(/* turbopackIgnore: true */ mediaRoot());
  const target = resolve(root, key);
  if (relative(root, target).startsWith("..")) throw new Error("Storage key escaped media root.");
  return key;
}

export function storagePath(key: string): string {
  return join(/* turbopackIgnore: true */ mediaRoot(), safeStorageKey(key));
}

export async function ensureMediaRoot(): Promise<void> {
  await mkdir(mediaRoot(), { recursive: true, mode: 0o750 });
}

/**
 * Verify that the configured media root is usable without leaving a durable
 * probe behind. This is intentionally a bounded write/read/delete probe: a
 * directory existing is not enough to claim that accepted media can be
 * persisted.
 */
export async function probeStorage(): Promise<void> {
  await ensureMediaRoot();
  const key = `health/${randomUUID()}.probe`;
  const payload = Buffer.from("open-slideshow-studio-storage-probe\n", "utf8");
  try {
    await writeStorageFile(key, payload);
    const readBack = await readStorageFile(key);
    if (!readBack.equals(payload)) throw new Error("Storage probe returned different bytes.");
  } finally {
    await removeStorageFile(key).catch(() => undefined);
  }
}

function digest(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function normalizeImage(input: Buffer): Promise<NormalizedAsset> {
  if (input.byteLength === 0) throw new AssetValidationError("EMPTY_FILE", "The file is empty.");
  if (input.byteLength > MAX_UPLOAD_BYTES) throw new AssetValidationError("FILE_TOO_LARGE", "Each image must be 20 MiB or smaller.");
  let image = sharp(input, { limitInputPixels: MAX_DECODED_PIXELS, failOn: "error", sequentialRead: true });
  let metadata: Metadata;
  try {
    metadata = await image.metadata();
  } catch {
    throw new AssetValidationError("UNREADABLE_IMAGE", "The file could not be decoded as a supported image.");
  }
  const format = metadata.format;
  if (format !== "jpeg" && format !== "png" && format !== "webp") throw new AssetValidationError("UNSUPPORTED_FORMAT", "Use a JPEG, PNG, or static WebP image.");
  if ((metadata.pages ?? 1) !== 1 || metadata.pageHeight) throw new AssetValidationError("ANIMATED_IMAGE", "Animated or multi-frame images are not supported.");
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height || width > MAX_EDGE || height > MAX_EDGE || width * height > MAX_DECODED_PIXELS) throw new AssetValidationError("IMAGE_LIMIT", "The image exceeds the safe pixel or edge limit.");

  image = image.rotate();
  let output: { data: Buffer; info: OutputInfo };
  try {
    if (format === "jpeg") output = await image.jpeg({ quality: 95, progressive: false }).toBuffer({ resolveWithObject: true });
    else if (format === "png") output = await image.png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
    else output = await image.webp({ quality: 95 }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new AssetValidationError("DECODE_FAILED", "The image could not be safely normalized.");
  }
  const mime = format === "jpeg" ? "image/jpeg" : `image/${format}` as "image/png" | "image/webp";
  let thumbnail: Buffer;
  try {
    thumbnail = await sharp(output.data, { limitInputPixels: MAX_DECODED_PIXELS }).resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true }).flatten({ background: "#f0ebe2" }).jpeg({ quality: 86 }).toBuffer();
  } catch {
    throw new AssetValidationError("THUMBNAIL_FAILED", "The image thumbnail could not be created.");
  }
  return { format, mime, original: input, derivative: output.data, thumbnail, width: output.info.width, height: output.info.height, originalHash: digest(input), derivativeHash: digest(output.data) };
}

export type StagedAsset = {
  id: string;
  stagingKey: string;
  originalPath: string;
  derivativePath: string;
  thumbnailPath: string;
  finalKeys: { original: string; derivative: string; thumbnail: string };
  normalized: NormalizedAsset;
};

export async function stageAsset(workspaceId: string, originalName: string, input: Buffer): Promise<StagedAsset> {
  const normalized = await normalizeImage(input);
  const id = randomUUID();
  const stagingKey = `staging/${randomUUID()}`;
  const base = storagePath(stagingKey);
  await mkdir(base, { recursive: true, mode: 0o750 });
  const originalPath = join(base, "original.bin");
  const derivativePath = join(base, "derivative");
  const thumbnailPath = join(base, "thumbnail.jpg");
  try {
    await writeFile(originalPath, normalized.original, { flag: "wx", mode: 0o640 });
    await writeFile(derivativePath, normalized.derivative, { flag: "wx", mode: 0o640 });
    await writeFile(thumbnailPath, normalized.thumbnail, { flag: "wx", mode: 0o640 });
  } catch (error) {
    await rm(base, { recursive: true, force: true });
    throw error;
  }
  const extension = normalized.format === "jpeg" ? "jpg" : normalized.format;
  const finalBase = `accepted/${workspaceId}/${id}`;
  return { id, stagingKey, originalPath, derivativePath, thumbnailPath, finalKeys: { original: `${finalBase}/original.bin`, derivative: `${finalBase}/derivative.${extension}`, thumbnail: `${finalBase}/thumbnail.jpg` }, normalized };
}

export async function promoteAsset(stage: StagedAsset): Promise<void> {
  for (const [source, key] of [[stage.originalPath, stage.finalKeys.original], [stage.derivativePath, stage.finalKeys.derivative], [stage.thumbnailPath, stage.finalKeys.thumbnail]] as const) {
    const destination = storagePath(key);
    await mkdir(dirname(destination), { recursive: true, mode: 0o750 });
    await rename(source, destination);
  }
  await rm(storagePath(stage.stagingKey), { recursive: true, force: true });
}

export async function discardStagedAsset(stage: StagedAsset): Promise<void> {
  await rm(storagePath(stage.stagingKey), { recursive: true, force: true });
}

export async function readStorageFile(key: string): Promise<Buffer> {
  return readFile(storagePath(key));
}

export async function storageFileExists(key: string): Promise<boolean> {
  try { await stat(storagePath(key)); return true; } catch { return false; }
}

export async function ensureStorageKeyParent(key: string): Promise<void> {
  await mkdir(dirname(storagePath(key)), { recursive: true, mode: 0o750 });
}

export async function writeStorageFile(key: string, data: Buffer): Promise<void> {
  await ensureStorageKeyParent(key);
  await writeFile(storagePath(key), data, { flag: "wx", mode: 0o640 });
}

export async function removeStorageFile(key: string): Promise<void> {
  await rm(storagePath(key), { force: true });
}
