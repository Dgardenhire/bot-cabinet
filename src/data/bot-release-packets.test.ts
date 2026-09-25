import path from "node:path";
import { access } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "./starter-bots";
import { BOT_RELEASE_PACKETS, LEGACY_BOT_SLUGS } from "./bot-release-packets";

describe("new Bot release packets", () => {
  it("requires every post-launch Bot to include unique art and an X draft", async () => {
    const legacy = new Set<string>(LEGACY_BOT_SLUGS);
    const packets = new Map(BOT_RELEASE_PACKETS.map((packet) => [packet.botSlug, packet]));
    const currentSlugs = new Set(STARTER_BOTS.map((bot) => bot.slug));

    expect([...legacy].every((slug) => currentSlugs.has(slug))).toBe(true);

    for (const bot of STARTER_BOTS.filter((candidate) => !legacy.has(candidate.slug))) {
      const packet = packets.get(bot.slug);

      expect(packet, `${bot.slug} needs a release packet`).toBeDefined();
      expect(bot.image).toBe(`/downloads/bot-portraits/hermes/${bot.slug}-1024.png`);
      expect(packet?.portrait).toBe(bot.image);
      expect(packet?.socialCard).toContain(`showcase-${bot.slug}-`);
      expect(packet?.xPost).toContain(`https://botcabinet.com/bots/${bot.slug}/`);
      expect(packet?.xPost.length).toBeLessThanOrEqual(280);
      expect(packet?.humanApprovalRequired).toBe(true);

      await access(path.join(process.cwd(), "public", packet!.portrait));
      await access(path.join(process.cwd(), "public", packet!.socialCard));
    }
  });

  it("does not allow two new Bots to reuse the same portrait or social card", () => {
    expect(new Set(BOT_RELEASE_PACKETS.map((packet) => packet.portrait)).size).toBe(BOT_RELEASE_PACKETS.length);
    expect(new Set(BOT_RELEASE_PACKETS.map((packet) => packet.socialCard)).size).toBe(BOT_RELEASE_PACKETS.length);
  });
});
