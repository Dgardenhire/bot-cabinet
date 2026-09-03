import {
  STARTER_BOTS,
  type StarterBot,
} from "../data/starter-bots";
import { CREW_KITS } from "../data/crew-kits";
import { BOT_USE_CASES } from "../data/use-cases";
import { starterBotToPortablePack } from "../lib/portable-bot-pack";
import {
  type BotDefinitionV1,
  validateBotDefinitions,
} from "./schema";

export { validateBotDefinitions } from "./schema";
export type { BotDefinitionV1 } from "./schema";

export function starterBotToDefinition(bot: StarterBot): BotDefinitionV1 {
  const portablePack = starterBotToPortablePack(bot);
  const passport = portablePack.controls;

  return {
    schemaVersion: 1,
    slug: bot.slug,
    version: "1.0.0",
    lifecycle: "public",
    identity: {
      name: bot.name,
      title: bot.title,
      category: bot.category,
      summary: bot.summary,
      audience: bot.whoItHelps,
      image: bot.image,
    },
    job: {
      outcome: bot.workshopDraft.jobOutcome,
      exampleRequests: [...bot.asks],
      inputs: [...bot.setup],
      outputs: [...bot.produces],
      cadence: bot.workshopDraft.cadenceTrigger,
      firstTest: bot.workshopDraft.firstRunTest,
    },
    instructions: {
      soul: bot.soul,
    },
    controls: {
      requestedCapabilities: [...passport.requestedCapabilities],
      allowedWithoutApproval: [...passport.mayDoWithoutApproval],
      requiresApproval: [...passport.mustAsk],
      prohibited: [...passport.prohibited],
    },
    platforms: {
      hermes: {
        minimumVersion: ">=0.20.0",
        artifactKind: "profile-distribution",
        packageStatus: portablePack.platforms.hermes.packageStatus,
        importStatus: portablePack.platforms.hermes.importStatus,
        detailUrl: `/bots/${bot.slug}/`,
        archiveUrl: `/downloads/starter-bots/${bot.slug}.tar.gz`,
        readableSourceUrl: `/downloads/starter-bots/${bot.slug}.zip`,
      },
      grok: {
        artifactKind: "adaptation-brief",
        testStatus: portablePack.platforms.grokBot.testStatus,
        adaptationUrl: `/downloads/grok-bot-templates/${bot.slug}.md`,
      },
      portable: {
        artifactKind: "portable-bot-pack",
        markdownUrl: `/downloads/portable-bot-packs/${bot.slug}.md`,
        jsonUrl: `/downloads/portable-bot-packs/${bot.slug}.json`,
      },
    },
    relationships: {
      worksWith: [...bot.worksWith],
      workflows: BOT_USE_CASES.filter((useCase) =>
        useCase.botSlugs.includes(bot.slug),
      ).map((useCase) => useCase.slug),
      crewKits: CREW_KITS.filter((kit) =>
        kit.roles.some((role) => role.botSlug === bot.slug),
      ).map((kit) => kit.slug),
      proofCases: [],
    },
    links: {
      detailUrl: `/bots/${bot.slug}/`,
      customizationUrl: `/workshop/?starter=${bot.slug}`,
    },
  };
}

export const BOT_DEFINITIONS: BotDefinitionV1[] = STARTER_BOTS.map(
  starterBotToDefinition,
);

const issues = validateBotDefinitions(BOT_DEFINITIONS);
if (issues.length) {
  throw new Error(`Invalid Bot definitions:\n${issues.join("\n")}`);
}
