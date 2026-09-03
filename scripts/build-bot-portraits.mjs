import { createHash } from "node:crypto";
import path from "node:path";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";

import sharp from "sharp";

import portraits from "../src/data/bot-portraits.json" with { type: "json" };
import classicPortraits from "../src/data/classic-bot-portraits.json" with { type: "json" };

const root = process.cwd();
const downloadsDirectory = path.join(root, "public", "downloads", "bot-portraits");
const originalsDirectory = path.join(root, "public", "downloads", "bot-portraits", "originals");
const hermesDirectory = path.join(root, "public", "downloads", "bot-portraits", "hermes");
const previewDirectory = path.join(root, "public", "bot-portraits", "previews");
const fleetSource = path.join(root, "public", "atelier", "fleet.jpg");
const assetLicenseSource = path.join(root, "ASSET-LICENSE.md");
const provenanceSource = path.join(root, "docs", "BOT-PORTRAIT-PROVENANCE.md");
const usageSource = path.join(root, "docs", "BOT-PORTRAIT-USAGE.txt");
const maximumHermesAvatarBytes = 500 * 1024;

await Promise.all([
  rm(hermesDirectory, { recursive: true, force: true }),
  rm(previewDirectory, { recursive: true, force: true }),
]);

await Promise.all([
  mkdir(hermesDirectory, { recursive: true }),
  mkdir(previewDirectory, { recursive: true }),
]);

for (const portrait of portraits) {
  const original = path.join(originalsDirectory, `${portrait.slug}-original.png`);
  const originalBuffer = await readFile(original);
  const digest = createHash("sha256").update(originalBuffer).digest("hex");

  if (digest !== portrait.originalSha256) {
    throw new Error(`${portrait.slug}: original portrait hash does not match its provenance record`);
  }

  const metadata = await sharp(originalBuffer).metadata();
  if (metadata.width !== 1024 || metadata.height !== 1536 || metadata.format !== "png") {
    throw new Error(`${portrait.slug}: expected a 1024x1536 PNG original`);
  }

  const square = await sharp(originalBuffer)
    .extract(portrait.crop)
    .resize(1024, 1024, { fit: "fill" })
    .png({ compressionLevel: 9, quality: 92 })
    .toBuffer();

  await writePortraitDerivatives(portrait.slug, square);
}

for (const portrait of classicPortraits) {
  if (path.basename(portrait.sourceFile) !== portrait.sourceFile) {
    throw new Error(`${portrait.slug}: classic portrait source must be a public-file name`);
  }

  const source = path.join(root, "public", portrait.sourceFile);
  const sourceBuffer = await readFile(source);
  const digest = createHash("sha256").update(sourceBuffer).digest("hex");

  if (digest !== portrait.sourceSha256) {
    throw new Error(`${portrait.slug}: classic portrait hash does not match its provenance record`);
  }

  const metadata = await sharp(sourceBuffer).metadata();
  if (metadata.width !== 1024 || metadata.height !== 1024 || metadata.format !== "png") {
    throw new Error(`${portrait.slug}: expected a 1024x1024 PNG source`);
  }

  const square = await sharp(sourceBuffer)
    .png({ compressionLevel: 9, quality: 92 })
    .toBuffer();

  await writePortraitDerivatives(portrait.slug, square);
}

const fleetImage = sharp(fleetSource);

await Promise.all([
  fleetImage
    .clone()
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(previewDirectory, "fleet-720.webp")),
  fleetImage
    .clone()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 86, effort: 5 })
    .toFile(path.join(previewDirectory, "fleet-1200.webp")),
  fleetImage
    .clone()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toFile(path.join(previewDirectory, "fleet-1800.webp")),
  copyFile(assetLicenseSource, path.join(downloadsDirectory, "ASSET-LICENSE.md")),
  copyFile(provenanceSource, path.join(downloadsDirectory, "PROVENANCE.md")),
  copyFile(usageSource, path.join(downloadsDirectory, "USAGE.txt")),
]);

process.stdout.write("fleet and public Portrait Studio documents generated\n");

async function writePortraitDerivatives(slug, square) {
  if (square.byteLength >= maximumHermesAvatarBytes) {
    throw new Error(
      `${slug}: 1024px portrait is ${square.byteLength} bytes; expected under 500 KiB`,
    );
  }

  await Promise.all([
    writeFile(path.join(hermesDirectory, `${slug}-1024.png`), square),
    sharp(square)
      .resize(256, 256)
      .png({ compressionLevel: 9, quality: 92 })
      .toFile(path.join(hermesDirectory, `${slug}-256.png`)),
    sharp(square)
      .resize(560, 560)
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(previewDirectory, `${slug}.webp`)),
  ]);

  process.stdout.write(`${slug}: portrait downloads and preview generated\n`);
}
