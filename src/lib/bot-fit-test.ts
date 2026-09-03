import {
  EMPTY_WORKSHOP_DRAFT,
  type WorkshopDraft,
} from "./workshop-contract";
import {
  cleanInline,
  escapeMarkdown,
  splitPlanningItems,
} from "./text-format";

export type BotFitKind = "assignment" | "skill" | "routine" | "bot" | "crew";

export type BotFitFrequency = "once" | "repeat" | "scheduled";
export type BotFitOverlap = "yes" | "no" | "unsure";

export type BotFitAnswers = {
  result: string;
  frequency: BotFitFrequency;
  needsContinuingContext: boolean;
  needsMultipleSpecialists: boolean;
  workProvenManually: boolean;
  overlapsExistingRole: BotFitOverlap;
  access: string;
  approvals: string;
  trigger: string;
  failurePlan: string;
  costLimit: string;
  shutdown: string;
  override: BotFitKind | "auto";
};

export type BotFitOperatingControls = {
  trigger: string;
  failureResponse: string;
  costLimit: string;
  shutdownMethod: string;
};

export type BotFitRoutineControls = BotFitOperatingControls;

type BotFitRecommendationCore = {
  label: string;
  summary: string;
  why: string;
  owns: string[];
  excludes: string[];
  access: string[];
  approvals: string[];
  firstTest: string;
  doneCheck: string[];
  nextAction: string;
  operatingControls?: BotFitOperatingControls;
};

type BotFitRecommendationVariant =
  | {
      kind: "assignment" | "crew";
      graduation?: never;
      workshopDraft?: never;
      routineControls?: never;
    }
  | {
      kind: "skill";
      graduation?: string[];
      workshopDraft?: never;
      routineControls?: never;
    }
  | {
      kind: "routine";
      graduation?: never;
      workshopDraft?: never;
      routineControls: BotFitRoutineControls;
    }
  | {
      kind: "bot";
      graduation?: never;
      workshopDraft: WorkshopDraft;
      routineControls?: never;
    };

export type BotFitRecommendation =
  BotFitRecommendationCore & BotFitRecommendationVariant;

export const BOT_FIT_EMPTY_ANSWERS: BotFitAnswers = {
  result: "",
  frequency: "once",
  needsContinuingContext: false,
  needsMultipleSpecialists: false,
  workProvenManually: false,
  overlapsExistingRole: "unsure",
  access: "",
  approvals: "",
  trigger: "",
  failurePlan: "",
  costLimit: "",
  shutdown: "",
  override: "auto",
};

const BOT_FIT_ARTIFACTS: Record<
  BotFitKind,
  { label: string; fileName: string; heading: string }
> = {
  assignment: {
    label: "Assignment",
    fileName: "assignment-brief.md",
    heading: "Assignment brief",
  },
  skill: {
    label: "Skill",
    fileName: "SKILL.md",
    heading: "Reusable skill",
  },
  routine: {
    label: "Routine",
    fileName: "routine-plan.md",
    heading: "Routine plan",
  },
  bot: {
    label: "Bot",
    fileName: "bot-blueprint-start.md",
    heading: "Bot Blueprint starting point",
  },
  crew: {
    label: "Crew",
    fileName: "crew-blueprint.md",
    heading: "Crew blueprint",
  },
};

function routineGraduation(answers: BotFitAnswers): string[] {
  const steps: string[] = [];

  if (!answers.workProvenManually) {
    steps.push("Run the skill successfully by hand at least once.");
  }
  if (!cleanInline(answers.trigger)) {
    steps.push("Define the schedule or event that starts the work.");
  }
  if (!cleanInline(answers.failurePlan)) {
    steps.push("Define what happens when the work fails.");
  }
  if (!cleanInline(answers.costLimit)) {
    steps.push("Set a cost limit.");
  }
  if (!cleanInline(answers.shutdown)) {
    steps.push("Define how a person can stop the routine.");
  }

  return steps;
}

function chooseKind(answers: BotFitAnswers): {
  kind: BotFitKind;
  graduation?: string[];
} {
  if (answers.override !== "auto") {
    if (answers.override === "routine") {
      const graduation = routineGraduation(answers);
      if (graduation.length) return { kind: "skill", graduation };
    }
    return { kind: answers.override };
  }

  // These checks are deliberately ordered. One recommendation should identify
  // the smallest form that can own the work without hiding real handoffs.
  if (answers.needsMultipleSpecialists) return { kind: "crew" };

  const recurring =
    answers.frequency === "repeat" || answers.frequency === "scheduled";
  if (
    recurring &&
    answers.needsContinuingContext &&
    answers.overlapsExistingRole === "no"
  ) {
    return { kind: "bot" };
  }

  if (answers.frequency === "scheduled") {
    const graduation = routineGraduation(answers);
    if (!graduation.length) return { kind: "routine" };
    return { kind: "skill", graduation };
  }

  if (answers.frequency === "repeat") return { kind: "skill" };

  return { kind: "assignment" };
}

