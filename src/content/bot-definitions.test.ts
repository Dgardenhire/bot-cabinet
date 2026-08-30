import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import {
  BOT_DEFINITIONS,
  starterBotToDefinition,
  validateBotDefinitions,
} from "./bot-definitions";

describe("BotDefinitionV1 catalog", () => {
  it("adapts every current starter Bot into one validated definition", () => {
    expect(BOT_DEFINITIONS).toHaveLength(STARTER_BOTS.length);
    expect(validateBotDefinitions(BOT_DEFINITIONS)).toEqual([]);
    expect(new Set(BOT_DEFINITIONS.map((bot) => bot.slug)).size).toBe(
      BOT_DEFINITIONS.length,
    );
  });

  it("preserves the job, package controls, and platform outputs", () => {
    const scout = starterBotToDefinition(STARTER_BOTS[0]);

    expect(scout.schemaVersion).toBe(1);
    expect(scout.lifecycle).toBe("public");
    expect(scout.identity.summary).toBe(STARTER_BOTS[0].summary);
    expect(scout.job.outcome).toBe(STARTER_BOTS[0].workshopDraft.jobOutcome);
    expect(scout.job.cadence).toBe(STARTER_BOTS[0].workshopDraft.cadenceTrigger);
    expect(scout.job.exampleRequests).toEqual(STARTER_BOTS[0].asks);
    expect(scout.job.inputs).toEqual(STARTER_BOTS[0].setup);
    expect(scout.job.outputs).toEqual(STARTER_BOTS[0].produces);
    expect(scout.controls.requiresApproval.length).toBeGreaterThan(0);
    expect(scout.controls.prohibited.length).toBeGreaterThan(0);
    expect(scout.platforms.hermes.artifactKind).toBe("profile-distribution");
    expect(scout.platforms.grok?.artifactKind).toBe("adaptation-brief");
    expect(scout.platforms.hermes.archiveUrl).toBe(
      "/downloads/starter-bots/scout.tar.gz",
    );
    expect(scout.platforms.grok?.adaptationUrl).toBe(
      "/downloads/grok-bot-templates/scout.md",
    );
    expect(scout.relationships.workflows).toContain("morning-industry-briefing");
    expect(scout.relationships.crewKits).toContain("publishing-desk");
    expect(scout.links.customizationUrl).toBe("/workshop/?starter=scout");
  });

  it("does not let authored catalog records claim evidence states", () => {
    for (const bot of BOT_DEFINITIONS) {
      expect(bot).not.toHaveProperty("tested");
      expect(bot).not.toHaveProperty("verified");
      expect(bot).not.toHaveProperty("reproduced");
    }
  });

  it("reports malformed records and duplicate slugs", () => {
    const valid = starterBotToDefinition(STARTER_BOTS[0]);
    const invalid = {
      ...valid,
      identity: { ...valid.identity, summary: "" },
      job: { ...valid.job, outputs: [] },
    };

    const issues = validateBotDefinitions([valid, invalid]);

    expect(issues).toContain(`Duplicate Bot slug: ${valid.slug}`);
    expect(issues).toContain(`${valid.slug}: identity.summary is required`);
    expect(issues).toContain(`${valid.slug}: job.outputs must contain at least one item`);
  });

  it("rejects unknown relationships and invalid controlled values", () => {
    const valid = starterBotToDefinition(STARTER_BOTS[0]);
    const invalid = {
      ...valid,
      lifecycle: "published" as never,
      identity: { ...valid.identity, category: "other" as never },
      relationships: { ...valid.relationships, worksWith: ["missing-bot"] },
    };
    const issues = validateBotDefinitions([invalid]);

    expect(issues).toContain(`${valid.slug}: lifecycle is invalid`);
    expect(issues).toContain(`${valid.slug}: identity.category is invalid`);
    expect(issues).toContain(
      `${valid.slug}: relationships.worksWith references unknown Bot missing-bot`,
    );
  });

  it("rejects duplicate values and self-referential teammate links", () => {
    const valid = starterBotToDefinition(STARTER_BOTS[0]);
    const invalid = {
      ...valid,
      job: {
        ...valid.job,
        inputs: [valid.job.inputs[0], valid.job.inputs[0]],
      },
      relationships: {
        ...valid.relationships,
        worksWith: [valid.slug],
      },
    };
    const issues = validateBotDefinitions([invalid]);

    expect(issues).toContain(`${valid.slug}: job.inputs must not contain duplicates`);
    expect(issues).toContain(
      `${valid.slug}: relationships.worksWith must not reference itself`,
    );
  });
});
