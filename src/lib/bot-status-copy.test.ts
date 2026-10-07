import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import { botImportAndRunStatus } from "./bot-status-copy";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";

describe("botImportAndRunStatus", () => {
  it("reports the September 9 evidence without upgrading unrelated review states", () => {
    for (const slug of ["curator", "reentry", "receipt"]) {
      const bot = STARTER_BOTS.find((candidate) => candidate.slug === slug)!;
      const copy = botImportAndRunStatus(starterBotToPortablePackV2(bot));

      expect(copy).toContain("Hermes Agent 0.21.1 installation on September 9, 2026");
      expect(copy).toContain("Two published first-task runs passed the listed checks");
      expect(copy).toContain("A person has not yet completed the technical review");
      expect(copy).toContain("Grok Bot build brief remains untested");
    }
  });

  it("keeps older import evidence and output testing separate", () => {
    const bot = STARTER_BOTS.find((candidate) => candidate.slug === "scout")!;
    const copy = botImportAndRunStatus(starterBotToPortablePackV2(bot));

    expect(copy).toContain("Hermes Agent 0.21.0 installation on September 4, 2026");
    expect(copy).toContain("Human technical review and task-result tests have not yet been completed");
  });
});