function requestedResult(answers: BotFitAnswers): string {
  return cleanInline(answers.result) || "Define one concrete result before starting.";
}

function minimumAccess(answers: BotFitAnswers): string[] {
  const access = splitPlanningItems(answers.access);
  return access.length
    ? access
    : ["Only the information and tools needed for the first test."];
}

function approvalPoints(answers: BotFitAnswers): string[] {
  const approvals = splitPlanningItems(answers.approvals);
  return approvals.length
    ? approvals
    : [
        "A person reviews the result before it is sent, published, purchased, deleted, or used to change another system.",
      ];
}

function firstTest(kind: BotFitKind, result: string, hasResult: boolean): string {
  if (!hasResult) {
    return "Describe one concrete result, then run a small one-time assignment.";
  }

  switch (kind) {
    case "assignment":
      return `Complete a small version of this assignment: ${result}`;
    case "skill":
      return `Run the method by hand on one small example: ${result}`;
    case "routine":
      return `Run the complete routine once on demand before relying on its trigger: ${result}`;
    case "bot":
      return `Give the Bot a small sample of the work and review its response: ${result}`;
    case "crew":
      return `Give the Crew a small sample and inspect every handoff: ${result}`;
  }
}

function doneChecks(kind: BotFitKind): string[] {
  const shared = [
    "The requested result is present and usable.",
    "The work uses only approved information and access.",
    "Every approval point remains with a person.",
  ];

  switch (kind) {
    case "assignment":
      return [...shared, "The assignment ends after the result is reviewed."];
    case "skill":
      return [
        ...shared,
        "The same steps and quality check can be used on another example.",
      ];
    case "routine":
      return [
        ...shared,
        "The trigger, failure response, cost limit, and shutdown method work as written.",
      ];
    case "bot":
      return [
        ...shared,
        "The continuing conversation improves the next assignment without expanding the job.",
      ];
    case "crew":
      return [
        ...shared,
        "Each role produces its part and passes the right material to the next role.",
      ];
  }
}

function operatingControls(answers: BotFitAnswers): BotFitOperatingControls | undefined {
  const controls = {
    trigger: cleanInline(answers.trigger),
    failureResponse: cleanInline(answers.failurePlan),
    costLimit: cleanInline(answers.costLimit),
    shutdownMethod: cleanInline(answers.shutdown),
  };

  return Object.values(controls).some(Boolean) ? controls : undefined;
}

function workshopDraft(
  answers: BotFitAnswers,
  result: string,
  test: string,
  controls?: BotFitOperatingControls,
): WorkshopDraft {
  const access = answers.access.trim();
  const approvals = answers.approvals.trim();
  const cadence =
    answers.frequency === "scheduled"
      ? cleanInline(answers.trigger) || "Define the schedule or event after the first test succeeds."
      : answers.frequency === "repeat"
        ? "When a person assigns work in the continuing conversation."
        : "When a person assigns the work.";

  return {
    ...EMPTY_WORKSHOP_DRAFT,
    botName: "New Bot",
    jobOutcome: cleanInline(answers.result),
    inputsContext:
      access || "Information, examples, and rules supplied for the first test.",
    outputsDeliverables: cleanInline(answers.result) || "A draft result for review.",
    cadenceTrigger: cadence,
    toolsIntegrations: access || "Material supplied in the Bot conversation.",
    approvalBoundaries:
      approvals ||
      "Ask before sending, publishing, purchasing, deleting, or changing another system.",
    firstRunTest: test,
    audienceSuccess:
      "The person who requested the work confirms that the result is accurate, useful, and complete.",
    accessSensitive:
      "Begin with sample or low-risk material and grant only the access required for the job.",
    prohibitedUncertainty:
      "Pause when information is missing, sources conflict, or an approval is required. Explain the issue and ask what to do.",
    continuityMemory:
      "Keep confirmed preferences, decisions, and useful context in this Bot's continuing conversation. Keep unrelated work elsewhere.",
    reviewCriteria: [
      "Check the result against the requested outcome, source material, access limits, and approval rules.",
      ...(controls
        ? [
            "Automation controls:",
            `- Trigger: ${controls.trigger || "Not defined"}`,
            `- Failure response: ${controls.failureResponse || "Not defined"}`,
            `- Cost limit: ${controls.costLimit || "Not defined"}`,
            `- Shutdown: ${controls.shutdownMethod || "Not defined"}`,
          ]
        : []),
    ].join("\n"),
  };
}

