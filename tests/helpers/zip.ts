import { inflateRawSync } from "node:zlib";

export type ZipEntry = { name: string; data: Buffer; compressionMethod: number };

function uint16(data: Buffer, offset: number): number { return data.readUInt16LE(offset); }
function uint32(data: Buffer, offset: number): number { return data.readUInt32LE(offset); }

/** Small, dependency-free reader for the non-Zip64 archives emitted by the worker. */
export function readZipEntries(archive: Buffer): Map<string, ZipEntry> {
  const eocdSignature = 0x06054b50;
  let eocd = -1;
  for (let offset = archive.length - 22; offset >= Math.max(0, archive.length - 65_557); offset -= 1) {
    if (offset >= 0 && uint32(archive, offset) === eocdSignature) { eocd = offset; break; }
  }
  if (eocd < 0) throw new Error("ZIP end-of-central-directory record is missing.");
  const count = uint16(archive, eocd + 10);
  const centralSize = uint32(archive, eocd + 12);
  const centralOffset = uint32(archive, eocd + 16);
  if (count > 100 || centralOffset + centralSize > archive.length) throw new Error("ZIP central directory is outside the archive bounds.");
  const entries = new Map<string, ZipEntry>();
  let offset = centralOffset;
  for (let index = 0; index < count; index += 1) {
    if (uint32(archive, offset) !== 0x02014b50) throw new Error("ZIP central directory entry is malformed.");
    const compressionMethod = uint16(archive, offset + 10);
    const compressedSize = uint32(archive, offset + 20);
    const uncompressedSize = uint32(archive, offset + 24);
    const nameLength = uint16(archive, offset + 28);
    const extraLength = uint16(archive, offset + 30);
    const commentLength = uint16(archive, offset + 32);
    const localOffset = uint32(archive, offset + 42);
    const name = archive.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (!name || name.startsWith("/") || name.includes("\\") || name.split("/").includes("..")) throw new Error(`Unsafe ZIP entry name: ${name}`);
    if (entries.has(name)) throw new Error(`Duplicate ZIP entry: ${name}`);
    if (uint32(archive, localOffset) !== 0x04034b50) throw new Error(`ZIP local header is missing for ${name}.`);
    const localNameLength = uint16(archive, localOffset + 26);
    const localExtraLength = uint16(archive, localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataStart < 0 || dataEnd > archive.length) throw new Error(`ZIP data is outside the archive bounds for ${name}.`);
    const compressed = archive.subarray(dataStart, dataEnd);
    const data = compressionMethod === 0 ? Buffer.from(compressed) : compressionMethod === 8 ? inflateRawSync(compressed) : (() => { throw new Error(`Unsupported ZIP compression method ${compressionMethod}.`); })();
    if (data.length !== uncompressedSize) throw new Error(`ZIP size mismatch for ${name}.`);
    entries.set(name, { name, data, compressionMethod });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}
