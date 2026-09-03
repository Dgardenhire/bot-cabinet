import { describe, expect, it } from "vitest";

import {
  BOT_FIT_EMPTY_ANSWERS,
  botFitArtifactFileName,
  botFitRecommendationToMarkdown,
  recommendBotFit,
  type BotFitAnswers,
} from "./bot-fit-test";

function answers(overrides: Partial<BotFitAnswers> = {}): BotFitAnswers {
  return {
    ...BOT_FIT_EMPTY_ANSWERS,
    result: "Turn approved interviews into a concise briefing.",
    ...overrides,
  };
}

describe("recommendBotFit", () => {
  it("recommends one assignment for a result needed once", () => {
    const recommendation = recommendBotFit(
      answers({ frequency: "once", needsContinuingContext: false }),
    );

    expect(recommendation.kind).toBe("assignment");
    expect(recommendation.label).toBe("Assignment");
    expect(recommendation.owns).toContain(
      "Turn approved interviews into a concise briefing.",
    );
    expect(recommendation.workshopDraft).toBeUndefined();
  });

  it("recommends a reusable skill when the method repeats without its own context", () => {
    const recommendation = recommendBotFit(
      answers({ frequency: "repeat", needsContinuingContext: false }),
    );

    expect(recommendation.kind).toBe("skill");
    expect(recommendation.nextAction).toContain("SKILL.md");
  });

  it("recommends a ready routine only when the manual test and operating controls exist", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "scheduled",
        workProvenManually: true,
        trigger: "Every weekday at 7:00 a.m.",
        failurePlan: "Stop and send the owner an error summary.",
        costLimit: "$1 per run.",
        shutdown: "Disable the schedule in Hermes.",
      }),
    );

    expect(recommendation.kind).toBe("routine");
    expect(recommendation.owns).toContain(
      "Trigger: Every weekday at 7:00 a.m.",
    );
    expect(recommendation.graduation).toBeUndefined();
  });

  it("falls back to a skill when scheduled work has not succeeded by hand", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "scheduled",
        workProvenManually: false,
        trigger: "Every weekday at 7:00 a.m.",
        failurePlan: "Stop and notify the owner.",
        costLimit: "$1 per run.",
        shutdown: "Disable the schedule.",
      }),
    );

    expect(recommendation.kind).toBe("skill");
    expect(recommendation.summary).toContain("before scheduling it");
    expect(recommendation.graduation).toContain(
      "Run the skill successfully by hand at least once.",
    );
  });

  it("falls back to a skill and names every missing routine control", () => {
    const recommendation = recommendBotFit(
      answers({ frequency: "scheduled", workProvenManually: true }),
    );

    expect(recommendation.kind).toBe("skill");
    expect(recommendation.graduation).toEqual([
      "Define the schedule or event that starts the work.",
      "Define what happens when the work fails.",
      "Set a cost limit.",
      "Define how a person can stop the routine.",
    ]);
  });

  it("recommends a bot for distinct repeated work that requires continuing context", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        needsContinuingContext: true,
        overlapsExistingRole: "no",
        access: "Approved interview transcripts\nBrand guide",
        approvals: "Approve every external publication",
      }),
    );

    expect(recommendation.kind).toBe("bot");
    expect(recommendation.workshopDraft).toMatchObject({
      jobOutcome: "Turn approved interviews into a concise briefing.",
      inputsContext: "Approved interview transcripts\nBrand guide",
      toolsIntegrations: "Approved interview transcripts\nBrand guide",
      approvalBoundaries: "Approve every external publication",
    });
    expect(recommendation.workshopDraft?.firstRunTest).toContain(
      "small sample",
    );
  });

  it("preserves scheduled Bot controls in the result, download, and Bot Lab handoff", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "scheduled",
        needsContinuingContext: true,
        overlapsExistingRole: "no",
        trigger: "Every weekday at 7:00 a.m.",
        failurePlan: "Stop and send the owner an error summary.",
        costLimit: "$3 per run.",
        shutdown: "Disable the schedule after two failures.",
      }),
    );
    const markdown = botFitRecommendationToMarkdown(recommendation);

    expect(recommendation.kind).toBe("bot");
    expect(recommendation.operatingControls).toEqual({
      trigger: "Every weekday at 7:00 a.m.",
      failureResponse: "Stop and send the owner an error summary.",
      costLimit: "$3 per run.",
      shutdownMethod: "Disable the schedule after two failures.",
    });
    expect(markdown).toContain("**Trigger:** Every weekday at 7:00 a.m.");
    expect(markdown).toContain(
      "**Failure response:** Stop and send the owner an error summary.",
    );
    expect(markdown).toContain("**Cost limit:** $3 per run.");
    expect(markdown).toContain(
      "**Shutdown:** Disable the schedule after two failures.",
    );
    expect(recommendation.workshopDraft?.reviewCriteria).toContain(
      "- Trigger: Every weekday at 7:00 a.m.",
    );
    expect(recommendation.workshopDraft?.reviewCriteria).toContain(
      "- Failure response: Stop and send the owner an error summary.",
    );
    expect(recommendation.workshopDraft?.reviewCriteria).toContain(
      "- Cost limit: $3 per run.",
    );
    expect(recommendation.workshopDraft?.reviewCriteria).toContain(
      "- Shutdown: Disable the schedule after two failures.",
    );
  });

  it("avoids a duplicate bot when the job already belongs to one", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        needsContinuingContext: true,
        overlapsExistingRole: "yes",
      }),
    );

    expect(recommendation.kind).toBe("skill");
    expect(recommendation.why).toContain("existing Bot");
    expect(recommendation.excludes.join(" ")).toContain("duplicate");
  });

  it("keeps the work as a skill while overlap with an existing role is unresolved", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        needsContinuingContext: true,
        overlapsExistingRole: "unsure",
      }),
    );

    expect(recommendation.kind).toBe("skill");
    expect(recommendation.why).toContain("Check for overlap");
  });

  it("recommends a crew when distinct roles must hand work to one another", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        needsContinuingContext: true,
        needsMultipleSpecialists: true,
      }),
    );

    expect(recommendation.kind).toBe("crew");
    expect(recommendation.nextAction).toContain("Crew");
  });

  it("applies the documented precedence of crew, bot, routine, skill, assignment", () => {
    const common = {
      frequency: "scheduled" as const,
      needsContinuingContext: true,
      overlapsExistingRole: "no" as const,
      workProvenManually: true,
      trigger: "Every morning.",
      failurePlan: "Stop.",
      costLimit: "$1.",
      shutdown: "Disable it.",
    };

    expect(recommendBotFit(answers({ ...common, needsMultipleSpecialists: true })).kind).toBe(
      "crew",
    );
    expect(recommendBotFit(answers(common)).kind).toBe("bot");
    expect(
      recommendBotFit(answers({ ...common, needsContinuingContext: false })).kind,
    ).toBe("routine");
    expect(
      recommendBotFit(
        answers({
          ...common,
          frequency: "repeat",
          needsContinuingContext: false,
          trigger: "",
        }),
      ).kind,
    ).toBe("skill");
    expect(
      recommendBotFit(
        answers({ ...common, frequency: "once", needsContinuingContext: false }),
      ).kind,
    ).toBe("assignment");
  });

  it("honors an explicit choice while retaining the routine readiness gate", () => {
    expect(
      recommendBotFit(
        answers({ frequency: "once", override: "bot", needsContinuingContext: false }),
      ).kind,
    ).toBe("bot");

    const unreadyRoutine = recommendBotFit(
      answers({ frequency: "scheduled", override: "routine" }),
    );
    expect(unreadyRoutine.kind).toBe("skill");
    expect(unreadyRoutine.graduation).toBeDefined();
  });

  it("handles blank answers without inventing a job", () => {
    const recommendation = recommendBotFit(BOT_FIT_EMPTY_ANSWERS);

    expect(recommendation.kind).toBe("assignment");
    expect(recommendation.owns).toEqual([
      "Define one concrete result before starting.",
    ]);
    expect(recommendation.firstTest).toContain("Describe one concrete result");
  });
});

