import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import { buildBotBlueprint } from "./workshop";
import {
  blueprintToBotPassport,
  botPassportFileName,
  botPassportToMarkdown,
  portableBotPackV2ToPassport,
  starterBotToPassport,
} from "./bot-passport";
import { starterBotToPortablePackV2 } from "./portable-bot-pack-v2";

describe("Bot Passports", () => {
  it("creates a Passport for every starter Bot", () => {
    for (const bot of STARTER_BOTS) {
      const passport = starterBotToPassport(bot);
      expect(passport.botName).toBe(bot.name);
      expect(passport.requestedCapabilities.length).toBeGreaterThan(0);
      expect(passport.mustAsk.length).toBeGreaterThan(0);
      expect(passport.controlNotes.join(" ")).toMatch(/technical sandbox/i);
    }
  });

  it("turns a Bot Lab Blueprint into a downloadable Passport", () => {
    const blueprint = buildBotBlueprint({
      botName: "Briefing Bot",
      jobOutcome: "Prepare a daily briefing from approved sources.",
      inputsContext: "Approved source list",
      outputsDeliverables: "Briefing\nSource list",
      cadenceTrigger: "Weekdays when requested",
      toolsIntegrations: "Web research\nAgentMail inbox",
      approvalBoundaries: "Ask before sending any email",
      firstRunTest: "Prepare a briefing from three supplied sources.",
      prohibitedUncertainty: "Never publish or spend money.",
    });
    const passport = blueprintToBotPassport(blueprint);
    const markdown = botPassportToMarkdown(passport);

    expect(passport.botName).toBe("Briefing Bot");
    expect(passport.requestedCapabilities).toContain("AgentMail inbox");
    expect(passport.mustAsk).toContain("Ask before sending any email");
    expect(passport.prohibited).toContain("Never publish or spend money.");
    expect(markdown).toContain("# Briefing Bot — Bot Passport");
    expect(markdown).toContain("## What requires approval");
    expect(markdown).toContain("## Prohibited actions");
    expect(markdown).toContain("Never publish or spend money.");
    expect(botPassportFileName(passport)).toBe("briefing-bot-bot-passport.md");
  });

  it("keeps human decisions in approvals and explicit bans in prohibited actions", () => {
    const bot = {
      ...STARTER_BOTS[0],
      boundaries: [
        "A person selects the topics to pursue.",
        "The Bot does not contact anyone.",
      ],
    };
    const passport = starterBotToPassport(bot);

    expect(passport.mustAsk).toContain("A person selects the topics to pursue.");
    expect(passport.prohibited).toContain("The Bot does not contact anyone.");
  });

  it("adapts a Portable Bot Pack V2 to a version 2 Passport", () => {
    const pack = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const passport = portableBotPackV2ToPassport(pack);
    const markdown = botPassportToMarkdown(passport);

    expect(passport.version).toBe(2);
    expect(passport.botName).toBe(pack.identity.name);
    expect(passport.reads).toEqual(pack.job.inputs);
    expect(passport.creates).toEqual(pack.job.outputs);
    expect(passport.requestedCapabilities).toEqual(
      pack.controls.requestedCapabilities,
    );
    expect(passport.mustAsk).toEqual(pack.controls.requiresApproval);
    expect(passport.prohibited).toEqual(pack.controls.prohibited);
    expect(markdown).toContain("**Passport version:** 2");
  });
});
