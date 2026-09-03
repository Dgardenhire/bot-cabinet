import { createHash } from "node:crypto";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { portraitPromptChoices } from "../lib/portrait-prompt";

import portraits from "./bot-portraits.json";
import classicPortraits from "./classic-bot-portraits.json";

const projectRoot = process.cwd();
const downloadsDirectory = path.join(
  projectRoot,
  "public",
  "downloads",
  "bot-portraits",
);
const previewsDirectory = path.join(projectRoot, "public", "bot-portraits", "previews");

describe("Bot Portrait Studio collection", () => {
  it("publishes 18 uniquely named friendly portraits with provenance hashes", () => {
    expect(portraits).toHaveLength(10);
    expect(classicPortraits).toHaveLength(8);

    const collection = [...portraits, ...classicPortraits];
    expect(new Set(collection.map((portrait) => portrait.slug)).size).toBe(18);
    expect(new Set(collection.map((portrait) => portrait.name)).size).toBe(18);

    for (const portrait of portraits) {
      expect(portrait.name).toBeTruthy();
      expect(portrait.description).toBeTruthy();
      expect(portrait.alt).toMatch(/friendly/i);
      expect(portrait.originalSha256).toMatch(/^[a-f0-9]{64}$/);
    }

    for (const portrait of classicPortraits) {
      expect(portrait.name).toBeTruthy();
      expect(portrait.description).toBeTruthy();
      expect(portrait.alt).toMatch(/friendly/i);
      expect(portrait.sourceFile).toMatch(/^bot-[a-z-]+\.png$/);
      expect(portrait.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("keeps every documented crop inside the 1024 by 1536 original", () => {
    for (const { crop } of portraits) {
      expect(crop.left).toBeGreaterThanOrEqual(0);
      expect(crop.top).toBeGreaterThanOrEqual(0);
      expect(crop.left + crop.width).toBeLessThanOrEqual(1024);
      expect(crop.top + crop.height).toBeLessThanOrEqual(1536);
      expect(crop.width).toBe(crop.height);
    }
  });

  it("uses a published portrait for every palette reference", () => {
    const portraitSlugs = new Set(portraits.map((portrait) => portrait.slug));

    for (const palette of portraitPromptChoices.palettes) {
      expect(portraitSlugs.has(palette.referenceSlug)).toBe(true);
    }
  });

  it("keeps the provenance tables and source portrait hashes in sync", async () => {
    const provenance = await readFile(
      path.join(projectRoot, "docs", "BOT-PORTRAIT-PROVENANCE.md"),
      "utf8",
    );

    for (const portrait of portraits) {
      const original = await readFile(
        path.join(downloadsDirectory, "originals", `${portrait.slug}-original.png`),
      );
      const digest = createHash("sha256").update(original).digest("hex");

      expect(digest).toBe(portrait.originalSha256);
      expect(original.toString("latin1")).toContain("gpt-image");
      expect(original.toString("latin1")).toContain("OpenAI Media Service");
      expect(provenance).toContain(
        `| ${portrait.name} | \`${portrait.originalSha256}\` |`,
      );
    }

    for (const portrait of classicPortraits) {
      const source = await readFile(path.join(projectRoot, "public", portrait.sourceFile));
      const digest = createHash("sha256").update(source).digest("hex");

      expect(digest).toBe(portrait.sourceSha256);
      expect(source.toString("latin1")).toContain("c2pa");
      expect(source.toString("latin1")).toContain("fal-ai/flux-2-klein");
      expect(provenance).toContain(
        `| ${portrait.name} | \`${portrait.sourceFile}\` | \`${portrait.sourceSha256}\` |`,
      );
    }
  });

  it("publishes correctly sized portrait downloads and previews", async () => {
    for (const portrait of portraits) {
      const originalPath = path.join(
        downloadsDirectory,
        "originals",
        `${portrait.slug}-original.png`,
      );
      const largePath = path.join(
        downloadsDirectory,
        "hermes",
        `${portrait.slug}-1024.png`,
      );
      const smallPath = path.join(
        downloadsDirectory,
        "hermes",
        `${portrait.slug}-256.png`,
      );
      const previewPath = path.join(previewsDirectory, `${portrait.slug}.webp`);

      await expectImage(originalPath, "png", 1024, 1536);
      await expectImage(largePath, "png", 1024, 1024);
      await expectImage(smallPath, "png", 256, 256);
      await expectImage(previewPath, "webp", 560, 560);
      expect((await stat(largePath)).size).toBeLessThan(500 * 1024);
    }

    for (const portrait of classicPortraits) {
      const sourcePath = path.join(projectRoot, "public", portrait.sourceFile);
      const largePath = path.join(
        downloadsDirectory,
        "hermes",
        `${portrait.slug}-1024.png`,
      );
      const smallPath = path.join(
        downloadsDirectory,
        "hermes",
        `${portrait.slug}-256.png`,
      );
      const previewPath = path.join(previewsDirectory, `${portrait.slug}.webp`);

      await expectImage(sourcePath, "png", 1024, 1024);
      await expectImage(largePath, "png", 1024, 1024);
      await expectImage(smallPath, "png", 256, 256);
      await expectImage(previewPath, "webp", 560, 560);
      expect((await stat(largePath)).size).toBeLessThan(500 * 1024);
    }
  });

  it("publishes all responsive fleet hero sizes", async () => {
    await expectImage(path.join(previewsDirectory, "fleet-720.webp"), "webp", 720, 480);
    await expectImage(path.join(previewsDirectory, "fleet-1200.webp"), "webp", 1200, 800);
    await expectImage(path.join(previewsDirectory, "fleet-1800.webp"), "webp", 1800, 1200);
  });

  it("publishes exact copies of the full use terms and provenance record", async () => {
    const [sourceLicense, publishedLicense, sourceProvenance, publishedProvenance, sourceUsage, publishedUsage] =
      await Promise.all([
        readFile(path.join(projectRoot, "ASSET-LICENSE.md")),
        readFile(path.join(downloadsDirectory, "ASSET-LICENSE.md")),
        readFile(path.join(projectRoot, "docs", "BOT-PORTRAIT-PROVENANCE.md")),
        readFile(path.join(downloadsDirectory, "PROVENANCE.md")),
        readFile(path.join(projectRoot, "docs", "BOT-PORTRAIT-USAGE.txt"), "utf8"),
        readFile(path.join(downloadsDirectory, "USAGE.txt"), "utf8"),
      ]);

    expect(publishedLicense.equals(sourceLicense)).toBe(true);
    expect(publishedProvenance.equals(sourceProvenance)).toBe(true);
    expect(publishedUsage).toBe(sourceUsage);
    expect(publishedUsage).toContain("/downloads/bot-portraits/ASSET-LICENSE.md");
    expect(publishedUsage).toContain("/downloads/bot-portraits/PROVENANCE.md");
  });
});

async function expectImage(
  filePath: string,
  format: "png" | "webp",
  width: number,
  height: number,
) {
  const metadata = await sharp(filePath).metadata();

  expect(metadata.format).toBe(format);
  expect(metadata.width).toBe(width);
  expect(metadata.height).toBe(height);
}
