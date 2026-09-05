import type { StarterBot } from "../data/starter-bots";
import {
  starterBotReviewCheckpoint,
  starterBotSkillSteps,
} from "./portable-bot-pack-shared";
import { splitPlanningItems } from "./text-format";

export const PORTABLE_BOT_PACK_V2_SCHEMA_VERSION = 2 as const;
export const PORTABLE_BOT_PACK_V2_PACK_VERSION = "2.0.0" as const;
export const PORTABLE_BOT_PACK_V2_PUBLISHED_DATE = "2026-09-04" as const;

const IMPORT_TESTED_SLUGS = new Set(["scout", "researcher", "writer", "editor", "planner", "client", "coder", "ops", "professor", "architect", "founding-engineer", "chief-of-staff", "coach", "nova", "pulse", "story"]);

export type PortableBotPackV2RiskLevel = "Low" | "Moderate" | "Elevated";

export type PortableBotPackV2 = {
  schemaVersion: typeof PORTABLE_BOT_PACK_V2_SCHEMA_VERSION;
  packVersion: typeof PORTABLE_BOT_PACK_V2_PACK_VERSION;
  artifactId: string;
  preparationStatus: "prepared";
  identity: {
    artifactId: string;
    slug: string;
    name: string;
    title: string;
    category: StarterBot["category"];
    summary: string;
    audience: string;
    portrait: {
      artifactId: string;
      url: string;
    };
  };
  job: {
    outcome: string;
    exampleRequests: string[];
    inputs: string[];
    outputs: string[];
    cadence: string;
    firstMission: string;
    checkpoint: string;
  };
  instructions: {
    durableRoleAndBoundaries: string;
  };
  controls: {
    riskLevel: PortableBotPackV2RiskLevel;
    requestedCapabilities: string[];
    allowedWithoutApproval: string[];
    requiresApproval: string[];
    operatingLimits: string[];
    prohibited: string[];
    shutdown: string;
  };
  skills: Array<{
    artifactId: string;
    name: string;
    preparationStatus: "prepared";
    testStatus: "not-tested";
    whenToUse: string;
    inputs: string[];
    steps: string[];
    outputs: string[];
    requiresApproval: string[];
    prohibited: string[];
  }>;
  routines: Array<{
    artifactId: string;
    name: string;
    preparationStatus: "prepared";
    testStatus: "not-tested";
    activationStatus: "manual-test-required";
    owner: string;
    trigger: string;
    expectedResults: string[];
    requiresApproval: string[];
    missingInputBehavior: string;
    failureHandling: string;
  }>;
  platforms: {
    hermes: {
      platformId: "hermes-agent";
      artifactId: string;
      artifactKind: "profile-archive";
      mediaType: "application/gzip";
      importable: true;
      minimumVersion: ">=0.21.0";
      archiveUrl: string;
      readableFilesUrl: string;
      packageStatus: "files-and-archive-checked";
      importStatus: "import-test-passed" | "not-tested";
      importEvidence: null | {
        hermesVersion: "0.21.0";
        testedDate: "2026-09-04";
        scope: "archive-import-and-bundled-skill-presence";
      };
    };
    grokBot: {
      platformId: "grok-bot";
      artifactId: string;
      artifactKind: "manual-build-brief";
      mediaType: "text/markdown";
      importable: false;
      briefUrl: string;
      preparationStatus: "prepared";
      testStatus: "adaptation-prepared-not-tested";
    };
  };
  provenance: {
    source: "Bot Cabinet starter catalog";
    sourceUrl: string;
    publishedDate: typeof PORTABLE_BOT_PACK_V2_PUBLISHED_DATE | "2026-09-05";
    license: "MIT";
  };
};

type NormalizedControls = PortableBotPackV2["controls"];

const CATEGORIES = new Set<StarterBot["category"]>([
  "writing",
  "research",
  "planning",
  "technical",
  "learning",
]);

const ALLOWED_WITHOUT_APPROVAL = [
  "Analyze material supplied in its conversation",
  "Draft the listed deliverables for a person to review",
  "Identify missing information and ask questions",
] as const;

const DEFAULT_APPROVAL_GATE =
  "Ask before taking an outside action, changing access, or expanding the job.";

