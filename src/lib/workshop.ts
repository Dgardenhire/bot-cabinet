export type WorkshopDraft = {
  botName: string;
  jobOutcome: string;
  inputsContext: string;
  outputsDeliverables: string;
  cadenceTrigger: string;
  toolsIntegrations: string;
  approvalBoundaries: string;
  firstRunTest: string;
  audienceSuccess?: string;
  accessSensitive?: string;
  prohibitedUncertainty?: string;
  continuityMemory?: string;
  reviewCriteria?: string;
  profileTitle?: string;
  profileDescription?: string;
  roleInstructions?: string;
};

export type WorkshopFieldKey = Exclude<
  keyof WorkshopDraft,
  | "audienceSuccess"
  | "accessSensitive"
  | "prohibitedUncertainty"
  | "continuityMemory"
  | "reviewCriteria"
  | "profileTitle"
  | "profileDescription"
  | "roleInstructions"
>;

export type WorkshopRefinementFieldKey =
  | "audienceSuccess"
  | "accessSensitive"
  | "prohibitedUncertainty"
  | "continuityMemory"
  | "reviewCriteria";

export type WorkshopProfileFieldKey =
  | "profileTitle"
  | "profileDescription"
  | "roleInstructions";

export type WorkshopSuggestionResult = {
  draft: WorkshopDraft;
  pattern: string;
  filled: Array<keyof WorkshopDraft>;
};

export type BlueprintProfile = {
  name: string;
  title: string;
  description: string;
};

export type BotBlueprint = {
  version: 1;
  kind: "Bot setup plan";
  profile: BlueprintProfile;
  mission: string;
  inputs: string[];
  outputs: string[];
  cadence: string;
  tools: string[];
  approvals: string[];
  firstRunTest: string;
  audienceSuccess: string;
  accessSensitive: string;
  prohibitedUncertainty: string;
  continuityMemory: string;
  reviewCriteria: string;
  soulNotes: string[];
  soulText: string;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
  officialHermesSurface: string;
};

export const WORKSHOP_STORAGE_KEY = "hermes-registry.workshop-draft.v1";

export const EMPTY_WORKSHOP_DRAFT: WorkshopDraft = {
  botName: "",
  jobOutcome: "",
  inputsContext: "",
  outputsDeliverables: "",
  cadenceTrigger: "",
  toolsIntegrations: "",
  approvalBoundaries: "",
  firstRunTest: "",
  audienceSuccess: "",
  accessSensitive: "",
  prohibitedUncertainty: "",
  continuityMemory: "",
  reviewCriteria: "",
  profileTitle: "",
  profileDescription: "",
  roleInstructions: "",
};

export const OFFICIAL_HERMES_SURFACE =
  "Hermes Bot Mode profiles use a Name, Title, and Description. Advanced settings include the AI model service, Custom SOUL.md role instructions, skills, tools, and MCP connections to outside services. Review every choice in Hermes Desktop.";

const FIELD_LABELS: Record<WorkshopFieldKey, string> = {
  botName: "Bot name",
  jobOutcome: "Job and outcome",
  inputsContext: "Information and rules",
  outputsDeliverables: "What it should produce",
  cadenceTrigger: "When it should run",
  toolsIntegrations: "Tools and outside services",
  approvalBoundaries: "When it must ask you",
  firstRunTest: "First test",
};

const DRAFT_KEYS = Object.keys(FIELD_LABELS) as WorkshopFieldKey[];

const REFINEMENT_KEYS: WorkshopRefinementFieldKey[] = [
  "audienceSuccess",
  "accessSensitive",
  "prohibitedUncertainty",
  "continuityMemory",
  "reviewCriteria",
];

type WorkshopSuggestionPattern = {
  name: string;
  matches: RegExp;
  fields: Pick<
    WorkshopDraft,
    | "inputsContext"
    | "outputsDeliverables"
    | "cadenceTrigger"
    | "toolsIntegrations"
    | "approvalBoundaries"
    | "firstRunTest"
  >;
};

