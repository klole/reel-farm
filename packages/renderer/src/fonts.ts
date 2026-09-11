import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const FONT_PACKAGE = { inter: "@fontsource/inter", sourceSerif: "@fontsource/source-serif-4" } as const;
const FACE = { 400: "400", 700: "700" } as const;

function fontFile(fontId: keyof typeof FONT_PACKAGE, weight: keyof typeof FACE): string {
  const packageName = FONT_PACKAGE[fontId];
  const cssPath = require.resolve(`${packageName}/${FACE[weight]}.css`);
  const css = readFileSync(cssPath, "utf8");
  const match = css.match(/url\(([^)]+\.woff2)\)/);
  if (!match?.[1]) throw new Error(`Unable to locate ${fontId} ${weight} font face.`);
  return join(dirname(cssPath), match[1].replace(/^['"]|['"]$/g, ""));
}

export function fontSetHash(): string {
  const hash = createHash("sha256");
  for (const fontId of ["inter", "sourceSerif"] as const) for (const weight of [400, 700] as const) hash.update(readFileSync(fontFile(fontId, weight)));
  return hash.digest("hex");
}

export function embeddedFontCss(): string {
  const faces: string[] = [];
  for (const fontId of ["inter", "sourceSerif"] as const) {
    const family = fontId === "inter" ? "Inter" : "Source Serif 4";
    for (const weight of [400, 700] as const) {
      const data = readFileSync(fontFile(fontId, weight)).toString("base64");
      faces.push(`@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2');}`);
    }
  }
  return faces.join("\n");
}

export const FONT_SET_VERSION = "oss-fonts/1";
