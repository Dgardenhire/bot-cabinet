import { gzipSync } from "node:zlib";

const TAR_BLOCK_SIZE = 512;
const ARCHIVE_MTIME_SECONDS = Date.UTC(2026, 0, 1) / 1000;
const ZIP_DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
const ZIP_DOS_TIME = 0;

function writeTarText(
  header: Buffer,
  offset: number,
  length: number,
  value: string,
) {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length > length) {
    throw new Error(`Tar header value is too long: ${value}`);
  }
  bytes.copy(header, offset);
}

function writeTarOctal(
  header: Buffer,
  offset: number,
  length: number,
  value: number,
) {
  const encoded = value.toString(8).padStart(length - 1, "0");
  writeTarText(header, offset, length, `${encoded}\0`);
}

function tarHeader(name: string, size: number, type: "0" | "5") {
  const header = Buffer.alloc(TAR_BLOCK_SIZE);
  writeTarText(header, 0, 100, name);
  writeTarOctal(header, 100, 8, type === "5" ? 0o755 : 0o644);
  writeTarOctal(header, 108, 8, 0);
  writeTarOctal(header, 116, 8, 0);
  writeTarOctal(header, 124, 12, size);
  writeTarOctal(header, 136, 12, ARCHIVE_MTIME_SECONDS);
  header.fill(0x20, 148, 156);
  header[156] = type.charCodeAt(0);
  writeTarText(header, 257, 6, "ustar\0");
  writeTarText(header, 263, 2, "00");

  let checksum = 0;
  for (const byte of header) checksum += byte;
  const encodedChecksum = checksum.toString(8).padStart(6, "0");
  writeTarText(header, 148, 8, `${encodedChecksum}\0 `);
  return header;
}

function archiveDirectories(paths: readonly string[]) {
  const directories = new Set<string>();
  for (const filePath of paths) {
    const segments = filePath.split("/");
    for (let index = 1; index < segments.length; index += 1) {
      directories.add(`${segments.slice(0, index).join("/")}/`);
    }
  }
  return [...directories].sort();
}

export function createDeterministicTarGzip(
  rootDirectory: string,
  files: Readonly<Record<string, string>>,
) {
  const relativePaths = Object.keys(files).sort();
  const rootedPaths = relativePaths.map((filePath) => `${rootDirectory}/${filePath}`);
  const chunks: Buffer[] = [];

  for (const directory of archiveDirectories(rootedPaths)) {
    chunks.push(tarHeader(directory, 0, "5"));
  }
  for (const relativePath of relativePaths) {
    const body = Buffer.from(files[relativePath], "utf8");
    chunks.push(tarHeader(`${rootDirectory}/${relativePath}`, body.length, "0"));
    chunks.push(body);
    const padding = (TAR_BLOCK_SIZE - (body.length % TAR_BLOCK_SIZE)) % TAR_BLOCK_SIZE;
    if (padding) chunks.push(Buffer.alloc(padding));
  }
  chunks.push(Buffer.alloc(TAR_BLOCK_SIZE * 2));

  const archive = gzipSync(Buffer.concat(chunks), { level: 9 });
  // zlib can encode a platform-specific operating-system byte. It has no
  // effect on decompression, so normalize it for byte-identical CI output.
  archive[9] = 255;
  return archive;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function crc32(bytes: Buffer) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function zipLocalHeader(name: Buffer, body: Buffer, crc: number) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(ZIP_DOS_TIME, 10);
  header.writeUInt16LE(ZIP_DOS_DATE, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(body.length, 18);
  header.writeUInt32LE(body.length, 22);
  header.writeUInt16LE(name.length, 26);
  header.writeUInt16LE(0, 28);
  return header;
}

function zipCentralHeader(
  name: Buffer,
  body: Buffer,
  crc: number,
  localOffset: number,
) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(0x0314, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0x0800, 8);
  header.writeUInt16LE(0, 10);
  header.writeUInt16LE(ZIP_DOS_TIME, 12);
  header.writeUInt16LE(ZIP_DOS_DATE, 14);
  header.writeUInt32LE(crc, 16);
  header.writeUInt32LE(body.length, 20);
  header.writeUInt32LE(body.length, 24);
  header.writeUInt16LE(name.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE((0o100644 << 16) >>> 0, 38);
  header.writeUInt32LE(localOffset, 42);
  return header;
}

export function createDeterministicZip(files: Readonly<Record<string, string>>) {
  const localChunks: Buffer[] = [];
  const centralChunks: Buffer[] = [];
  let localOffset = 0;

  for (const relativePath of Object.keys(files).sort()) {
    const name = Buffer.from(relativePath, "utf8");
    const body = Buffer.from(files[relativePath], "utf8");
    const crc = crc32(body);
    const localHeader = zipLocalHeader(name, body, crc);
    const centralHeader = zipCentralHeader(name, body, crc, localOffset);
    localChunks.push(localHeader, name, body);
    centralChunks.push(centralHeader, name);
    localOffset += localHeader.length + name.length + body.length;
  }

  const centralDirectory = Buffer.concat(centralChunks);
  const end = Buffer.alloc(22);
  const fileCount = Object.keys(files).length;
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(fileCount, 8);
  end.writeUInt16LE(fileCount, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, centralDirectory, end]);
}
