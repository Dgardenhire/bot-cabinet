import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { SPECIALISTS } from "./specialist-collection";
import { SPECIALIST_PORTRAITS, getSpecialistPortrait } from "./specialist-portraits";

describe("specialist artwork coverage", () => {
  it("gives every published specialist its own optimized square portrait", async () => {
    expect(Object.keys(SPECIALIST_PORTRAITS).sort()).toEqual(SPECIALISTS.map(bot => bot.slug).sort());
    const hashes = new Set<string>();
    for (const bot of SPECIALISTS) {
      const portrait = getSpecialistPortrait(bot.slug);
      expect(portrait.alt).toContain(bot.name);
      const bytes = await readFile(path.join(process.cwd(), "public", portrait.image));
      const metadata = await sharp(bytes).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(768);
      expect(metadata.height).toBe(768);
      expect(bytes.length).toBeLessThan(200_000);
      hashes.add(createHash("sha256").update(bytes).digest("hex"));
    }
    expect(hashes.size).toBe(SPECIALISTS.length);
  });
  it("provides a correctly sized social card for every specialist", async () => {
    for (const bot of SPECIALISTS) {
      const bytes = await readFile(path.join(process.cwd(), "public/brand/social/specialists", `${bot.slug}-1200x630.jpg`));
      const metadata = await sharp(bytes).metadata();
      expect([metadata.format, metadata.width, metadata.height]).toEqual(["jpeg", 1200, 630]);
    }
  });
});
