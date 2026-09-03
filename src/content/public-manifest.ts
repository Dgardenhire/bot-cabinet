import { BOT_DEFINITIONS } from "./bot-definitions";

import type { BotDefinitionV1 } from "./schema";

export function buildPublicBotCatalog(definitions: readonly BotDefinitionV1[]) {
  const bots = definitions.filter((bot) => bot.lifecycle === "public");
  return {
    schemaVersion: 1 as const,
    catalogVersion: "1.1.0",
    count: bots.length,
    bots,
  };
}

export const PUBLIC_BOT_CATALOG = buildPublicBotCatalog(BOT_DEFINITIONS);
