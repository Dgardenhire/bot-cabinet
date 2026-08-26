import { describe, expect, it } from "vitest";

import {
  EMPTY_WORKSHOP_DRAFT,
  blueprintFileName,
  blueprintPdfFileName,
  blueprintToRoleInstructions,
  blueprintToMarkdown,
  buildBotBlueprint,
  coerceWorkshopDraft,
  applyWorkshopStarterSuggestions,
  isBlueprintComplete,
  splitPlanningItems,
  type WorkshopDraft,
} from "./workshop";

const completeDraft: WorkshopDraft = {
  botName: "Morning Briefing",
  jobOutcome: "Turn approved source material into a concise morning briefing.",
  inputsContext: "Approved RSS feeds\nInternal notes\n- Yesterday's briefing",
  outputsDeliverables: "Five-item brief; Source list\nOpen questions",
  cadenceTrigger: "Weekdays at 7:00 a.m., after a human starts the run.",
  toolsIntegrations: "Web search\nRead-only document access",
  approvalBoundaries: "Ask before contacting anyone\nDo not publish without approval",
  firstRunTest: "Use three supplied articles and produce a draft with linked sources.",
};

describe("splitPlanningItems", () => {
  it("normalizes bullets, semicolons, duplicates, and blank lines", () => {
    expect(
      splitPlanningItems("- Reports\n2. Interviews; reports\n\n• Brand guide"),
    ).toEqual(["Reports", "Interviews", "Brand guide"]);
  });
});

describe("coerceWorkshopDraft", () => {
  it("accepts a complete string draft and ignores extra stored keys", () => {
    expect(coerceWorkshopDraft({ ...completeDraft, legacy: true })).toEqual(
      {
        ...completeDraft,
        audienceSuccess: "",
        accessSensitive: "",
        prohibitedUncertainty: "",
        continuityMemory: "",
        reviewCriteria: "",
        profileTitle: "",
        profileDescription: "",
        roleInstructions: "",
      },
    );
  });

  it("rejects malformed or partial persisted data", () => {
    expect(coerceWorkshopDraft(null)).toBeNull();
    expect(coerceWorkshopDraft({ botName: "Partial" })).toBeNull();
    expect(
      coerceWorkshopDraft({ ...completeDraft, firstRunTest: false }),
    ).toBeNull();
  });
});

describe("buildBotBlueprint", () => {
  it("is deterministic and translates every planning field", () => {
    const first = buildBotBlueprint(completeDraft);
    const second = buildBotBlueprint({ ...completeDraft });

    expect(first).toEqual(second);
    expect(first.kind).toBe("Bot setup plan");
    expect(first.profile.name).toBe("Morning Briefing");
    expect(first.inputs).toEqual([
      "Approved RSS feeds",
      "Internal notes",
      "Yesterday's briefing",
    ]);
    expect(first.outputs).toEqual([
      "Five-item brief",
      "Source list",
      "Open questions",
    ]);
    expect(first.completedFields).toBe(8);
    expect(isBlueprintComplete(first)).toBe(true);
    expect(first.missingFields).toEqual([]);
    expect(first.soulNotes.join(" ")).toContain("Ask before contacting anyone");
  });

  it("uses transparent placeholders without inventing missing decisions", () => {
    const blueprint = buildBotBlueprint(EMPTY_WORKSHOP_DRAFT);

    expect(blueprint.profile.name).toBe("Untitled bot");
    expect(blueprint.profile.title).toBe("Outcome still to be defined");
    expect(blueprint.inputs).toEqual([]);
    expect(blueprint.tools).toEqual([]);
    expect(blueprint.completedFields).toBe(0);
    expect(blueprint.missingFields).toHaveLength(8);
    expect(isBlueprintComplete(blueprint)).toBe(false);
    expect(blueprint.soulNotes).toContain(
      "Ask the user to list the actions that require approval before taking any action that affects files, accounts, schedules, or other people.",
    );
  });

  it("normalizes whitespace and truncates suggested profile copy", () => {
    const blueprint = buildBotBlueprint({
      ...EMPTY_WORKSHOP_DRAFT,
      botName: "  Research   Mate  ",
      jobOutcome: `  ${"A very long outcome ".repeat(20)}  `,
    });

    expect(blueprint.profile.name).toBe("Research Mate");
    expect(blueprint.profile.title.length).toBeLessThanOrEqual(72);
    expect(blueprint.profile.description.length).toBeLessThanOrEqual(180);
  });
});