const WORKSHOP_SUGGESTION_PATTERNS: WorkshopSuggestionPattern[] = [
  {
    name: "research and briefing",
    matches:
      /\b(?:research|brief(?:ing|s|ed)?|news|sources?|trends?|monitor(?:ing|ed)?|scans?|scanning|intelligence)\b/i,
    fields: {
      inputsContext: "Approved source list\nResearch question or topic\nRelevant background notes\nPreferred briefing format",
      outputsDeliverables: "Concise findings\nLinked source list\nImplications\nOpen questions and missing information",
      cadenceTrigger: "When a person provides or approves the sources and starts the work.",
      toolsIntegrations: "Web research\nRead-only access to approved documents",
      approvalBoundaries: "Ask before contacting anyone\nAsk before sending or publishing\nAsk before using a source outside the approved list",
      firstRunTest: "Use three approved sources to produce a short draft with links, implications, and open questions for review.",
    },
  },
  {
    name: "writing and editing",
    matches:
      /\b(?:write|writing|writer|draft(?:ing|s|ed)?|articles?|posts?|copy|edit(?:ing|or|s|ed)?|rewrite|newsletter|scripts?)\b/i,
    fields: {
      inputsContext: "Approved brief\nSource material\nAudience and purpose\nStyle guide or example",
      outputsDeliverables: "Draft for review\nSource notes\nQuestions that require a decision",
      cadenceTrigger: "When a person supplies the brief and approved source material.",
      toolsIntegrations: "Read-only access to approved documents",
      approvalBoundaries: "Ask before changing the intended meaning\nAsk before adding unsupported claims\nAsk before sending or publishing",
      firstRunTest: "Use a short approved brief and sample source material to produce one draft for review.",
    },
  },
  {
    name: "planning and project work",
    matches:
      /\b(?:plan(?:ning|s|ned)?|projects?|roadmaps?|strateg(?:y|ies|ic)|schedul(?:e|es|ed|ing)|campaigns?|launch(?:es|ed|ing)?|events?)\b/i,
    fields: {
      inputsContext: "Goal and intended result\nKnown constraints\nPeople involved\nDates or deadlines\nApproved background material",
      outputsDeliverables: "Step-by-step plan\nMilestones and owners\nRisks and dependencies\nDecisions that need approval",
      cadenceTrigger: "When a person starts a planning session or supplies updated project information.",
      toolsIntegrations: "Read-only access to approved project documents\nCalendar information supplied for the test",
      approvalBoundaries: "Ask before assigning work to anyone\nAsk before committing a date or budget\nAsk before changing a shared project record",
      firstRunTest: "Use a small sample project to prepare a one-week plan with milestones, risks, and approval points.",
    },
  },
  {
    name: "software and technical work",
    matches:
      /\b(?:code|coding|software|developers?|programming|bugs?|unit tests?|test suites?|repositories?|websites?|apps?)\b/i,
    fields: {
      inputsContext: "Approved project files\nRequested change\nAcceptance criteria\nExisting test instructions",
      outputsDeliverables: "Proposed change\nTest results\nPlain-English change summary\nRemaining risks or questions",
      cadenceTrigger: "When a person assigns a specific change and identifies the approved project files.",
      toolsIntegrations: "Approved project files\nProject test runner",
      approvalBoundaries: "Ask before adding a dependency\nAsk before deleting files or data\nAsk before deploying or changing an outside service",
      firstRunTest: "Use a disposable copy of the project to make one small change, run the relevant test, and return the result for review.",
    },
  },
  {
    name: "operations and recurring work",
    matches:
      /\b(?:operations?|operational|status|reports?|process(?:es|ing|ed)?|workflows?|inbox|meetings?|tasks?|follow(?:[\s-]?up)s?)\b/i,
    fields: {
      inputsContext: "Approved process notes\nCurrent status information\nPeople and responsibilities\nEscalation rules",
      outputsDeliverables: "Current status summary\nAction list\nExceptions that need attention\nQuestions for a person",
      cadenceTrigger: "When a person supplies the current information or begins the recurring review.",
      toolsIntegrations: "Read-only access to approved status information",
      approvalBoundaries: "Ask before contacting anyone\nAsk before changing a task, schedule, or record\nAsk before committing a person or budget",
      firstRunTest: "Use sample status information to prepare one summary and action list for review.",
    },
  },
  {
    name: "learning and instruction",
    matches:
      /\b(?:learn(?:ing|s|ed)?|teach(?:ing|es)?|stud(?:y|ies|ying)|courses?|lessons?|coach(?:ing|es)?|explain(?:ing|s|ed)?|training)\b/i,
    fields: {
      inputsContext: "Topic or skill\nLearner's starting point\nAvailable time\nApproved learning materials",
      outputsDeliverables: "Plain-English explanation\nPractice plan\nQuestions to check understanding\nSuggested next step",
      cadenceTrigger: "When the learner begins a session or asks for the next lesson.",
      toolsIntegrations: "Approved learning materials\nWeb research when current sources are required",
      approvalBoundaries: "Identify uncertainty in high-stakes topics\nAsk before changing the learning plan\nRefer professional decisions to a qualified person",
      firstRunTest: "Use one approved source to explain a small topic, ask two review questions, and propose one practice task.",
    },
  },
];

