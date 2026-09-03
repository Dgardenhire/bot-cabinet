import type { StarterBot } from "../data/starter-bots";
import {
  starterBotToPassport,
  type BotPassport,
} from "./bot-passport";

export type PortableBotPack = {
  schemaVersion: 1;
  packVersion: "1.0.0";
  bot: {
    slug: string;
    name: string;
    title: string;
    summary: string;
    audience: string;
  };
  recipe: {
    job: string;
    durableRoleAndBoundaries: string;
    inputs: string[];
    scope: string[];
    approvalGates: string[];
    operatingLimits: string[];
    firstTask: string;
    checkpoint: string;
    skill: {
      whenToUse: string;
      inputs: string[];
      steps: string[];
      expectedOutput: string[];
      safetyBoundaries: string[];
    };
    routine: {
      readiness: "manual-test-required";
      owner: string;
      trigger: string;
      expectedResult: string[];
      approvalGates: string[];
      missingSourceBehavior: string;
      failureHandling: string;
    };
  };
  controls: BotPassport;
  platforms: {
    hermes: {
      availability: "downloadable-profile";
      minimumVersion: ">=0.20.0";
      profileUrl: string;
      readableFilesUrl: string;
      packageStatus: "files-and-archive-checked";
      importStatus: "reference-imported" | "not-individually-imported";
    };
    grokBot: {
      availability: "build-brief";
      briefUrl: string;
      testStatus: "adaptation-prepared-not-tested";
      shareFlow: string;
      accountBoundary: string;
    };
  };
  provenance: {
    source: "Bot Cabinet starter catalog";
    sourceUrl: string;
    publishedDate: "2026-09-03";
    license: "MIT";
  };
};

function markdownList(values: readonly string[]) {
  return values.map((value) => `- ${value}`).join("\n");
}

function orderedMarkdownList(values: readonly string[]) {
  return values.map((value, index) => `${index + 1}. ${value}`).join("\n");
}

function inlineMarkdownList(values: readonly string[]) {
  return values
    .map((value) => value.trim().replace(/[.;]+$/, ""))
    .join("; ");
}