describe("applyWorkshopStarterSuggestions", () => {
  it("chooses a relevant pattern and fills only empty fields", () => {
    const current: WorkshopDraft = {
      ...EMPTY_WORKSHOP_DRAFT,
      botName: "Morning Briefing",
      jobOutcome: "Research the day's approved news and prepare a briefing.",
      approvalBoundaries: "Use my existing approval rules.",
    };
    const result = applyWorkshopStarterSuggestions(current);

    expect(result.pattern).toBe("research and briefing");
    expect(result.draft.inputsContext).toContain("Approved source list");
    expect(result.draft.approvalBoundaries).toBe("Use my existing approval rules.");
    expect(result.filled).toContain("firstRunTest");
    expect(result.filled).not.toContain("approvalBoundaries");
  });

  it("uses a general pattern for an unfamiliar job", () => {
    const result = applyWorkshopStarterSuggestions({
      ...EMPTY_WORKSHOP_DRAFT,
      jobOutcome: "Organize my collection of antique button labels.",
    });

    expect(result.pattern).toBe("general work");
    expect(result.draft.outputsDeliverables).toContain("Draft result for review");
  });

  it("matches complete job words without treating substrings as technical or planning terms", () => {
    const cases = [
      {
        botName: "Daily Operations",
        jobOutcome: "Summarize approved weekly operations updates for the owner.",
        pattern: "operations and recurring work",
      },
      {
        botName: "Invoice Helper",
        jobOutcome: "Prevent errors in invoice processing.",
        pattern: "operations and recurring work",
      },
      {
        botName: "Test Bot",
        jobOutcome: "Summarize weekly operations updates for the owner.",
        pattern: "operations and recurring work",
      },
    ];

    for (const testCase of cases) {
      const result = applyWorkshopStarterSuggestions({
        ...EMPTY_WORKSHOP_DRAFT,
        botName: testCase.botName,
        jobOutcome: testCase.jobOutcome,
      });

      expect(result.pattern).toBe(testCase.pattern);
      expect(buildBotBlueprint(result.draft).completedFields).toBe(8);
    }
  });

  it("still recognizes an explicitly technical job", () => {
    const result = applyWorkshopStarterSuggestions({
      ...EMPTY_WORKSHOP_DRAFT,
      botName: "Release Helper",
      jobOutcome: "Fix a website bug and run the unit tests.",
    });

    expect(result.pattern).toBe("software and technical work");
  });
});

describe("blueprint exports", () => {
  const blueprint = buildBotBlueprint(completeDraft);

  it("creates role instructions that can be pasted into Custom SOUL.md", () => {
    const instructions = blueprintToRoleInstructions(blueprint);

    expect(instructions).toContain("Primary job and outcome");
    expect(instructions).toContain("Do not publish without approval");
    expect(instructions).not.toContain("has been installed");
  });

  it("does not duplicate the approval block when generated role text is pasted back in", () => {
    const generated = blueprintToRoleInstructions(blueprint);
    const roundTrip = buildBotBlueprint({
      ...completeDraft,
      roleInstructions: generated,
    });

    expect(roundTrip.soulText).toBe(generated);
    expect(roundTrip.soulText.match(/Approval rules:/g)).toHaveLength(1);
  });

  it("exports a complete Markdown setup plan with clear status labels", () => {
    const markdown = blueprintToMarkdown(blueprint);

    expect(markdown).toContain("# Morning Briefing - Bot Blueprint");
    expect(markdown).toContain("**Status:** Draft planning document");
    expect(markdown).toContain("## Set up in Hermes Desktop");
    expect(markdown).toContain("## Permanent role instructions for Custom SOUL.md");
    expect(markdown).toContain("### First message to send");
    expect(markdown).toContain("Open the Bots tab and choose New Agent");
    expect(markdown).toContain("Five-item brief");
  });

  it("uses a safe filename and escapes Markdown-control characters", () => {
    const unusual = buildBotBlueprint({
      ...completeDraft,
      botName: "Résumé / News #1",
      jobOutcome: "Create *reviewed* [briefs] only.",
    });
    const markdown = blueprintToMarkdown(unusual);

    expect(blueprintFileName(unusual)).toBe("resume-news-1-bot-blueprint.md");
    expect(blueprintPdfFileName(unusual)).toBe("resume-news-1-bot-blueprint.pdf");
    expect(markdown).toContain("Create \\*reviewed\\* \\[briefs\\] only.");
  });

  it("chooses a code fence longer than backticks in user content", () => {
    const withFence = buildBotBlueprint({
      ...completeDraft,
      roleInstructions: "Return ``` only after review.",
    });
    const markdown = blueprintToMarkdown(withFence);

    expect(markdown).toContain("````text\n");
    expect(markdown).toContain("\n````\n");
  });
});