const GENERIC_WORKSHOP_SUGGESTIONS: WorkshopSuggestionPattern = {
  name: "general work",
  matches: /.*/,
  fields: {
    inputsContext: "Approved source material\nRelevant background information\nRules or examples the Bot should follow",
    outputsDeliverables: "Draft result for review\nSupporting sources or evidence\nOpen questions and missing information",
    cadenceTrigger: "When a person supplies the approved material and starts the work.",
    toolsIntegrations: "Material supplied in the Bot conversation",
    approvalBoundaries: "Ask before contacting anyone\nAsk before sending or publishing\nAsk before changing files, accounts, schedules, or records",
    firstRunTest: "Use a small set of sample material to produce one draft with sources, assumptions, missing information, and open questions for review.",
  },
};

export function applyWorkshopStarterSuggestions(
  current: WorkshopDraft,
): WorkshopSuggestionResult {
  // A Bot name is a label, not a reliable description of its work. Matching only
  // the stated job prevents names such as "Test Bot" from choosing a technical
  // template for an otherwise nontechnical purpose.
  const purpose = current.jobOutcome.trim();
  const pattern =
    WORKSHOP_SUGGESTION_PATTERNS.find((candidate) =>
      candidate.matches.test(purpose),
    ) ?? GENERIC_WORKSHOP_SUGGESTIONS;
  const refinements: Pick<
    WorkshopDraft,
    | "audienceSuccess"
    | "accessSensitive"
    | "prohibitedUncertainty"
    | "continuityMemory"
    | "reviewCriteria"
  > = {
    audienceSuccess: "The person who requested the work reviews the result for accuracy, usefulness, and completeness.",
    accessSensitive: "The first test uses sample or low-risk material. Add private, client, financial, health, or credential information only after a specific access review.",
    prohibitedUncertainty: "Pause when information is missing, sources conflict, or the next step requires approval. Explain the issue and ask what to do.",
    continuityMemory: "Keep the preferred format and confirmed decisions in the continuing conversation. Add a recurring routine after the first test passes.",
    reviewCriteria: "The requester checks the result against the expected deliverables, verifies the sources, and confirms that the Bot followed every approval rule.",
  };
  const suggestions: Partial<WorkshopDraft> = {
    ...pattern.fields,
    ...refinements,
  };
  const next = { ...current };
  const filled: Array<keyof WorkshopDraft> = [];

  for (const [key, value] of Object.entries(suggestions) as Array<
    [keyof WorkshopDraft, string]
  >) {
    if (!current[key]?.trim()) {
      next[key] = value;
      filled.push(key);
    }
  }

  return { draft: next, pattern: pattern.name, filled };
}