describe("Bot Fit Test artifacts", () => {
  it.each([
    ["assignment", "assignment-brief.md", "# Assignment brief"],
    ["skill", "SKILL.md", "# Reusable skill"],
    ["routine", "routine-plan.md", "# Routine plan"],
    ["crew", "crew-blueprint.md", "# Crew blueprint"],
  ] as const)("creates the %s download", (kind, fileName, heading) => {
    const base = answers({
      frequency: kind === "assignment" ? "once" : "repeat",
      needsMultipleSpecialists: kind === "crew",
      override: kind,
    });
    const recommendation = recommendBotFit(
      kind === "routine"
        ? {
            ...base,
            frequency: "scheduled",
            workProvenManually: true,
            trigger: "Every Friday.",
            failurePlan: "Stop and report the error.",
            costLimit: "$2 per run.",
            shutdown: "Disable the schedule.",
          }
        : base,
    );

    expect(recommendation.kind).toBe(kind);
    expect(botFitArtifactFileName(recommendation)).toBe(fileName);
    const markdown = botFitRecommendationToMarkdown(recommendation);
    expect(markdown).toContain(heading);
    expect(markdown).toContain("## First test");
    expect(markdown).toContain("## Done check");
    expect(markdown).toContain(
      "Turn approved interviews into a concise briefing.",
    );
  });

  it("creates an original SKILL.md draft with a reusable process and boundaries", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        access: "Approved interview transcripts",
        approvals: "A person approves the final briefing",
      }),
    );
    const markdown = botFitRecommendationToMarkdown(recommendation);

    expect(markdown).toContain("## Reusable process");
    expect(markdown).toContain("## Minimum access");
    expect(markdown).toContain("A person approves the final briefing");
    expect(markdown).not.toContain("Grok");
  });

  it("includes every routine operating control in its plan", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "scheduled",
        override: "routine",
        workProvenManually: true,
        trigger: "Every Friday.",
        failurePlan: "Stop and report the error.",
        costLimit: "$2 per run.",
        shutdown: "Disable the schedule.",
      }),
    );
    const markdown = botFitRecommendationToMarkdown(recommendation);

    expect(markdown).toContain("**Trigger:** Every Friday.");
    expect(markdown).toContain(
      "**Failure response:** Stop and report the error.",
    );
    expect(markdown).toContain("**Cost limit:** $2 per run.");
    expect(markdown).toContain("**Shutdown:** Disable the schedule.");
  });

  it("creates a plain-language fit result for a bot and preserves the workshop prefill", () => {
    const recommendation = recommendBotFit(
      answers({
        frequency: "repeat",
        needsContinuingContext: true,
        overlapsExistingRole: "no",
      }),
    );
    const markdown = botFitRecommendationToMarkdown(recommendation);

    expect(botFitArtifactFileName(recommendation)).toBe(
      "bot-blueprint-start.md",
    );
    expect(markdown).toContain("# Bot Blueprint starting point");
    expect(recommendation.workshopDraft?.jobOutcome).toBe(
      "Turn approved interviews into a concise briefing.",
    );
  });
});