function overlapNote(answers: BotFitAnswers): string {
  if (answers.overlapsExistingRole === "yes") {
    return " This work overlaps with an existing Bot, so the reusable method belongs with that role.";
  }
  if (answers.overlapsExistingRole === "unsure") {
    return " Check for overlap before creating a new role.";
  }
  return "";
}

function baseRecommendation<K extends BotFitKind>(
  kind: K,
  answers: BotFitAnswers,
  result: string,
  test: string,
): Pick<
  BotFitRecommendationCore,
  "label" | "owns" | "access" | "approvals" | "firstTest" | "doneCheck"
> & { kind: K } {
  return {
    kind,
    label: BOT_FIT_ARTIFACTS[kind].label,
    owns: [result],
    access: minimumAccess(answers),
    approvals: approvalPoints(answers),
    firstTest: test,
    doneCheck: doneChecks(kind),
  };
}

export function recommendBotFit(answers: BotFitAnswers): BotFitRecommendation {
  const choice = chooseKind(answers);
  const result = requestedResult(answers);
  const hasResult = Boolean(cleanInline(answers.result));
  const test = firstTest(choice.kind, result, hasResult);
  const overlap = overlapNote(answers);

  switch (choice.kind) {
    case "assignment":
      return {
        ...baseRecommendation("assignment", answers, result, test),
        summary: "Use a one-time assignment",
        why:
          "The work calls for one defined result. It can finish after a person reviews that result.",
        excludes: [
          "Ongoing ownership of nearby work",
          "A continuing identity, schedule, or separate body of context",
        ],
        nextAction: "Write the assignment brief and run it once.",
      };

    case "skill": {
      const needsRoutineProof = Boolean(choice.graduation?.length);
      return {
        ...baseRecommendation("skill", answers, result, test),
        summary: needsRoutineProof
          ? "Prove the method as a skill before scheduling it"
          : "Save the method as a reusable skill",
        why: needsRoutineProof
          ? `The work belongs on a schedule, but the method and operating controls need to be completed first.${overlap}`
          : `The same method will be useful again, while a separate continuing role adds little value.${overlap}`,
        owns: [
          result,
          "The repeatable steps and quality standard for producing the result",
        ],
        excludes: [
          "A duplicate Bot role or separate continuing conversation",
          "Automatic scheduling until the method and operating controls pass a manual test",
        ],
        nextAction: "Draft a SKILL.md file and test it on one real example.",
        ...(choice.graduation ? { graduation: choice.graduation } : {}),
      };
    }

    case "routine": {
      const controls = operatingControls(answers)!;
      return {
        ...baseRecommendation("routine", answers, result, test),
        summary: "Schedule the tested method as a routine",
        why:
          "The method has succeeded by hand, and its trigger, failure response, cost limit, and shutdown method are defined.",
        owns: [result, `Trigger: ${controls.trigger}`],
        excludes: [
          "Work outside the tested method",
          "Changes to the trigger, access, or limits without a new review",
        ],
        nextAction: "Create the routine plan, run it once on demand, and then enable the trigger.",
        routineControls: controls,
        operatingControls: controls,
      };
    }

    case "bot": {
      const controls = operatingControls(answers);
      return {
        ...baseRecommendation("bot", answers, result, test),
        summary: "Give the ongoing job to a dedicated Bot",
        why: `The work repeats and benefits from its own continuing conversation, instructions, and context.${overlap}`,
        excludes: [
          "Nearby work that belongs to another role",
          "Automatic schedules that have not passed a manual test",
        ],
        nextAction: "Open the prefilled Bot Lab Blueprint and review every field.",
        workshopDraft: workshopDraft(answers, result, test, controls),
        ...(controls ? { operatingControls: controls } : {}),
      };
    }

    case "crew":
      return {
        ...baseRecommendation("crew", answers, result, test),
        summary: "Create a Crew with separate jobs and clear handoffs",
        why:
          "Several distinct roles need to produce different parts of the work and pass material to one another.",
        owns: [
          result,
          "The order of work, handoff requirements, and final human review",
        ],
        excludes: [
          "Extra roles that do not produce a distinct result",
          "Unsupervised handoffs without a named output and acceptance check",
        ],
        nextAction:
          "Browse the Crew Kits and choose the closest starting plan. Edit each job, handoff, and approval point.",
      };
  }
}