function cleanParagraph(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanInline(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maximum: number): string {
  if (value.length <= maximum) return value;
  const available = value.slice(0, Math.max(0, maximum - 1)).trimEnd();
  const lastSpace = available.lastIndexOf(" ");
  let wholeWords = lastSpace >= Math.floor(maximum * 0.62)
    ? available.slice(0, lastSpace)
    : available;
  wholeWords = wholeWords.replace(
    /\s+(?:and|or|with|for|from|to|into|using|by|on|of)$/i,
    "",
  );
  return `${wholeWords.replace(/[,:;\-]+$/, "")}…`;
}

export function splitPlanningItems(value: string): string[] {
  const seen = new Set<string>();

  return value
    .replace(/\r\n?/g, "\n")
    .split(/\n+|;/)
    .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function coerceWorkshopDraft(value: unknown): WorkshopDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  const draft = { ...EMPTY_WORKSHOP_DRAFT };

  for (const key of DRAFT_KEYS) {
    if (typeof candidate[key] !== "string") return null;
    draft[key] = candidate[key];
  }

  for (const key of REFINEMENT_KEYS) {
    if (candidate[key] !== undefined && typeof candidate[key] !== "string") return null;
    draft[key] = typeof candidate[key] === "string" ? candidate[key] : "";
  }

  for (const key of ["profileTitle", "profileDescription", "roleInstructions"] as const) {
    if (candidate[key] !== undefined && typeof candidate[key] !== "string") return null;
    draft[key] = typeof candidate[key] === "string" ? candidate[key] : "";
  }

  return draft;
}

export function buildBotBlueprint(draft: WorkshopDraft): BotBlueprint {
  const normalized = Object.fromEntries(
    DRAFT_KEYS.map((key) => [key, cleanParagraph(draft[key])]),
  ) as Record<WorkshopFieldKey, string>;

  const completedFields = DRAFT_KEYS.filter((key) => normalized[key]).length;
  const missingFields = DRAFT_KEYS.filter((key) => !normalized[key]).map(
    (key) => FIELD_LABELS[key],
  );

  const name = cleanInline(normalized.botName) || "Untitled bot";
  const mission = normalized.jobOutcome;
  const inputs = splitPlanningItems(normalized.inputsContext);
  const outputs = splitPlanningItems(normalized.outputsDeliverables);
  const tools = splitPlanningItems(normalized.toolsIntegrations);
  const approvals = splitPlanningItems(normalized.approvalBoundaries);
  const audienceSuccess = cleanParagraph(draft.audienceSuccess ?? "");
  const accessSensitive = cleanParagraph(draft.accessSensitive ?? "");
  const prohibitedUncertainty = cleanParagraph(draft.prohibitedUncertainty ?? "");
  const continuityMemory = cleanParagraph(draft.continuityMemory ?? "");
  const reviewCriteria = cleanParagraph(draft.reviewCriteria ?? "");
  const shortMission = cleanInline(mission);
  const suppliedTitle = cleanInline(draft.profileTitle ?? "");
  const suppliedDescription = cleanInline(draft.profileDescription ?? "");
  const suppliedRoleInstructions = cleanParagraph(draft.roleInstructions ?? "");
  const title = suppliedTitle || (shortMission
    ? truncate(shortMission, 72)
    : "Outcome still to be defined");
  const description = suppliedDescription || (shortMission
    ? truncate(shortMission, 180)
    : "Define the Bot's job and intended result.");

  const soulNotes = [
    mission ? `Primary job and outcome: ${mission}` : "Define the primary job and outcome.",
    inputs.length
      ? `Work from these inputs or context: ${inputs.join("; ")}`
      : "Ask what inputs and context are available before beginning.",
    outputs.length
      ? `Produce these deliverables: ${outputs.join("; ")}`
      : "Confirm the expected deliverable before beginning.",
    approvals.length
      ? `Approval rules: ${approvals.join("; ")}`
      : "Ask the user to list the actions that require approval before taking any action that affects files, accounts, schedules, or other people.",
    ...(audienceSuccess
      ? [`Intended user and quality standard: ${audienceSuccess}`]
      : []),
    ...(accessSensitive
      ? [`Access and sensitive-information limits: ${accessSensitive}`]
      : []),
    ...(prohibitedUncertainty
      ? [`Prohibited actions and uncertainty handling: ${prohibitedUncertainty}`]
      : []),
    ...(continuityMemory
      ? [`Conversation continuity, memory, routines, and collaboration: ${continuityMemory}`]
      : []),
    ...(reviewCriteria
      ? [`Review standard for the first test: ${reviewCriteria}`]
      : []),
  ];
  const approvalInstruction = soulNotes[3];
  const soulText = suppliedRoleInstructions
    ? suppliedRoleInstructions.includes(approvalInstruction)
      ? suppliedRoleInstructions
      : `${suppliedRoleInstructions}\n\n${approvalInstruction}`
    : soulNotes.join("\n\n");

  return {
    version: 1,
    kind: "Bot setup plan",
    profile: { name, title, description },
    mission,
    inputs,
    outputs,
    cadence: normalized.cadenceTrigger,
    tools,
    approvals,
    firstRunTest: normalized.firstRunTest,
    audienceSuccess,
    accessSensitive,
    prohibitedUncertainty,
    continuityMemory,
    reviewCriteria,
    soulNotes,
    soulText,
    completedFields,
    totalFields: DRAFT_KEYS.length,
    missingFields,
    officialHermesSurface: OFFICIAL_HERMES_SURFACE,
  };
}

export function blueprintToRoleInstructions(blueprint: BotBlueprint): string {
  return blueprint.soulText;
}

export function isBlueprintComplete(blueprint: BotBlueprint): boolean {
  return blueprint.completedFields === blueprint.totalFields;
}

export function blueprintSuccessChecks(blueprint: BotBlueprint): string[] {
  return [
    "Every requested deliverable is present.",
    ...(blueprint.reviewCriteria
      ? ["The result meets the review standard in this Blueprint."]
      : []),
    "The result uses only approved information and access.",
    "Assumptions, missing information, and open questions are listed.",
    "The Bot stops at every approval point.",
    "A person reviews the result before sending, publishing, or changing anything.",
  ];
}

export function blueprintFirstMessage(blueprint: BotBlueprint): string {
  const firstTest =
    blueprint.firstRunTest ||
    "Ask me for a small sample task and the material you should use before beginning.";
  const expectedOutputs = blueprint.outputs.length
    ? `Return a draft that includes: ${blueprint.outputs.join("; ")}.`
    : "Ask me what the finished result should include before beginning.";
  const approvalReminder = blueprint.approvals.length
    ? `Approval rules for this test: ${blueprint.approvals.join("; ")}.`
    : "Approval rule for this test: Ask before taking any action that affects files, accounts, schedules, or other people.";

  return [
    `Run this first test: ${firstTest}`,
    expectedOutputs,
    approvalReminder,
    "Use only the material and access I provide for this test. Return the result for review with confirmed sources, assumptions, missing information, and open questions.",
  ].join("\n\n");
}

function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_[\]<>#+!|])/g, "\\$1");
}

