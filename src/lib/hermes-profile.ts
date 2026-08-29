import {
  blueprintToBotPassportMarkdown,
  blueprintFirstMessage,
  type BotBlueprint,
} from "./workshop";

const encoder = new TextEncoder();
const TAR_BLOCK_SIZE = 512;
const HERMES_RESERVED_PROFILE_NAMES = new Set([
  "hermes",
  "default",
  "test",
  "tmp",
  "root",
  "sudo",
]);

function writeText(target: Uint8Array, offset: number, length: number, value: string) {
  const bytes = encoder.encode(value);
  target.set(bytes.slice(0, length), offset);
}

function writeOctal(target: Uint8Array, offset: number, length: number, value: number) {
  const octal = Math.max(0, value).toString(8).padStart(length - 1, "0").slice(-(length - 1));
  writeText(target, offset, length, `${octal}\0`);
}

function tarHeader(name: string, size: number, type: "0" | "5") {
  const header = new Uint8Array(TAR_BLOCK_SIZE);
  writeText(header, 0, 100, name);
  writeOctal(header, 100, 8, type === "5" ? 0o755 : 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, 0);
  header.fill(0x20, 148, 156);
  writeText(header, 156, 1, type);
  writeText(header, 257, 6, "ustar\0");
  writeText(header, 263, 2, "00");
  writeText(header, 265, 32, "bot-cabinet");
  writeText(header, 297, 32, "bot-cabinet");
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  writeText(header, 148, 8, `${checksum.toString(8).padStart(6, "0")}\0 `);
  return header;
}

function paddedLength(length: number) {
  return Math.ceil(length / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
}

export function hermesProfileSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const safeSlug = slug || "custom-bot";
  return HERMES_RESERVED_PROFILE_NAMES.has(safeSlug)
    ? `bot-${safeSlug}`
    : safeSlug;
}

export function hermesProfileArchiveFileName(blueprint: BotBlueprint) {
  return `${hermesProfileSlug(blueprint.profile.name)}-hermes-profile.tar.gz`;
}

export function hermesProfileFiles(blueprint: BotBlueprint): Record<string, string> {
  const slug = hermesProfileSlug(blueprint.profile.name);
  const yamlDescription = JSON.stringify(blueprint.profile.description);
  const profileMetadata = [
    `display_name: ${JSON.stringify(blueprint.profile.name)}`,
    `description: ${yamlDescription}`,
    "description_auto: false",
    "",
  ].join("\n");
  const manifest = [
    `name: ${slug}`,
    'version: "1.0.0"',
    `description: ${yamlDescription}`,
    'hermes_requires: ">=0.20.0"',
    "distribution_owned:",
    "  - profile.yaml",
    "  - SOUL.md",
    "  - README.md",
    "  - BOT-PASSPORT.md",
    "",
  ].join("\n");
  const readme = [
    `# ${blueprint.profile.name}`,
    "",
    blueprint.profile.description,
    "",
    "## Job",
    "",
    blueprint.mission,
    "",
    "## First test",
    "",
    blueprint.firstRunTest,
    "",
    "## First message",
    "",
    blueprintFirstMessage(blueprint),
    "",
    "## After import",
    "",
    "1. Review SOUL.md and the profile description.",
    "2. Add only the skills, tools, and connections required for the job.",
    "3. Run the first test with sample material and review the result.",
    "",
    "Created with Bot Lab at https://botcabinet.com/workshop/",
    "",
  ].join("\n");

  return {
    "distribution.yaml": manifest,
    "profile.yaml": profileMetadata,
    "SOUL.md": `${blueprint.soulText.trim()}\n`,
    "README.md": readme,
    "BOT-PASSPORT.md": blueprintToBotPassportMarkdown(blueprint),
  };
}

export function buildHermesProfileTar(blueprint: BotBlueprint) {
  const slug = hermesProfileSlug(blueprint.profile.name);
  const files = hermesProfileFiles(blueprint);
  const chunks: Uint8Array[] = [tarHeader(`${slug}/`, 0, "5")];

  for (const [fileName, content] of Object.entries(files)) {
    const data = encoder.encode(content);
    const padded = new Uint8Array(paddedLength(data.length));
    padded.set(data);
    chunks.push(tarHeader(`${slug}/${fileName}`, data.length, "0"), padded);
  }

  chunks.push(new Uint8Array(TAR_BLOCK_SIZE * 2));
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const archive = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    archive.set(chunk, offset);
    offset += chunk.length;
  }
  return archive;
}

export async function buildHermesProfileArchive(blueprint: BotBlueprint) {
  if (typeof CompressionStream === "undefined") {
    throw new Error("This browser cannot create a compressed Hermes profile archive.");
  }
  const tar = buildHermesProfileTar(blueprint);
  const gzipStream = new Blob([tar]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Blob([await new Response(gzipStream).arrayBuffer()], {
    type: "application/gzip",
  });
}
