import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import {
  portableBotPackFileName,
  portableBotPackToGrokMarkdown,
  portableBotPackToMarkdown,
  starterBotToPortablePack,
} from "./portable-bot-pack";

describe("portable Bot Packs", () => {
  it("builds one platform-neutral recipe for every starter Bot", () => {
    for (const bot of STARTER_BOTS) {
      const pack = starterBotToPortablePack(bot);

      expect(pack.bot.slug).toBe(bot.slug);
      expect(pack.recipe.job).toBe(bot.workshopDraft.jobOutcome);
      expect(pack.recipe.inputs).toEqual(bot.setup);
      expect(pack.recipe.scope).toEqual(
        bot.workshopDraft.toolsIntegrations.split("\n"),
      );
      const statedRules = bot.workshopDraft.approvalBoundaries.split("\n");
      for (const rule of statedRules) {
        expect([
          ...pack.recipe.approvalGates,
          ...pack.recipe.operatingLimits,
        ]).toContain(rule);
      }
      expect(
        pack.recipe.approvalGates.every((gate) =>
          /^(?:ask|report|a person|the user|a leader)|\b(?:before|without approval|requires? approval)\b/i.test(gate),
        ),
      ).toBe(true);
      expect(pack.controls.mustAsk).toEqual(pack.recipe.approvalGates);
      expect(pack.controls.mustAsk).not.toEqual(bot.boundaries);
      expect(pack.controls.mustAsk).not.toContain(
        "The Bot preserves unrelated work and reports failed checks.",
      );
      expect(pack.recipe.firstTask).toBe(bot.workshopDraft.firstRunTest);
      expect(pack.recipe.checkpoint).toContain(
        `review these deliverables: ${bot.produces.join("; ")}`,
      );
      expect(pack.recipe.checkpoint).not.toMatch(/review the a /i);
      expect(pack.recipe.skill.steps.length).toBeGreaterThan(1);
      expect(pack.recipe.routine.trigger).toBe(bot.workshopDraft.cadenceTrigger);
      expect(pack.controls.mustAsk.length).toBeGreaterThan(0);
      expect(pack.platforms.hermes.availability).toBe("downloadable-profile");
      expect(pack.platforms.grokBot.availability).toBe("build-brief");
      expect(pack.platforms.grokBot.testStatus).toBe("adaptation-prepared-not-tested");
    }
  });

  it("labels the Scout reference import without extending that claim to other Bots", () => {
    const scout = starterBotToPortablePack(
      STARTER_BOTS.find((bot) => bot.slug === "scout")!,
    );
    const writer = starterBotToPortablePack(
      STARTER_BOTS.find((bot) => bot.slug === "writer")!,
    );

    expect(scout.platforms.hermes.importStatus).toBe("reference-imported");
    expect(writer.platforms.hermes.importStatus).toBe("not-individually-imported");
  });

  it("writes a complete portable Markdown pack with separate platform adapters", () => {
    const pack = starterBotToPortablePack(STARTER_BOTS[0]);
    const markdown = portableBotPackToMarkdown(pack);

    expect(markdown).toContain("# Scout — Portable Bot Pack");
    expect(markdown).toContain("## Job");
    expect(markdown).toContain("## Durable role and boundaries");
    expect(markdown).toContain("## Inputs");
    expect(markdown).toContain("## Scope and access");
    expect(markdown).toContain("## Approval gates");
    expect(markdown).toContain("## Operating limits");
    expect(markdown).toContain("## First task");
    expect(markdown).toContain("## Checkpoint");
    expect(markdown).toContain("## Reusable Skill recipe");
    expect(markdown).toContain("## Routine recipe");
    expect(markdown).toContain("## Use in Hermes");
    expect(markdown).toContain("## Build in Grok Bot");
    expect(markdown).toContain("Prepared from the portable recipe; not tested in Grok Bot");
    expect(markdown).toContain("**Readiness:** Manual test required");
    expect(markdown).not.toContain("manual-test-required");
    expect(markdown).not.toMatch(/compatible with Grok|Grok (?:installer|import)/i);
    expect(portableBotPackFileName(pack)).toBe("scout.md");
  });

  it("writes a Grok build brief that accurately describes the native share flow", () => {
    const pack = starterBotToPortablePack(STARTER_BOTS[0]);
    const markdown = portableBotPackToGrokMarkdown(pack);

    expect(markdown).toContain("# Scout — Build brief for Grok Bot");
    expect(markdown).toContain("Adaptation status: Prepared from the portable recipe; not tested in Grok Bot");
    expect(markdown).toContain("Create a new Bot in the Grok Bot desktop app");
    expect(markdown).toContain("preview the public share page");
    expect(markdown).toContain("Computer access, logins, and conversation history stay with the original account");
    expect(markdown).toContain("Bots on the same Grok account share one cloud computer");
    expect(markdown).not.toMatch(/one-click|install this Grok|import this Grok/i);
  });

  it("keeps every public Markdown artifact free of known generated-copy defects", () => {
    for (const bot of STARTER_BOTS) {
      const pack = starterBotToPortablePack(bot);
      const artifacts = [
        portableBotPackToMarkdown(pack),
        portableBotPackToGrokMarkdown(pack),
      ];

      for (const artifact of artifacts) {
        expect(artifact).not.toMatch(/review the a|\band and\b|\.\;|manual-test-required/i);
      }
    }
  });
});