function markdownList(items: string[]): string {
  return items.length
    ? items.map((item) => `- ${escapeMarkdown(item)}`).join("\n")
    : "- _Not yet specified._";
}

function markdownParagraph(value: string): string {
  return value
    ? value
        .split("\n")
        .map((line) => escapeMarkdown(line))
        .join("  \n")
    : "_Not yet specified._";
}

function fencedText(value: string): string {
  const longestRun = Math.max(
    0,
    ...Array.from(value.matchAll(/`+/g), (match) => match[0].length),
  );
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return `${fence}text\n${value}\n${fence}`;
}

function formatBlueprintDate(generatedAt: Date): string {
  return generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function markdownChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${escapeMarkdown(item)}`).join("\n");
}

export function blueprintToMarkdown(
  blueprint: BotBlueprint,
  generatedAt = new Date(),
): string {
  const planningStatus = blueprint.missingFields.length
    ? `**Fields to complete:** ${blueprint.missingFields.map(escapeMarkdown).join(", ")}`
    : "**Planning fields:** All eight contain text.";
  const successChecks = blueprintSuccessChecks(blueprint);
  const firstMessage = blueprintFirstMessage(blueprint);

  return [
    `# ${escapeMarkdown(blueprint.profile.name)} - Bot Blueprint`,
    "",
    "> **Status:** Draft planning document generated locally in your browser. You decide which settings to apply in Hermes Desktop.",
    "",
    `**Created:** ${formatBlueprintDate(generatedAt)}`,
    "**Blueprint version:** 1",
    `**Fields filled:** ${blueprint.completedFields}/${blueprint.totalFields}`,
    planningStatus,
    "",
    "## At a glance",
    "",
    `- **Bot:** ${escapeMarkdown(blueprint.profile.name)}`,
    `- **Job:** ${markdownParagraph(blueprint.mission)}`,
    `- **When work begins:** ${markdownParagraph(blueprint.cadence)}`,
    `- **First test:** ${markdownParagraph(blueprint.firstRunTest)}`,
    "",
    "### Planned work flow",
    "",
    "1. Receive the information and rules listed in this plan.",
    "2. Complete the defined job using only the selected skills, tools, and outside services.",
    "3. Return the requested deliverables as a draft.",
    "4. Stop for the human decisions listed in this plan.",
    "5. Revise, approve, or expand access only after the first test is reviewed.",
    "",
    "## Bot basics",
    "",
    `- **Name:** ${escapeMarkdown(blueprint.profile.name)}`,
    `- **Title:** ${escapeMarkdown(blueprint.profile.title)}`,
    `- **Description:** ${escapeMarkdown(blueprint.profile.description)}`,
    "",
    "## Job and outcome",
    "",
    markdownParagraph(blueprint.mission),
    "",
    "## Who this helps and what makes the result useful",
    "",
    markdownParagraph(blueprint.audienceSuccess),
    "",
    "## Information and rules",
    "",
    markdownList(blueprint.inputs),
    "",
    "## What it should produce",
    "",
    markdownList(blueprint.outputs),
    "",
    "## When it should run",
    "",
    markdownParagraph(blueprint.cadence),
    "",
    "## Tools and outside services",
    "",
    markdownList(blueprint.tools),
    "",
    "## Access and sensitive information",
    "",
    markdownParagraph(blueprint.accessSensitive),
    "",
    "## When it must ask you",
    "",
    markdownList(blueprint.approvals),
    "",
    "## Prohibited actions and uncertainty",
    "",
    markdownParagraph(blueprint.prohibitedUncertainty),
    "",
    "## Continuing conversation, memory, routines, and other Bots",
    "",
    markdownParagraph(blueprint.continuityMemory),
    "",
    "## First test",
    "",
    markdownParagraph(blueprint.firstRunTest),
    "",
    "### Review standard",
    "",
    markdownParagraph(blueprint.reviewCriteria),
    "",
    "### First message to send",
    "",
    fencedText(firstMessage),
    "",
    "### Review checklist",
    "",
    markdownChecklist(successChecks),
    "",
    "### Decision after the test",
    "",
    "- [ ] Revise the Bot plan.",
    "- [ ] Run another limited test.",
    "- [ ] Keep the current access and begin regular use.",
    "- [ ] Add a specific capability or connection after reviewing the added risk.",
    "",
    "## Set up in Hermes Desktop",
    "",
    "1. Open the Bots tab and choose New Agent.",
    "2. Choose Fresh profile or clone an existing profile after reviewing what the clone contains.",
    "3. Enter the Name, Title, and Description above.",
    "4. Open Advanced and paste the permanent role instructions below into Custom SOUL.md.",
    "5. Choose a model or use the launch profile's model.",
    "6. Enable only the skills, tools, and outside-service connections this job requires.",
    "7. Create the Bot and send the first-test message shown above.",
    "8. Review the result before adding a routine, more access, or a group-chat role.",
    "",
    "### Access decisions to confirm",
    "",
    "- [ ] Exact files, folders, accounts, or services the Bot may use",
    "- [ ] Whether each connection is read-only or can make changes",
    "- [ ] Whether the work includes private, client, financial, health, or credential information",
    "- [ ] How to remove the access if the Bot no longer needs it",
    "- [ ] Whether the Bot should have a recurring routine after the first test passes",
    "",
    "## Permanent role instructions for Custom SOUL.md",
    "",
    fencedText(blueprintToRoleInstructions(blueprint)),
    "",
    "## Settings still chosen in Hermes Desktop",
    "",
    "- Fresh profile or clone source",
    "- Model and provider",
    "- Skills and toolsets",
    "- Outside-service connections",
    "- Shared credential access",
    "- Optional routine and delivery destination",
    "- Optional groups or other Bots",
    "",
    "## First-run review record",
    "",
    "- **Test date:**",
    "- **Reviewed by:**",
    "- **What worked:**",
    "- **What needs revision:**",
    "- **Access added or removed:**",
    "- **Next test:**",
    "",
    "## References",
    "",
    "- [Official Hermes Bot Mode guide](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode)",
    "- [Official Hermes scheduled tasks guide](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)",
    "",
    "Bot Lab creates this planning file in your browser. Apply and test each setting in Hermes Desktop.",
    "",
  ].join("\n");
}

export function blueprintFileStem(blueprint: BotBlueprint): string {
  const slug = blueprint.profile.name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return `${slug || "hermes-bot"}-bot-blueprint`;
}

export function blueprintFileName(blueprint: BotBlueprint): string {
  return `${blueprintFileStem(blueprint)}.md`;
}

export function blueprintPdfFileName(blueprint: BotBlueprint): string {
  return `${blueprintFileStem(blueprint)}.pdf`;
}
