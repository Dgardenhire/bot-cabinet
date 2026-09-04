import { describe, expect, it } from "vitest";

import { STARTER_BOTS, type StarterBot } from "../data/starter-bots";
import { starterBotToPortablePack } from "./portable-bot-pack";
import {
  parsePortableBotPackV2,
  portableBotPackV2ArtifactIds,
  starterBotToPortablePackV2,
  validatePortableBotPackV2,
} from "./portable-bot-pack-v2";

function copy<T>(value: T): T {
  return structuredClone(value);
}

describe("Portable Bot Pack V2", () => {
  it("builds and validates a normalized V2 pack for every starter Bot", () => {
    for (const bot of STARTER_BOTS) {
      const pack = starterBotToPortablePackV2(bot);

      expect(parsePortableBotPackV2(pack)).toBe(pack);
      expect(pack.schemaVersion).toBe(2);
      expect(pack.packVersion).toBe("2.0.0");
      expect(pack.preparationStatus).toBe("prepared");
      expect(pack.identity.slug).toBe(bot.slug);
      expect(pack.identity.portrait.url).toBe(bot.image);
      expect(pack.job.firstMission).toBe(bot.workshopDraft.firstRunTest);
      expect(pack.skills).toHaveLength(1);
      expect(pack.routines).toHaveLength(1);
      expect(pack.skills[0].preparationStatus).toBe("prepared");
      expect(pack.skills[0].testStatus).toBe("not-tested");
      expect(pack.routines[0].activationStatus).toBe(
        "manual-test-required",
      );
      expect(pack.routines[0].testStatus).toBe("not-tested");
      expect(pack.platforms.hermes.artifactKind).toBe("profile-archive");
      expect(pack.platforms.hermes.importable).toBe(true);
      expect(pack.platforms.grokBot.artifactKind).toBe(
        "manual-build-brief",
      );
      expect(pack.platforms.grokBot.importable).toBe(false);
      expect(pack.platforms.grokBot.testStatus).toBe(
        "adaptation-prepared-not-tested",
      );
    }
  });

  it("normalizes each approval rule once before calculating risk", () => {
    const bot: StarterBot = copy(STARTER_BOTS[0]);
    bot.workshopDraft.toolsIntegrations = "Conversation only";
    bot.workshopDraft.approvalBoundaries = [
      "Ask before spending money",
      "Ask before spending money",
      "Do not publish",
      "Keep source links with claims",
    ].join("\n");
    bot.boundaries = [
      "A person approves final wording.",
      "Do not publish",
      "Keep source links with claims",
    ];

    const pack = starterBotToPortablePackV2(bot);
    const classified = [
      ...pack.controls.requiresApproval,
      ...pack.controls.operatingLimits,
      ...pack.controls.prohibited,
    ].map((item) => item.toLocaleLowerCase());

    expect(pack.controls.requiresApproval).toEqual([
      "Ask before spending money",
      "A person approves final wording.",
    ]);
    expect(pack.controls.prohibited).toEqual(["Do not publish"]);
    expect(pack.controls.operatingLimits).toEqual([
      "Keep source links with claims",
    ]);
    expect(new Set(classified).size).toBe(classified.length);
    expect(pack.controls.riskLevel).toBe("Elevated");
    expect(validatePortableBotPackV2(pack)).toEqual([]);
  });

  it("keeps absolute prohibitions separate from actions allowed with approval", () => {
    const bot: StarterBot = copy(STARTER_BOTS[0]);
    bot.workshopDraft.approvalBoundaries = [
      "Do not change files outside the approved project",
      "Do not connect outside services without approval",
    ].join("\n");
    bot.boundaries = [];

    const pack = starterBotToPortablePackV2(bot);

    expect(pack.controls.prohibited).toContain(
      "Do not change files outside the approved project",
    );
    expect(pack.controls.requiresApproval).toContain(
      "Do not connect outside services without approval",
    );
    expect(pack.controls.requiresApproval).not.toContain(
      "Do not change files outside the approved project",
    );
    expect(validatePortableBotPackV2(pack)).toEqual([]);
  });

  it("uses an absolute fallback when a Bot has no specific prohibition", () => {
    const planner = STARTER_BOTS.find((bot) => bot.slug === "planner")!;
    const pack = starterBotToPortablePackV2(planner);

    expect(pack.controls.prohibited).toEqual([
      "Never bypass an approval gate, access control, or shutdown instruction.",
    ]);
    expect(pack.controls.prohibited.join(" ")).not.toMatch(
      /unless a person .*approves/i,
    );
    expect(validatePortableBotPackV2(pack)).toEqual([]);
  });

  it("uses stable artifact IDs derived only from the Bot slug", () => {
    const original = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const revisedBot: StarterBot = copy(STARTER_BOTS[0]);
    revisedBot.name = "Scout Revised";
    revisedBot.summary = "A revised summary that does not change identity.";
    revisedBot.image = "/new-portrait.png";
    const revised = starterBotToPortablePackV2(revisedBot);
    const ids = portableBotPackV2ArtifactIds("scout");

    expect(original.artifactId).toBe(ids.pack);
    expect(revised.artifactId).toBe(ids.pack);
    expect(revised.identity.artifactId).toBe(ids.identity);
    expect(revised.identity.portrait.artifactId).toBe(ids.portrait);
    expect(revised.skills[0].artifactId).toBe(ids.primarySkill);
    expect(revised.routines[0].artifactId).toBe(ids.primaryRoutine);
    expect(revised.platforms.hermes.artifactId).toBe(
      ids.hermesProfileArchive,
    );
    expect(revised.platforms.grokBot.artifactId).toBe(ids.grokManualBrief);
    expect(new Set(Object.values(ids)).size).toBe(Object.values(ids).length);
  });

  it("keeps import and test claims narrower than preparation claims", () => {
    const scout = starterBotToPortablePackV2(
      STARTER_BOTS.find((bot) => bot.slug === "scout")!,
    );
    const writer = starterBotToPortablePackV2(
      STARTER_BOTS.find((bot) => bot.slug === "writer")!,
    );

    expect(scout.platforms.hermes.packageStatus).toBe(
      "files-and-archive-checked",
    );
    expect(scout.platforms.hermes.importStatus).toBe("import-test-passed");
    expect(writer.platforms.hermes.importStatus).toBe("import-test-passed");
    expect(scout.platforms.hermes.importEvidence).toEqual({
      hermesVersion: "0.21.0",
      testedDate: "2026-09-04",
      scope: "archive-import-and-bundled-skill-presence",
    });
    expect(scout.skills[0].testStatus).toBe("not-tested");
    expect(scout.routines[0].testStatus).toBe("not-tested");
    expect(scout.platforms.grokBot.testStatus).toBe(
      "adaptation-prepared-not-tested",
    );
    expect(scout.platforms.hermes.archiveUrl).toBe(
      "/downloads/starter-bots/v2/scout.tar.gz",
    );
    expect(scout.platforms.hermes.readableFilesUrl).toBe(
      "/downloads/starter-bots/v2/scout.zip",
    );
    expect(scout.platforms.grokBot.briefUrl).toBe(
      "/downloads/grok-bot-templates/v2/scout.md",
    );
  });

  it("strictly rejects unknown, missing, inconsistent, and overstated data", () => {
    const valid = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const unknownTop = { ...copy(valid), internalNote: "do not publish" };
    const unknownNested = copy(valid) as Record<string, unknown>;
    (
      (unknownNested.platforms as Record<string, unknown>)
        .grokBot as Record<string, unknown>
    ).secret = "unexpected";
    const missing = copy(valid) as Record<string, unknown>;
    delete (missing.identity as Record<string, unknown>).summary;
    const wrongId = copy(valid);
    wrongId.skills[0].artifactId = "bot-cabinet:bot:scout:skill:changed";
    const duplicateRule = copy(valid);
    duplicateRule.controls.prohibited.push(
      duplicateRule.controls.requiresApproval[0],
    );
    const overstatedGrok = copy(valid) as unknown as {
      platforms: { grokBot: { importable: boolean } };
    };
    overstatedGrok.platforms.grokBot.importable = true;
    const wrongRisk = copy(valid);
    wrongRisk.controls.riskLevel = "Low";

    expect(validatePortableBotPackV2(unknownTop)).toContain(
      "pack.internalNote is not allowed",
    );
    expect(validatePortableBotPackV2(unknownNested)).toContain(
      "pack.platforms.grokBot.secret is not allowed",
    );
    expect(validatePortableBotPackV2(missing)).toContain(
      "pack.identity.summary is required",
    );
    expect(validatePortableBotPackV2(wrongId)).toContain(
      "pack.skills[0].artifactId must be bot-cabinet:bot:scout:skill:primary",
    );
    expect(validatePortableBotPackV2(duplicateRule)).toContain(
      "pack.controls rules must appear in only one of requiresApproval, operatingLimits, or prohibited",
    );
    expect(validatePortableBotPackV2(overstatedGrok)).toContain(
      "pack.platforms.grokBot.importable must be false",
    );
    expect(validatePortableBotPackV2(wrongRisk)).toContain(
      "pack.controls.riskLevel must be Moderate for the normalized controls",
    );
    expect(() => parsePortableBotPackV2(unknownNested)).toThrow(
      "Invalid Portable Bot Pack V2",
    );
  });

  it("leaves the existing V1 builder and download paths unchanged", () => {
    const bot = STARTER_BOTS[0];
    const v1 = starterBotToPortablePack(bot);

    expect(v1.schemaVersion).toBe(1);
    expect(v1.packVersion).toBe("1.0.0");
    expect(v1.platforms.hermes.profileUrl).toBe(
      "/downloads/starter-bots/scout.tar.gz",
    );
    expect(v1.platforms.hermes.readableFilesUrl).toBe(
      "/downloads/starter-bots/scout.zip",
    );
    expect(v1.platforms.grokBot.briefUrl).toBe(
      "/downloads/grok-bot-templates/scout.md",
    );
  });
});
