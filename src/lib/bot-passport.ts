import type { StarterBot } from "../data/starter-bots";
import type { PortableBotPackV2 } from "./portable-bot-pack-v2";
import type { BotBlueprint } from "./workshop";

export type BotPassport = {
  version: 1 | 2;
  botName: string;
  role: string;
  riskLevel: "Low" | "Moderate" | "Elevated";
  reads: string[];
  creates: string[];
  requestedCapabilities: string[];
  mayDoWithoutApproval: string[];
  mustAsk: string[];
  prohibited: string[];
  controlNotes: string[];
  firstTest: string;
  shutdown: string;
};

function items(value: string): string[] {
  return value
    .split(/\n|;/)
    .map((item) => item.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function safeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "custom-bot";
}

function riskLevel(capabilities: string[], approvals: string[]): BotPassport["riskLevel"] {
  const text = [...capabilities, ...approvals].join(" ").toLowerCase();
  if (/payment|card|money|publish|send|phone|deploy|delete|credential|account/.test(text)) return "Elevated";
  if (/web|file|folder|document|email|calendar|repository|code/.test(text)) return "Moderate";
  return "Low";
}

function classifyBoundaries(boundaries: string[]) {
  const mustAsk: string[] = [];
  const prohibited: string[] = [];
  for (const boundary of boundaries) {
    if (/\b(?:ask|approv|confirm|permission|must remain with a person|requires? a person|a person (?:selects?|makes?|decides?|defines?|sets?|evaluates?|limits?))\w*/i.test(boundary)) {
      mustAsk.push(boundary);
    } else if (/^do not (?:publish or send|send or publish)[.!]?$/i.test(boundary)) {
      mustAsk.push("Send or publish work");
    } else if (/\b(?:do not|does not|never|prohibit|must not|may not)\b/i.test(boundary)) {
      prohibited.push(boundary);
    } else {
      mustAsk.push(boundary);
    }
  }
  if (!mustAsk.length) mustAsk.push("Change files, contact people, spend money, publish, or use an outside account");
  return { mustAsk, prohibited };
}

export function starterBotToPassport(bot: StarterBot): BotPassport {
  const requestedCapabilities = items(bot.workshopDraft.toolsIntegrations);
  const classified = classifyBoundaries(bot.boundaries);
  const mustAsk = classified.mustAsk;
  const prohibited = [...classified.prohibited, ...items(bot.workshopDraft.prohibitedUncertainty ?? "")];

  return {
    version: 1,
    botName: bot.name,
    role: bot.title,
    riskLevel: riskLevel(requestedCapabilities, mustAsk),
    reads: bot.setup,
    creates: bot.produces,
    requestedCapabilities,
    mayDoWithoutApproval: [
      "Analyze material supplied in its conversation",
      "Draft the listed deliverables for a person to review",
      "Identify missing information and ask questions",
    ],
    mustAsk,
    prohibited: prohibited.length
      ? prohibited
      : ["Do not send, publish, purchase, delete, deploy, or change an outside account unless a person explicitly approves it."],
    controlNotes: [
      "The SOUL.md instructions guide the Bot's behavior; they are not a technical sandbox.",
      "Hermes approvals and each outside service's own permissions provide stronger controls where configured.",
      "Use provider-enforced spending, recipient, and time limits for any financial or communications account.",
    ],
    firstTest: bot.workshopDraft.firstRunTest,
    shutdown: "Disable its schedule, remove outside-service connections, and revoke or rotate any dedicated credentials.",
  };
}

export function portableBotPackV2ToPassport(
  pack: PortableBotPackV2,
): BotPassport {
  return {
    version: 2,
    botName: pack.identity.name,
    role: pack.identity.title,
    riskLevel: pack.controls.riskLevel,
    reads: [...pack.job.inputs],
    creates: [...pack.job.outputs],
    requestedCapabilities: [...pack.controls.requestedCapabilities],
    mayDoWithoutApproval: [...pack.controls.allowedWithoutApproval],
    mustAsk: [...pack.controls.requiresApproval],
    prohibited: [...pack.controls.prohibited],
    controlNotes: [...pack.controls.operatingLimits],
    firstTest: pack.job.firstMission,
    shutdown: pack.controls.shutdown,
  };
}

export function blueprintToBotPassport(blueprint: BotBlueprint): BotPassport {
  const classified = classifyBoundaries(blueprint.approvals);
  const prohibited = [...classified.prohibited, ...items(blueprint.prohibitedUncertainty)];
  const mustAsk = classified.mustAsk;

  return {
    version: 1,
    botName: blueprint.profile.name,
    role: blueprint.profile.title,
    riskLevel: riskLevel(blueprint.tools, mustAsk),
    reads: blueprint.inputs.length ? blueprint.inputs : ["Material supplied in the Bot conversation"],
    creates: blueprint.outputs.length ? blueprint.outputs : ["A draft result for review"],
    requestedCapabilities: blueprint.tools.length ? blueprint.tools : ["Conversation only"],
    mayDoWithoutApproval: [
      "Analyze approved material",
      "Draft the planned deliverables",
      "Ask questions and identify uncertainty",
    ],
    mustAsk,
    prohibited: prohibited.length
      ? prohibited
      : ["Do not send, publish, purchase, delete, deploy, or change an outside account unless a person explicitly approves it."],
    controlNotes: [
      "Role instructions guide behavior; they do not create a technical sandbox.",
      "Configure Hermes approvals and outside-service permissions before granting access.",
      "For money or communications, use dedicated accounts with provider-enforced limits whenever possible.",
    ],
    firstTest: blueprint.firstRunTest,
    shutdown: "Disable any routine, remove connections, and revoke or rotate dedicated credentials.",
  };
}

function markdownList(values: string[]) {
  return values.map((value) => `- ${value}`).join("\n");
}

export function botPassportToMarkdown(passport: BotPassport) {
  return [
    `# ${passport.botName} — Bot Passport`,
    "",
    `**Role:** ${passport.role}`,
    `**Risk level:** ${passport.riskLevel}`,
    `**Passport version:** ${passport.version}`,
    "",
    "## What it may read",
    "",
    markdownList(passport.reads),
    "",
    "## What it may create",
    "",
    markdownList(passport.creates),
    "",
    "## Requested capabilities and connections",
    "",
    markdownList(passport.requestedCapabilities),
    "",
    "## What it may do without approval",
    "",
    markdownList(passport.mayDoWithoutApproval),
    "",
    "## What requires approval",
    "",
    markdownList(passport.mustAsk),
    "",
    "## Prohibited actions",
    "",
    markdownList(passport.prohibited),
    "",
    "## How these controls work",
    "",
    markdownList(passport.controlNotes),
    "",
    "## First test",
    "",
    passport.firstTest || "Run a small test with sample material and inspect the result.",
    "",
    "## Stop and remove access",
    "",
    passport.shutdown,
    "",
    "Review this Passport whenever the Bot's job, tools, connections, schedule, or authority changes.",
    "",
  ].join("\n");
}

export function botPassportFileName(passport: BotPassport) {
  return `${safeSlug(passport.botName)}-bot-passport.md`;
}
