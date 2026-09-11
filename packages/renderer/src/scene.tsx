import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Block, ImageBlock, Slide, SlideDocument, TextBlock } from "@oss/contracts";

export type AssetSource = { src: string; alt: string };

export const sceneStyles = `
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#111}
.oss-scene{position:relative;overflow:hidden;isolation:isolate;font-family:Inter,Arial,sans-serif}
.oss-background{position:absolute;inset:0;z-index:0}
.oss-image-frame{position:absolute;overflow:hidden;z-index:1}
.oss-image-frame img{display:block;width:100%;height:100%;object-fit:cover}
.oss-image-placeholder{width:100%;height:100%;background:linear-gradient(135deg,#d8d2c8,#bdb5aa);display:flex;align-items:center;justify-content:center;color:#655d54;font-size:28px;letter-spacing:.04em}
.oss-text-block{position:absolute;z-index:2;white-space:pre-wrap;overflow:visible;overflow-wrap:anywhere;word-break:normal}
.oss-text-block[data-panel="true"]{padding:28px 34px;background:rgba(20,18,16,.82);border-radius:18px}
.oss-text-block[data-slot="headline"]{letter-spacing:-.035em}
.oss-text-block[data-slot="body"]{letter-spacing:-.01em}
`;

function imageStyle(block: ImageBlock): React.CSSProperties {
  return { left: block.box.x, top: block.box.y, width: block.box.width, height: block.box.height, backgroundColor: block.backgroundColor };
}

function textStyle(block: TextBlock): React.CSSProperties {
  return { left: block.box.x, top: block.box.y, width: block.box.width, height: block.box.height, fontFamily: block.style.fontId === "sourceSerif" ? "Source Serif 4, Georgia, serif" : "Inter, Arial, sans-serif", fontWeight: block.style.weight, fontSize: block.style.fontSize, lineHeight: block.style.lineHeight, textAlign: block.style.align, color: block.style.color };
}

function SceneBlock({ block, assets }: { block: Block; assets: Record<string, AssetSource> }): React.ReactElement {
  if (block.type === "image") {
    const asset = block.assetId ? assets[block.assetId] : undefined;
    return <div className="oss-image-frame" data-asset-id={block.assetId ?? ""} style={imageStyle(block)}>
      {asset ? <img src={asset.src} alt={asset.alt} draggable={false} style={{ objectFit: block.fit, objectPosition: `${block.focalPoint.x * 100}% ${block.focalPoint.y * 100}%` }} /> : <div className="oss-image-placeholder">Select a local image</div>}
    </div>;
  }
  return <div className="oss-text-block" data-text-block={block.id} data-slot={block.slot} data-panel={String(block.style.panel)} style={textStyle(block)}>{block.text}</div>;
}

export function SlideScene({ document, slide, assets = {}, className = "" }: { document: SlideDocument; slide: Slide; assets?: Record<string, AssetSource>; className?: string }): React.ReactElement {
  return <div className={`oss-scene ${className}`.trim()} data-slide-id={slide.id} data-layout={slide.layout} style={{ width: document.canvas.width, height: document.canvas.height }}>
    <div className="oss-background" style={{ backgroundColor: slide.background.color }} />
    {slide.blocks.filter((block) => !(slide.layout === "statement" && block.type === "image")).map((block) => <SceneBlock key={block.id} block={block} assets={assets} />)}
  </div>;
}

export function renderSlideMarkup(document: SlideDocument, slide: Slide, assets: Record<string, AssetSource>): string {
  return renderToStaticMarkup(<SlideScene document={document} slide={slide} assets={assets} />);
}

export function renderSlideHtml(document: SlideDocument, slide: Slide, assets: Record<string, AssetSource>, fontCss: string): string {
  return `<!doctype html><html lang="${document.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=${document.canvas.width}, initial-scale=1"><style>${fontCss}${sceneStyles}</style></head><body>${renderSlideMarkup(document, slide, assets)}<script>document.documentElement.dataset.ossReady="true";</script></body></html>`;
}
