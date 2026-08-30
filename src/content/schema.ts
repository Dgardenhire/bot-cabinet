export type BotLifecycle = "draft" | "preview" | "public" | "archived";
export type BotCategory =
  | "writing"
  | "research"
  | "planning"
  | "technical"
  | "learning";

export type BotDefinitionV1 = {
  schemaVersion: 1;
  slug: string;
  version: string;
  lifecycle: BotLifecycle;
  identity: {
    name: string;
    title: string;
    category: BotCategory;
    summary: string;
    audience: string;
    image: string;
  };
  job: {
    outcome: string;
    exampleRequests: string[];
    inputs: string[];
    outputs: string[];
    cadence: string;
    firstTest: string;
  };
  instructions: {
    soul: string;
  };
  controls: {
    requestedCapabilities: string[];
    allowedWithoutApproval: string[];
    requiresApproval: string[];
    prohibited: string[];
  };
  platforms: {
    hermes: {
      minimumVersion: string;
      artifactKind: "profile-distribution";
      detailUrl: string;
      archiveUrl: string;
      readableSourceUrl: string;
    };
    grok?: {
      artifactKind: "adaptation-brief" | "template";
      adaptationUrl: string;
    };
  };
  relationships: {
    worksWith: string[];
    workflows: string[];
    crewKits: string[];
    proofCases: string[];
  };
  links: {
    detailUrl: string;
    customizationUrl: string;
  };
};

function requireText(
  issues: string[],
  bot: BotDefinitionV1,
  label: string,
  value: string,
) {
  if (!value.trim()) issues.push(`${bot.slug}: ${label} is required`);
}

function requireItems(
  issues: string[],
  bot: BotDefinitionV1,
  label: string,
  values: string[],
) {
  if (!values.length || values.some((value) => !value.trim())) {
    issues.push(`${bot.slug}: ${label} must contain at least one item`);
  }
}

function rejectDuplicates(
  issues: string[],
  bot: BotDefinitionV1,
  label: string,
  values: string[],
) {
  const normalized = values.map((value) => value.trim().toLocaleLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    issues.push(`${bot.slug}: ${label} must not contain duplicates`);
  }
}

export function validateBotDefinitions(
  definitions: readonly BotDefinitionV1[],
): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  const lifecycles = new Set<BotLifecycle>([
    "draft",
    "preview",
    "public",
    "archived",
  ]);
  const categories = new Set<BotCategory>([
    "writing",
    "research",
    "planning",
    "technical",
    "learning",
  ]);

  if (!definitions.length) return ["At least one Bot definition is required"];

  for (const bot of definitions) {
    if (slugs.has(bot.slug)) issues.push(`Duplicate Bot slug: ${bot.slug}`);
    slugs.add(bot.slug);

    if (bot.schemaVersion !== 1) {
      issues.push(`${bot.slug}: schemaVersion must be 1`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bot.slug)) {
      issues.push(`${bot.slug}: slug must use lowercase words separated by hyphens`);
    }
    if (!/^\d+\.\d+\.\d+$/.test(bot.version)) {
      issues.push(`${bot.slug}: version must use semantic versioning`);
    }
    if (!lifecycles.has(bot.lifecycle)) {
      issues.push(`${bot.slug}: lifecycle is invalid`);
    }
    if (!categories.has(bot.identity.category)) {
      issues.push(`${bot.slug}: identity.category is invalid`);
    }

    requireText(issues, bot, "identity.name", bot.identity.name);
    requireText(issues, bot, "identity.title", bot.identity.title);
    requireText(issues, bot, "identity.category", bot.identity.category);
    requireText(issues, bot, "identity.summary", bot.identity.summary);
    requireText(issues, bot, "identity.audience", bot.identity.audience);
    requireText(issues, bot, "identity.image", bot.identity.image);
    requireItems(issues, bot, "job.exampleRequests", bot.job.exampleRequests);
    requireText(issues, bot, "job.outcome", bot.job.outcome);
    requireItems(issues, bot, "job.inputs", bot.job.inputs);
    requireItems(issues, bot, "job.outputs", bot.job.outputs);
    requireText(issues, bot, "job.cadence", bot.job.cadence);
    requireText(issues, bot, "job.firstTest", bot.job.firstTest);
    requireText(issues, bot, "instructions.soul", bot.instructions.soul);
    requireItems(
      issues,
      bot,
      "controls.requestedCapabilities",
      bot.controls.requestedCapabilities,
    );
    requireItems(
      issues,
      bot,
      "controls.allowedWithoutApproval",
      bot.controls.allowedWithoutApproval,
    );
    requireItems(
      issues,
      bot,
      "controls.requiresApproval",
      bot.controls.requiresApproval,
    );
    requireItems(issues, bot, "controls.prohibited", bot.controls.prohibited);
    rejectDuplicates(issues, bot, "job.exampleRequests", bot.job.exampleRequests);
    rejectDuplicates(issues, bot, "job.inputs", bot.job.inputs);
    rejectDuplicates(issues, bot, "job.outputs", bot.job.outputs);
    rejectDuplicates(
      issues,
      bot,
      "relationships.worksWith",
      bot.relationships.worksWith,
    );
    rejectDuplicates(
      issues,
      bot,
      "relationships.workflows",
      bot.relationships.workflows,
    );
    rejectDuplicates(
      issues,
      bot,
      "relationships.crewKits",
      bot.relationships.crewKits,
    );
    requireText(
      issues,
      bot,
      "platforms.hermes.minimumVersion",
      bot.platforms.hermes.minimumVersion,
    );
    requireText(
      issues,
      bot,
      "platforms.hermes.detailUrl",
      bot.platforms.hermes.detailUrl,
    );
    requireText(
      issues,
      bot,
      "platforms.hermes.archiveUrl",
      bot.platforms.hermes.archiveUrl,
    );
    requireText(
      issues,
      bot,
      "platforms.hermes.readableSourceUrl",
      bot.platforms.hermes.readableSourceUrl,
    );
    requireText(issues, bot, "links.detailUrl", bot.links.detailUrl);
    requireText(
      issues,
      bot,
      "links.customizationUrl",
      bot.links.customizationUrl,
    );
  }

  for (const bot of definitions) {
    for (const teammate of bot.relationships.worksWith) {
      if (teammate === bot.slug) {
        issues.push(`${bot.slug}: relationships.worksWith must not reference itself`);
      }
      if (!slugs.has(teammate)) {
        issues.push(`${bot.slug}: relationships.worksWith references unknown Bot ${teammate}`);
      }
    }
  }

  return issues;
}