const DEFAULT_PROHIBITION =
  "Never bypass an approval gate, access control, or shutdown instruction.";

const SHUTDOWN =
  "Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.";

function uniqueItems(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLocaleLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function isApprovalGate(value: string) {
  return (
    /^(?:ask|report)\b/i.test(value) ||
    /\b(?:approval|confirmation|permission) (?:is )?required\b/i.test(value) ||
    /\bwithout (?:explicit )?approval\b/i.test(value) ||
    /^(?:a|the) (?:person|user|leader)\b/i.test(value)
  );
}

function isProhibition(value: string) {
  return (
    /\b(?:do not|does not|never|prohibit|must not|may not)\b/i.test(value) &&
    !/\bwithout (?:explicit )?approval\b/i.test(value)
  );
}

function riskLevel(
  requestedCapabilities: readonly string[],
  requiresApproval: readonly string[],
  operatingLimits: readonly string[],
): PortableBotPackV2RiskLevel {
  const text = [
    ...requestedCapabilities,
    ...requiresApproval,
    ...operatingLimits,
  ]
    .join(" ")
    .toLocaleLowerCase();

  if (
    /payment|card|money|spend|purchase|publish|send|phone|deploy|delete|credential|account/.test(
      text,
    )
  ) {
    return "Elevated";
  }
  if (/web|file|folder|document|email|calendar|repository|code/.test(text)) {
    return "Moderate";
  }
  return "Low";
}

/** Classify every rule once, then calculate risk from the final controls. */
function normalizeControls(bot: StarterBot): NormalizedControls {
  const requestedCapabilities = uniqueItems(
    splitPlanningItems(bot.workshopDraft.toolsIntegrations),
  );
  const sourceRules = uniqueItems([
    ...splitPlanningItems(bot.workshopDraft.approvalBoundaries),
    ...bot.boundaries,
    ...splitPlanningItems(bot.workshopDraft.prohibitedUncertainty ?? ""),
  ]);
  const requiresApproval: string[] = [];
  const operatingLimits: string[] = [];
  const prohibited: string[] = [];

  for (const rule of sourceRules) {
    if (isProhibition(rule)) {
      prohibited.push(rule);
    } else if (isApprovalGate(rule)) {
      requiresApproval.push(rule);
    } else {
      operatingLimits.push(rule);
    }
  }

  if (!requiresApproval.length) requiresApproval.push(DEFAULT_APPROVAL_GATE);
  if (!prohibited.length) prohibited.push(DEFAULT_PROHIBITION);

  return {
    riskLevel: riskLevel(
      requestedCapabilities,
      requiresApproval,
      operatingLimits,
    ),
    requestedCapabilities,
    allowedWithoutApproval: [...ALLOWED_WITHOUT_APPROVAL],
    requiresApproval,
    operatingLimits,
    prohibited,
    shutdown: SHUTDOWN,
  };
}

export function portableBotPackV2ArtifactIds(slug: string) {
  const prefix = `bot-cabinet:bot:${slug}`;
  return {
    pack: `${prefix}:portable-pack`,
    identity: `${prefix}:identity`,
    portrait: `${prefix}:portrait`,
    primarySkill: `${prefix}:skill:primary`,
    primaryRoutine: `${prefix}:routine:primary`,
    hermesProfileArchive: `${prefix}:platform:hermes:profile-archive`,
    grokManualBrief: `${prefix}:platform:grok-bot:manual-brief`,
  } as const;
}

export function portableBotPackV2ArtifactPaths(slug: string) {
  return {
    portableJsonUrl: `/downloads/portable-bot-packs/v2/${slug}.json`,
    portableMarkdownUrl: `/downloads/portable-bot-packs/v2/${slug}.md`,
    hermesArchiveUrl: `/downloads/starter-bots/v2/${slug}.tar.gz`,
    hermesReadableFilesUrl: `/downloads/starter-bots/v2/${slug}.zip`,
    grokBriefUrl: `/downloads/grok-bot-templates/v2/${slug}.md`,
    sourcePageUrl: `https://botcabinet.com/bots/${slug}/`,
  } as const;
}

export function starterBotToPortablePackV2(
  bot: StarterBot,
): PortableBotPackV2 {
  const controls = normalizeControls(bot);
  const ids = portableBotPackV2ArtifactIds(bot.slug);
  const paths = portableBotPackV2ArtifactPaths(bot.slug);

  return {
    schemaVersion: PORTABLE_BOT_PACK_V2_SCHEMA_VERSION,
    packVersion: PORTABLE_BOT_PACK_V2_PACK_VERSION,
    artifactId: ids.pack,
    preparationStatus: "prepared",
    identity: {
      artifactId: ids.identity,
      slug: bot.slug,
      name: bot.name,
      title: bot.title,
      category: bot.category,
      summary: bot.summary,
      audience: bot.whoItHelps,
      portrait: {
        artifactId: ids.portrait,
        url: bot.image,
      },
    },
    job: {
      outcome: bot.workshopDraft.jobOutcome,
      exampleRequests: [...bot.asks],
      inputs: [...bot.setup],
      outputs: [...bot.produces],
      cadence: bot.workshopDraft.cadenceTrigger,
      firstMission: bot.workshopDraft.firstRunTest,
      checkpoint: starterBotReviewCheckpoint(bot),
    },
    instructions: {
      durableRoleAndBoundaries: bot.soul,
    },
    controls,
    skills: [
      {
        artifactId: ids.primarySkill,
        name: `${bot.name} core Skill`,
        preparationStatus: "prepared",
        testStatus: "not-tested",
        whenToUse: bot.workshopDraft.cadenceTrigger,
        inputs: [...bot.setup],
        steps: starterBotSkillSteps(bot),
        outputs: [...bot.produces],
        requiresApproval: [...controls.requiresApproval],
        prohibited: [...controls.prohibited],
      },
    ],
    routines: [
      {
        artifactId: ids.primaryRoutine,
        name: `${bot.name} primary Routine`,
        preparationStatus: "prepared",
        testStatus: "not-tested",
        activationStatus: "manual-test-required",
        owner: bot.name,
        trigger: bot.workshopDraft.cadenceTrigger,
        expectedResults: [...bot.produces],
        requiresApproval: [...controls.requiresApproval],
        missingInputBehavior:
          "Pause and ask for the missing source or input. Report which parts remain incomplete.",
        failureHandling:
          "Stop, preserve the completed work, and report the failure before trying again or changing access.",
      },
    ],
    platforms: {
      hermes: {
        platformId: "hermes-agent",
        artifactId: ids.hermesProfileArchive,
        artifactKind: "profile-archive",
        mediaType: "application/gzip",
        importable: true,
        minimumVersion: ">=0.21.0",
        archiveUrl: paths.hermesArchiveUrl,
        readableFilesUrl: paths.hermesReadableFilesUrl,
        packageStatus: "files-and-archive-checked",
        importStatus: IMPORT_TESTED_SLUGS.has(bot.slug) ? "import-test-passed" : "not-tested",
        importEvidence: IMPORT_TESTED_SLUGS.has(bot.slug) ? {
          hermesVersion: "0.21.0",
          testedDate: "2026-09-04",
          scope: "archive-import-and-bundled-skill-presence",
        } : null,
      },
      grokBot: {
        platformId: "grok-bot",
        artifactId: ids.grokManualBrief,
        artifactKind: "manual-build-brief",
        mediaType: "text/markdown",
        importable: false,
        briefUrl: paths.grokBriefUrl,
        preparationStatus: "prepared",
        testStatus: "adaptation-prepared-not-tested",
      },
    },
    provenance: {
      source: "Bot Cabinet starter catalog",
      sourceUrl: paths.sourcePageUrl,
      publishedDate: IMPORT_TESTED_SLUGS.has(bot.slug) ? PORTABLE_BOT_PACK_V2_PUBLISHED_DATE : "2026-09-05",
      license: "MIT",
    },
  };
}

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function objectWithExactKeys(
  value: unknown,
  path: string,
  keys: readonly string[],
  issues: string[],
): JsonObject | undefined {
  if (!isObject(value)) {
    issues.push(`${path} must be an object`);
    return undefined;
  }

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      issues.push(`${path}.${key} is required`);
    }
  }
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) issues.push(`${path}.${key} is not allowed`);
  }
  return value;
}