export function botFitArtifactFileName(
  recommendation: BotFitRecommendation,
): string {
  return BOT_FIT_ARTIFACTS[recommendation.kind].fileName;
}

function markdownList(items: string[]): string {
  return items.map((item) => `- ${escapeMarkdown(item)}`).join("\n");
}

function formSpecificMarkdown(recommendation: BotFitRecommendation): string[] {
  switch (recommendation.kind) {
    case "assignment":
      return [
        "## Assignment steps",
        "",
        "1. Supply the approved information and rules.",
        "2. Produce the requested result as a draft.",
        "3. Stop at the listed approval points.",
        "4. End the assignment after a person reviews the result.",
      ];
    case "skill":
      return [
        "## Reusable process",
        "",
        "1. Confirm the requested result and approved inputs.",
        "2. Follow the same steps and quality standard each time.",
        "3. Return a draft with sources, assumptions, and open questions.",
        "4. Stop at every approval point.",
        "5. Record improvements only after a person reviews the result.",
        ...(recommendation.graduation?.length
          ? [
              "",
              "## Before turning this into a Routine",
              "",
              markdownList(recommendation.graduation),
            ]
          : []),
      ];
    case "routine": {
      const controls = recommendation.routineControls;
      return [
        "## Operating controls",
        "",
        `- **Trigger:** ${escapeMarkdown(controls.trigger)}`,
        `- **Failure response:** ${escapeMarkdown(controls.failureResponse)}`,
        `- **Cost limit:** ${escapeMarkdown(controls.costLimit)}`,
        `- **Shutdown:** ${escapeMarkdown(controls.shutdownMethod)}`,
        "",
        "## Activation sequence",
        "",
        "1. Run the complete process once on demand.",
        "2. Review the result and the failure path.",
        "3. Confirm the cost limit and shutdown method.",
        "4. Enable the trigger after the review passes.",
      ];
    }
    case "bot":
      return [
        "## Bot Lab handoff",
        "",
        "Use this result to prefill Bot Lab. Review the Bot name, job, inputs, output, access, approval rules, and first test before creating a Hermes profile.",
        ...(recommendation.operatingControls
          ? [
              "",
              "## Operating controls",
              "",
              `- **Trigger:** ${escapeMarkdown(recommendation.operatingControls.trigger || "Not defined")}`,
              `- **Failure response:** ${escapeMarkdown(recommendation.operatingControls.failureResponse || "Not defined")}`,
              `- **Cost limit:** ${escapeMarkdown(recommendation.operatingControls.costLimit || "Not defined")}`,
              `- **Shutdown:** ${escapeMarkdown(recommendation.operatingControls.shutdownMethod || "Not defined")}`,
            ]
          : []),
      ];
    case "crew":
      return [
        "## Crew handoffs",
        "",
        "1. Name each distinct job and its owner.",
        "2. Define the exact output each role passes forward.",
        "3. Add an acceptance check for every handoff.",
        "4. Keep the final release decision with a person.",
      ];
  }
}

export function botFitRecommendationToMarkdown(
  recommendation: BotFitRecommendation,
): string {
  return [
    `# ${BOT_FIT_ARTIFACTS[recommendation.kind].heading}`,
    "",
    `**Best fit:** ${recommendation.label}`,
    `**Plan:** ${recommendation.summary}`,
    "",
    "## Why this fits",
    "",
    escapeMarkdown(recommendation.why),
    "",
    "## What this form owns",
    "",
    markdownList(recommendation.owns),
    "",
    "## Keep elsewhere",
    "",
    markdownList(recommendation.excludes),
    "",
    "## Minimum access",
    "",
    markdownList(recommendation.access),
    "",
    "## Approval points",
    "",
    markdownList(recommendation.approvals),
    "",
    ...formSpecificMarkdown(recommendation),
    "",
    "## First test",
    "",
    escapeMarkdown(recommendation.firstTest),
    "",
    "## Done check",
    "",
    markdownList(recommendation.doneCheck),
    "",
    "## Next action",
    "",
    escapeMarkdown(recommendation.nextAction),
    "",
    "---",
    "Created with Bot Cabinet's Bot Fit Test.",
  ].join("\n");
}
