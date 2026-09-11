import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

export async function createSyntheticFixtureDirectory(directory = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r2/local", "fixtures")): Promise<{ portrait: string; landscape: string; square: string }> {
  await mkdir(directory, { recursive: true });
  const make = async (name: string, width: number, height: number, markerX: number, markerY: number): Promise<string> => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#d8d2c8"/><rect x="${Math.round(width * .08)}" y="${Math.round(height * .08)}" width="${Math.round(width * .84)}" height="${Math.round(height * .84)}" fill="#6d8f85"/><circle cx="${markerX}" cy="${markerY}" r="${Math.max(24, Math.round(Math.min(width, height) * .08))}" fill="#c65a3a"/><text x="${Math.round(width * .08)}" y="${Math.round(height * .92)}" fill="#fffdf8" font-family="sans-serif" font-size="${Math.max(20, Math.round(Math.min(width, height) * .07))}">LOCAL ${name.toUpperCase()}</text></svg>`;
    const path = resolve(directory, `${name}.jpg`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 94 }).toFile(path);
    return path;
  };
  const portrait = await make("portrait-marker", 720, 1080, 560, 300);
  const landscape = await make("landscape-marker", 1200, 720, 180, 300);
  const square = await make("square-marker", 900, 900, 700, 180);
  await writeFile(resolve(directory, "FIXTURES.md"), "Synthetic SVG-derived JPEG fixtures generated locally for CH-001R-r2; no external media or provider was used.\n", { mode: 0o640 });
  return { portrait, landscape, square };
}