function requiredText(value: unknown, path: string, issues: string[]) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push(`${path} must be a non-empty string`);
  }
}

function exactValue(
  value: unknown,
  expected: string | number | boolean,
  path: string,
  issues: string[],
) {
  if (value !== expected) issues.push(`${path} must be ${String(expected)}`);
}

function oneOf(
  value: unknown,
  expected: readonly string[],
  path: string,
  issues: string[],
) {
  if (typeof value !== "string" || !expected.includes(value)) {
    issues.push(`${path} must be one of: ${expected.join(", ")}`);
  }
}

function textArray(
  value: unknown,
  path: string,
  issues: string[],
  options: { allowEmpty?: boolean } = {},
): string[] | undefined {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array`);
    return undefined;
  }
  if (!options.allowEmpty && value.length === 0) {
    issues.push(`${path} must contain at least one item`);
  }

  const result: string[] = [];
  for (const [index, item] of value.entries()) {
    if (typeof item !== "string" || !item.trim()) {
      issues.push(`${path}[${index}] must be a non-empty string`);
      continue;
    }
    result.push(item);
  }

  if (new Set(result).size !== result.length) {
    issues.push(`${path} must not contain duplicates`);
  }
  return result;
}

function validateIdentity(value: unknown, issues: string[]) {
  const identity = objectWithExactKeys(
    value,
    "pack.identity",
    [
      "artifactId",
      "slug",
      "name",
      "title",
      "category",
      "summary",
      "audience",
      "portrait",
    ],
    issues,
  );
  if (!identity) return;

  requiredText(identity.artifactId, "pack.identity.artifactId", issues);
  requiredText(identity.slug, "pack.identity.slug", issues);
  if (
    typeof identity.slug === "string" &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identity.slug)
  ) {
    issues.push(
      "pack.identity.slug must use lowercase words separated by hyphens",
    );
  }
  requiredText(identity.name, "pack.identity.name", issues);
  requiredText(identity.title, "pack.identity.title", issues);
  oneOf(identity.category, [...CATEGORIES], "pack.identity.category", issues);
  requiredText(identity.summary, "pack.identity.summary", issues);
  requiredText(identity.audience, "pack.identity.audience", issues);

  const portrait = objectWithExactKeys(
    identity.portrait,
    "pack.identity.portrait",
    ["artifactId", "url"],
    issues,
  );
  if (!portrait) return;
  requiredText(
    portrait.artifactId,
    "pack.identity.portrait.artifactId",
    issues,
  );
  requiredText(portrait.url, "pack.identity.portrait.url", issues);
}

function validateJob(value: unknown, issues: string[]) {
  const job = objectWithExactKeys(
    value,
    "pack.job",
    [
      "outcome",
      "exampleRequests",
      "inputs",
      "outputs",
      "cadence",
      "firstMission",
      "checkpoint",
    ],
    issues,
  );
  if (!job) return;
  requiredText(job.outcome, "pack.job.outcome", issues);
  textArray(job.exampleRequests, "pack.job.exampleRequests", issues);
  textArray(job.inputs, "pack.job.inputs", issues);
  textArray(job.outputs, "pack.job.outputs", issues);
  requiredText(job.cadence, "pack.job.cadence", issues);
  requiredText(job.firstMission, "pack.job.firstMission", issues);
  requiredText(job.checkpoint, "pack.job.checkpoint", issues);
}

function validateControls(value: unknown, issues: string[]) {
  const controls = objectWithExactKeys(
    value,
    "pack.controls",
    [
      "riskLevel",
      "requestedCapabilities",
      "allowedWithoutApproval",
      "requiresApproval",
      "operatingLimits",
      "prohibited",
      "shutdown",
    ],
    issues,
  );
  if (!controls) return;

  oneOf(
    controls.riskLevel,
    ["Low", "Moderate", "Elevated"],
    "pack.controls.riskLevel",
    issues,
  );
  const requestedCapabilities = textArray(
    controls.requestedCapabilities,
    "pack.controls.requestedCapabilities",
    issues,
  );
  textArray(
    controls.allowedWithoutApproval,
    "pack.controls.allowedWithoutApproval",
    issues,
  );
  const requiresApproval = textArray(
    controls.requiresApproval,
    "pack.controls.requiresApproval",
    issues,
  );
  const operatingLimits = textArray(
    controls.operatingLimits,
    "pack.controls.operatingLimits",
    issues,
    { allowEmpty: true },
  );
  const prohibited = textArray(
    controls.prohibited,
    "pack.controls.prohibited",
    issues,
  );
  requiredText(controls.shutdown, "pack.controls.shutdown", issues);

  const groups = [requiresApproval, operatingLimits, prohibited].filter(
    (group): group is string[] => Boolean(group),
  );
  const classified = groups.flat().map((rule) => rule.trim().toLocaleLowerCase());
  if (new Set(classified).size !== classified.length) {
    issues.push(
      "pack.controls rules must appear in only one of requiresApproval, operatingLimits, or prohibited",
    );
  }

  if (
    typeof controls.riskLevel === "string" &&
    requestedCapabilities &&
    requiresApproval &&
    operatingLimits
  ) {
    const expectedRisk = riskLevel(
      requestedCapabilities,
      requiresApproval,
      operatingLimits,
    );
    if (controls.riskLevel !== expectedRisk) {
      issues.push(
        `pack.controls.riskLevel must be ${expectedRisk} for the normalized controls`,
      );
    }
  }

}

function validateSkills(value: unknown, issues: string[]) {
  if (!Array.isArray(value)) {
    issues.push("pack.skills must be an array");
    return;
  }
  if (!value.length) issues.push("pack.skills must contain at least one Skill");

  const artifactIds: string[] = [];
  for (const [index, item] of value.entries()) {
    const path = `pack.skills[${index}]`;
    const skill = objectWithExactKeys(
      item,
      path,
      [
        "artifactId",
        "name",
        "preparationStatus",
        "testStatus",
        "whenToUse",
        "inputs",
        "steps",
        "outputs",
        "requiresApproval",
        "prohibited",
      ],
      issues,
    );
    if (!skill) continue;
    requiredText(skill.artifactId, `${path}.artifactId`, issues);
    if (typeof skill.artifactId === "string") artifactIds.push(skill.artifactId);
    requiredText(skill.name, `${path}.name`, issues);
    exactValue(
      skill.preparationStatus,
      "prepared",
      `${path}.preparationStatus`,
      issues,
    );
    exactValue(skill.testStatus, "not-tested", `${path}.testStatus`, issues);
    requiredText(skill.whenToUse, `${path}.whenToUse`, issues);
    textArray(skill.inputs, `${path}.inputs`, issues);
    textArray(skill.steps, `${path}.steps`, issues);
    textArray(skill.outputs, `${path}.outputs`, issues);
    textArray(skill.requiresApproval, `${path}.requiresApproval`, issues);
    textArray(skill.prohibited, `${path}.prohibited`, issues);
  }
  if (new Set(artifactIds).size !== artifactIds.length) {
    issues.push("pack.skills artifactId values must be unique");
  }
}

function validateRoutines(value: unknown, issues: string[]) {
  if (!Array.isArray(value)) {
    issues.push("pack.routines must be an array");
    return;
  }
  if (!value.length) {
    issues.push("pack.routines must contain at least one Routine");
  }

  const artifactIds: string[] = [];
  for (const [index, item] of value.entries()) {
    const path = `pack.routines[${index}]`;
    const routine = objectWithExactKeys(
      item,
      path,
      [
        "artifactId",
        "name",
        "preparationStatus",
        "testStatus",
        "activationStatus",
        "owner",
        "trigger",
        "expectedResults",
        "requiresApproval",
        "missingInputBehavior",
        "failureHandling",
      ],
      issues,
    );
    if (!routine) continue;
    requiredText(routine.artifactId, `${path}.artifactId`, issues);
    if (typeof routine.artifactId === "string") {
      artifactIds.push(routine.artifactId);
    }
    requiredText(routine.name, `${path}.name`, issues);
    exactValue(
      routine.preparationStatus,
      "prepared",
      `${path}.preparationStatus`,
      issues,
    );
    exactValue(routine.testStatus, "not-tested", `${path}.testStatus`, issues);
    exactValue(
      routine.activationStatus,
      "manual-test-required",
      `${path}.activationStatus`,
      issues,
    );
    requiredText(routine.owner, `${path}.owner`, issues);
    requiredText(routine.trigger, `${path}.trigger`, issues);
    textArray(routine.expectedResults, `${path}.expectedResults`, issues);
    textArray(routine.requiresApproval, `${path}.requiresApproval`, issues);
    requiredText(
      routine.missingInputBehavior,
      `${path}.missingInputBehavior`,
      issues,
    );
    requiredText(routine.failureHandling, `${path}.failureHandling`, issues);
  }
  if (new Set(artifactIds).size !== artifactIds.length) {
    issues.push("pack.routines artifactId values must be unique");
  }
}

function validatePlatforms(value: unknown, issues: string[]) {
  const platforms = objectWithExactKeys(
    value,
    "pack.platforms",
    ["hermes", "grokBot"],
    issues,
  );
  if (!platforms) return;

  const hermes = objectWithExactKeys(
    platforms.hermes,
    "pack.platforms.hermes",
    [
      "platformId",
      "artifactId",
      "artifactKind",
      "mediaType",
      "importable",
      "minimumVersion",
      "archiveUrl",
      "readableFilesUrl",
      "packageStatus",
      "importStatus",
      "importEvidence",
    ],
    issues,
  );
  if (hermes) {
    exactValue(
      hermes.platformId,
      "hermes-agent",
      "pack.platforms.hermes.platformId",
      issues,
    );
    requiredText(
      hermes.artifactId,
      "pack.platforms.hermes.artifactId",
      issues,
    );
    exactValue(
      hermes.artifactKind,
      "profile-archive",
      "pack.platforms.hermes.artifactKind",
      issues,
    );
    exactValue(
      hermes.mediaType,
      "application/gzip",
      "pack.platforms.hermes.mediaType",
      issues,
    );
    exactValue(
      hermes.importable,
      true,
      "pack.platforms.hermes.importable",
      issues,
    );
    exactValue(
      hermes.minimumVersion,
      ">=0.21.0",
      "pack.platforms.hermes.minimumVersion",
      issues,
    );
    requiredText(
      hermes.archiveUrl,
      "pack.platforms.hermes.archiveUrl",
      issues,
    );
    requiredText(
      hermes.readableFilesUrl,
      "pack.platforms.hermes.readableFilesUrl",
      issues,
    );
    exactValue(
      hermes.packageStatus,
      "files-and-archive-checked",
      "pack.platforms.hermes.packageStatus",
      issues,
    );
    oneOf(
      hermes.importStatus,
      ["import-test-passed", "not-tested"],
      "pack.platforms.hermes.importStatus",
      issues,
    );
    if (hermes.importStatus === "not-tested" && hermes.importEvidence !== null) {
      issues.push("Untested profiles must not carry import evidence");
    }
    const importEvidence = hermes.importStatus === "not-tested" ? undefined : objectWithExactKeys(
      hermes.importEvidence,
      "pack.platforms.hermes.importEvidence",
      ["hermesVersion", "testedDate", "scope"],
      issues,
    );
    if (importEvidence) {
      exactValue(
        importEvidence.hermesVersion,
        "0.21.0",
        "pack.platforms.hermes.importEvidence.hermesVersion",
        issues,
      );
      exactValue(
        importEvidence.testedDate,
        "2026-09-04",
        "pack.platforms.hermes.importEvidence.testedDate",
        issues,
      );
      exactValue(
        importEvidence.scope,
        "archive-import-and-bundled-skill-presence",
        "pack.platforms.hermes.importEvidence.scope",
        issues,
      );
    }
  }

  const grokBot = objectWithExactKeys(
    platforms.grokBot,
    "pack.platforms.grokBot",
    [
      "platformId",
      "artifactId",
      "artifactKind",
      "mediaType",
      "importable",
      "briefUrl",
      "preparationStatus",
      "testStatus",
    ],
    issues,
  );
  if (grokBot) {
    exactValue(
      grokBot.platformId,
      "grok-bot",
      "pack.platforms.grokBot.platformId",
      issues,
    );
    requiredText(
      grokBot.artifactId,
      "pack.platforms.grokBot.artifactId",
      issues,
    );
    exactValue(
      grokBot.artifactKind,
      "manual-build-brief",
      "pack.platforms.grokBot.artifactKind",
      issues,
    );
    exactValue(
      grokBot.mediaType,
      "text/markdown",
      "pack.platforms.grokBot.mediaType",
      issues,
    );
    exactValue(
      grokBot.importable,
      false,
      "pack.platforms.grokBot.importable",
      issues,
    );
    requiredText(
      grokBot.briefUrl,
      "pack.platforms.grokBot.briefUrl",
      issues,
    );
    exactValue(
      grokBot.preparationStatus,
      "prepared",
      "pack.platforms.grokBot.preparationStatus",
      issues,
    );
    exactValue(
      grokBot.testStatus,
      "adaptation-prepared-not-tested",
      "pack.platforms.grokBot.testStatus",
      issues,
    );
  }
}

function validateProvenance(value: unknown, issues: string[]) {
  const provenance = objectWithExactKeys(
    value,
    "pack.provenance",
    ["source", "sourceUrl", "publishedDate", "license"],
    issues,
  );
  if (!provenance) return;
  exactValue(
    provenance.source,
    "Bot Cabinet starter catalog",
    "pack.provenance.source",
    issues,
  );
  requiredText(provenance.sourceUrl, "pack.provenance.sourceUrl", issues);
  oneOf(
    provenance.publishedDate,
    [PORTABLE_BOT_PACK_V2_PUBLISHED_DATE, "2026-09-05"],
    "pack.provenance.publishedDate",
    issues,
  );
  exactValue(provenance.license, "MIT", "pack.provenance.license", issues);
}

function validateStableIds(pack: JsonObject, issues: string[]) {
  if (!isObject(pack.identity) || typeof pack.identity.slug !== "string") return;
  const ids = portableBotPackV2ArtifactIds(pack.identity.slug);
  const portrait = isObject(pack.identity.portrait)
    ? pack.identity.portrait
    : undefined;
  const skills = Array.isArray(pack.skills) ? pack.skills : [];
  const routines = Array.isArray(pack.routines) ? pack.routines : [];
  const platforms = isObject(pack.platforms) ? pack.platforms : undefined;
  const hermes = platforms && isObject(platforms.hermes) ? platforms.hermes : undefined;
  const grokBot =
    platforms && isObject(platforms.grokBot) ? platforms.grokBot : undefined;

  const expected: Array<[unknown, string, string]> = [
    [pack.artifactId, ids.pack, "pack.artifactId"],
    [pack.identity.artifactId, ids.identity, "pack.identity.artifactId"],
    [portrait?.artifactId, ids.portrait, "pack.identity.portrait.artifactId"],
    [
      isObject(skills[0]) ? skills[0].artifactId : undefined,
      ids.primarySkill,
      "pack.skills[0].artifactId",
    ],
    [
      isObject(routines[0]) ? routines[0].artifactId : undefined,
      ids.primaryRoutine,
      "pack.routines[0].artifactId",
    ],
    [
      hermes?.artifactId,
      ids.hermesProfileArchive,
      "pack.platforms.hermes.artifactId",
    ],
    [
      grokBot?.artifactId,
      ids.grokManualBrief,
      "pack.platforms.grokBot.artifactId",
    ],
  ];
  for (const [actual, expectedId, path] of expected) {
    if (actual !== expectedId) issues.push(`${path} must be ${expectedId}`);
  }
}

function validateCrossReferences(pack: JsonObject, issues: string[]) {
  if (!isObject(pack.identity) || typeof pack.identity.slug !== "string") return;
  const slug = pack.identity.slug;
  const paths = portableBotPackV2ArtifactPaths(slug);
  const platforms = isObject(pack.platforms) ? pack.platforms : undefined;
  const hermes = platforms && isObject(platforms.hermes) ? platforms.hermes : undefined;
  const grokBot =
    platforms && isObject(platforms.grokBot) ? platforms.grokBot : undefined;
  const provenance = isObject(pack.provenance) ? pack.provenance : undefined;

  const expectedValues: Array<[unknown, string, string]> = [
    [
      hermes?.archiveUrl,
      paths.hermesArchiveUrl,
      "pack.platforms.hermes.archiveUrl",
    ],
    [
      hermes?.readableFilesUrl,
      paths.hermesReadableFilesUrl,
      "pack.platforms.hermes.readableFilesUrl",
    ],
    [
      grokBot?.briefUrl,
      paths.grokBriefUrl,
      "pack.platforms.grokBot.briefUrl",
    ],
    [
      provenance?.sourceUrl,
      paths.sourcePageUrl,
      "pack.provenance.sourceUrl",
    ],
  ];
  for (const [actual, expected, path] of expectedValues) {
    if (actual !== expected) issues.push(`${path} must be ${expected}`);
  }

  const expectedImportStatus = IMPORT_TESTED_SLUGS.has(String(slug)) ? "import-test-passed" : "not-tested";
  if (hermes?.importStatus !== expectedImportStatus) {
    issues.push(
      `pack.platforms.hermes.importStatus must be ${expectedImportStatus} for ${slug}`,
    );
  }

  const controls = isObject(pack.controls) ? pack.controls : undefined;
  const skills = Array.isArray(pack.skills) ? pack.skills : [];
  const routines = Array.isArray(pack.routines) ? pack.routines : [];
  const primarySkill = isObject(skills[0]) ? skills[0] : undefined;
  const primaryRoutine = isObject(routines[0]) ? routines[0] : undefined;
  if (controls && primarySkill) {
    if (
      JSON.stringify(primarySkill.requiresApproval) !==
      JSON.stringify(controls.requiresApproval)
    ) {
      issues.push(
        "pack.skills[0].requiresApproval must match pack.controls.requiresApproval",
      );
    }
    if (
      JSON.stringify(primarySkill.prohibited) !==
      JSON.stringify(controls.prohibited)
    ) {
      issues.push("pack.skills[0].prohibited must match pack.controls.prohibited");
    }
  }
  if (
    controls &&
    primaryRoutine &&
    JSON.stringify(primaryRoutine.requiresApproval) !==
      JSON.stringify(controls.requiresApproval)
  ) {
    issues.push(
      "pack.routines[0].requiresApproval must match pack.controls.requiresApproval",
    );
  }
}

export function validatePortableBotPackV2(value: unknown): string[] {
  const issues: string[] = [];
  const pack = objectWithExactKeys(
    value,
    "pack",
    [
      "schemaVersion",
      "packVersion",
      "artifactId",
      "preparationStatus",
      "identity",
      "job",
      "instructions",
      "controls",
      "skills",
      "routines",
      "platforms",
      "provenance",
    ],
    issues,
  );
  if (!pack) return issues;

  exactValue(
    pack.schemaVersion,
    PORTABLE_BOT_PACK_V2_SCHEMA_VERSION,
    "pack.schemaVersion",
    issues,
  );
  exactValue(
    pack.packVersion,
    PORTABLE_BOT_PACK_V2_PACK_VERSION,
    "pack.packVersion",
    issues,
  );
  requiredText(pack.artifactId, "pack.artifactId", issues);
  exactValue(
    pack.preparationStatus,
    "prepared",
    "pack.preparationStatus",
    issues,
  );
  validateIdentity(pack.identity, issues);
  validateJob(pack.job, issues);

  const instructions = objectWithExactKeys(
    pack.instructions,
    "pack.instructions",
    ["durableRoleAndBoundaries"],
    issues,
  );
  if (instructions) {
    requiredText(
      instructions.durableRoleAndBoundaries,
      "pack.instructions.durableRoleAndBoundaries",
      issues,
    );
  }

  validateControls(pack.controls, issues);
  validateSkills(pack.skills, issues);
  validateRoutines(pack.routines, issues);
  validatePlatforms(pack.platforms, issues);
  validateProvenance(pack.provenance, issues);
  validateStableIds(pack, issues);
  validateCrossReferences(pack, issues);
  return issues;
}

export function parsePortableBotPackV2(value: unknown): PortableBotPackV2 {
  const issues = validatePortableBotPackV2(value);
  if (issues.length) {
    throw new Error(`Invalid Portable Bot Pack V2:\n${issues.join("\n")}`);
  }
  return value as PortableBotPackV2;
}