function planningItems(value: string) {
  return value
    .split(/\n|;/)
    .map((item) => item.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function uniqueItems(values: readonly string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function isApprovalGate(value: string) {
  return (
    /^(?:ask|report)\b/i.test(value) ||
    /\b(?:before|without approval|requires? approval)\b/i.test(value)
  );
}

function isHumanDecision(value: string) {
  return /^(?:a|the) (?:person|user|leader)\b/i.test(value);
}

function isProhibition(value: string) {
  return (
    /^(?:do not|never|must not)\b/i.test(value) ||
    /\b(?:does not|never|must not)\b/i.test(value)
  );
}

function portableControlRules(bot: StarterBot, base: BotPassport) {
  const setupRules = planningItems(bot.workshopDraft.approvalBoundaries);
  const approvalGates = uniqueItems([
    ...setupRules.filter(isApprovalGate),
    ...bot.boundaries.filter(isHumanDecision),
  ]);
  const prohibited = uniqueItems([
    ...setupRules.filter((rule) => {
      return !isApprovalGate(rule) && isProhibition(rule);
    }),
    ...bot.boundaries.filter((rule) => {
      return !isHumanDecision(rule) && isProhibition(rule);
    }),
  ]);
  const operatingLimits = uniqueItems([
    ...setupRules.filter((rule) => {
      return !isApprovalGate(rule) && !isProhibition(rule);
    }),
    ...bot.boundaries.filter((rule) => {
      return !isHumanDecision(rule) && !isProhibition(rule);
    }),
  ]);

  return {
    approvalGates: approvalGates.length
      ? approvalGates
      : ["Ask before taking an outside action, changing access, or expanding the job."],
    operatingLimits,
    prohibited: prohibited.length ? prohibited : base.prohibited,
  };
}

function checkpointFor(bot: StarterBot) {
  return `Pause for a person to review these deliverables: ${inlineMarkdownList(bot.produces)}. Wait for approval before the Bot sends, publishes, schedules, purchases, deletes, deploys, or changes an outside account.`;
}

function skillStepsFor(bot: StarterBot) {
  return [
    `Confirm that the request fits this job: ${bot.workshopDraft.jobOutcome}`,
    "Gather the approved inputs and ask for anything required that is missing.",
    `Create the intended result: ${bot.produces.join("; ")}.`,
    "Check the result against the approval gates and operating limits. Mark uncertain claims or decisions.",
    "Give the work to a person for review at the stated checkpoint.",
  ];
}

export function starterBotToPortablePack(bot: StarterBot): PortableBotPack {
  const baseControls = starterBotToPassport(bot);
  const rules = portableControlRules(bot, baseControls);
  const controls: BotPassport = {
    ...baseControls,
    mustAsk: rules.approvalGates,
    prohibited: rules.prohibited,
  };

  return {
    schemaVersion: 1,
    packVersion: "1.0.0",
    bot: {
      slug: bot.slug,
      name: bot.name,
      title: bot.title,
      summary: bot.summary,
      audience: bot.whoItHelps,
    },
    recipe: {
      job: bot.workshopDraft.jobOutcome,
      durableRoleAndBoundaries: bot.soul,
      inputs: [...bot.setup],
      scope: planningItems(bot.workshopDraft.toolsIntegrations),
      approvalGates: [...rules.approvalGates],
      operatingLimits: uniqueItems([
        ...rules.operatingLimits,
        ...rules.prohibited,
      ]),
      firstTask: bot.workshopDraft.firstRunTest,
      checkpoint: checkpointFor(bot),
      skill: {
        whenToUse: bot.workshopDraft.cadenceTrigger,
        inputs: [...bot.setup],
        steps: skillStepsFor(bot),
        expectedOutput: [...bot.produces],
        safetyBoundaries: [
          ...rules.approvalGates,
          ...rules.operatingLimits,
          ...rules.prohibited,
        ],
      },
      routine: {
        readiness: "manual-test-required",
        owner: bot.name,
        trigger: bot.workshopDraft.cadenceTrigger,
        expectedResult: [...bot.produces],
        approvalGates: [...rules.approvalGates],
        missingSourceBehavior: "Pause and ask for the missing source or input. Report which parts remain incomplete.",
        failureHandling: "Stop, preserve the completed work, and report the failure before trying again or changing access.",
      },
    },
    controls,
    platforms: {
      hermes: {
        availability: "downloadable-profile",
        minimumVersion: ">=0.20.0",
        profileUrl: `/downloads/starter-bots/${bot.slug}.tar.gz`,
        readableFilesUrl: `/downloads/starter-bots/${bot.slug}.zip`,
        packageStatus: "files-and-archive-checked",
        importStatus: bot.slug === "scout" ? "reference-imported" : "not-individually-imported",
      },
      grokBot: {
        availability: "build-brief",
        briefUrl: `/downloads/grok-bot-templates/${bot.slug}.md`,
        testStatus: "adaptation-prepared-not-tested",
        shareFlow: "After testing your Bot, Grok Bot can create a public preview link that another person can review and add to their own Grok Bot app.",
        accountBoundary: "Bots on the same Grok account share one cloud computer and its signed-in services. Give each Bot the minimum access required for its job.",
      },
    },
    provenance: {
      source: "Bot Cabinet starter catalog",
      sourceUrl: `https://botcabinet.com/bots/${bot.slug}/`,
      publishedDate: "2026-09-03",
      license: "MIT",
    },
  };
}

function portableRecipeMarkdown(pack: PortableBotPack) {
  return [
    "## Job",
    "",
    pack.recipe.job,
    "",
    "## Durable role and boundaries",
    "",
    pack.recipe.durableRoleAndBoundaries,
    "",
    "## Inputs",
    "",
    markdownList(pack.recipe.inputs),
    "",
    "## Scope and access",
    "",
    markdownList(pack.recipe.scope),
    "",
    "## Approval gates",
    "",
    markdownList(pack.recipe.approvalGates),
    "",
    "## Operating limits",
    "",
    markdownList(pack.recipe.operatingLimits),
    "",
    "## First task",
    "",
    pack.recipe.firstTask,
    "",
    "## Checkpoint",
    "",
    pack.recipe.checkpoint,
    "",
    "## Reusable Skill recipe",
    "",
    `**Use it when:** ${pack.recipe.skill.whenToUse}`,
    "",
    "**Inputs**",
    "",
    markdownList(pack.recipe.skill.inputs),
    "",
    "**Steps**",
    "",
    orderedMarkdownList(pack.recipe.skill.steps),
    "",
    "**Expected output**",
    "",
    markdownList(pack.recipe.skill.expectedOutput),
    "",
    "**Safety boundaries**",
    "",
    markdownList(pack.recipe.skill.safetyBoundaries),
    "",
    "## Routine recipe",
    "",
    "Run the job successfully by hand before creating a Routine.",
    "",
    `- **Owner:** ${pack.recipe.routine.owner}`,
    `- **Trigger:** ${pack.recipe.routine.trigger}`,
    "- **Readiness:** Manual test required",
    `- **Missing input:** ${pack.recipe.routine.missingSourceBehavior}`,
    `- **Failure:** ${pack.recipe.routine.failureHandling}`,
    "",
    "**Expected result**",
    "",
    markdownList(pack.recipe.routine.expectedResult),
    "",
  ];
}

function statusLabel(value: PortableBotPack["platforms"]["hermes"]["importStatus"]) {
  return value === "reference-imported"
    ? "Reference archive imported with Hermes Agent 0.20.5"
    : "Archive generated and checked; this Bot has not been individually imported";
}

export function portableBotPackToMarkdown(pack: PortableBotPack) {
  return [
    `# ${pack.bot.name} — Portable Bot Pack`,
    "",
    pack.bot.summary,
    "",
    `**Pack version:** ${pack.packVersion}`,
    `**Audience:** ${pack.bot.audience}`,
    `**Source:** ${pack.provenance.sourceUrl}`,
    "",
    ...portableRecipeMarkdown(pack),
    "## Bot Passport",
    "",
    `- **Planned risk:** ${pack.controls.riskLevel}`,
    `- **May read:** ${inlineMarkdownList(pack.controls.reads)}`,
    `- **May create:** ${inlineMarkdownList(pack.controls.creates)}`,
    `- **Requested capabilities:** ${inlineMarkdownList(pack.controls.requestedCapabilities)}`,
    `- **May work without approval:** ${inlineMarkdownList(pack.controls.mayDoWithoutApproval)}`,
    `- **Must ask first:** ${inlineMarkdownList(pack.controls.mustAsk)}`,
    `- **Prohibited:** ${inlineMarkdownList(pack.controls.prohibited)}`,
    `- **Stop and remove access:** ${pack.controls.shutdown}`,
    "",
    "## Use in Hermes",
    "",
    `- **Availability:** Downloadable Hermes profile for version ${pack.platforms.hermes.minimumVersion}`,
    `- **Profile:** https://botcabinet.com${pack.platforms.hermes.profileUrl}`,
    `- **Readable files:** https://botcabinet.com${pack.platforms.hermes.readableFilesUrl}`,
    `- **Package check:** The generated profile archive and readable files contain the listed package files.`,
    `- **Import status:** ${statusLabel(pack.platforms.hermes.importStatus)}`,
    "",
    "## Build in Grok Bot",
    "",
    "**Adaptation status:** Prepared from the portable recipe; not tested in Grok Bot.",
    "",
    "1. Create a new Bot in the Grok Bot desktop app.",
    "2. Copy the Bot name, job, durable role instructions, approval gates, and operating limits from this pack.",
    "3. Add only the Skills, Routines, and connected services required for this job.",
    "4. Run the first task with sample material and inspect the result at the checkpoint.",
    "5. After it works, review the complete configuration before using Grok Bot's public share-link flow.",
    "",
    pack.platforms.grokBot.accountBoundary,
    "",
    "Keep credentials, private information, customer data, and internal links out of anything you share publicly.",
    "",
    "## Status and provenance",
    "",
    `- **Published:** ${pack.provenance.publishedDate}`,
    `- **Source:** ${pack.provenance.source}`,
    "- **Hermes:** Downloadable profile; package files checked",
    "- **Grok Bot:** Prepared adaptation; runtime test pending",
    `- **License:** ${pack.provenance.license}`,
    "",
  ].join("\n");
}

export function portableBotPackToGrokMarkdown(pack: PortableBotPack) {
  return [
    `# ${pack.bot.name} — Build brief for Grok Bot`,
    "",
    pack.bot.summary,
    "",
    "**Adaptation status: Prepared from the portable recipe; not tested in Grok Bot.**",
    "",
    "This brief translates the Bot Cabinet recipe into Grok Bot's current profile, Skill, Routine, and sharing model. Build and test it inside your own Grok Bot app.",
    "",
    ...portableRecipeMarkdown(pack),
    "## Build it in Grok Bot",
    "",
    "1. Create a new Bot in the Grok Bot desktop app.",
    "2. Add the name, title, job, durable role instructions, approval gates, and operating limits from this brief.",
    "3. Turn the reusable Skill recipe into a Skill only after the first task works by hand.",
    "4. Turn the Routine recipe into a Routine only after the Skill produces a dependable result.",
    "5. Connect only the services needed for this job and keep approval turned on for consequential actions.",
    "6. Run the first task with sample material and review the result at the checkpoint.",
    "7. If you choose to share it, preview the public share page before another person adds a copy.",
    "",
    "## What Grok Bot sharing carries",
    "",
    "Grok Bot's public share flow can carry the Bot's identity, description, Skills, and Routines. Computer access, logins, and conversation history stay with the original account.",
    "",
    pack.platforms.grokBot.accountBoundary,
    "",
    "Keep credentials, private information, customer data, and internal links out of the Bot profile, Skills, and Routines before sharing.",
    "",
    "## Bot Passport summary",
    "",
    `- **Planned risk:** ${pack.controls.riskLevel}`,
    `- **Requested capabilities:** ${inlineMarkdownList(pack.controls.requestedCapabilities)}`,
    `- **Must ask first:** ${inlineMarkdownList(pack.controls.mustAsk)}`,
    `- **Prohibited:** ${inlineMarkdownList(pack.controls.prohibited)}`,
    `- **Stop and remove access:** ${pack.controls.shutdown}`,
    "",
    `Complete portable pack: https://botcabinet.com/downloads/portable-bot-packs/${pack.bot.slug}.md`,
    `Bot Cabinet record: ${pack.provenance.sourceUrl}`,
    "",
  ].join("\n");
}

export function portableBotPackFileName(pack: PortableBotPack) {
  return `${pack.bot.slug}.md`;
}
