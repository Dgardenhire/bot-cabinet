import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import { botImportAndRunStatus } from "./bot-status-copy";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";

describe("botImportAndRunStatus", () => {
  it("reports the September 9 evidence without upgrading unrelated review states", () => {
    for (const slug of ["curator", "reentry", "receipt"]) {
      const bot = STARTER_BOTS.find((candidate) => candidate.slug === slug)!;
      const copy = botImportAndRunStatus(starterBotToPortablePackV2(bot));

      expect(copy).toContain("Hermes Agent 0.21.1 on September 9, 2026");
      expect(copy).toContain("Two published first-mission role runs passed their disclosed checks");
      expect(copy).toContain("Human technical review remains pending");
      expect(copy).toContain("Grok Bot build brief remains untested");
    }
  });

  it("keeps older import evidence and output testing separate", () => {
    const bot = STARTER_BOTS.find((candidate) => candidate.slug === "scout")!;
    const copy = botImportAndRunStatus(starterBotToPortablePackV2(bot));

    expect(copy).toContain("Hermes Agent 0.21.0 on September 4, 2026");
    expect(copy).toContain("role-specific output tests remain pending");
  });
});
