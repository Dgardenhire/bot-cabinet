import type { MetadataRoute } from "next";

import { GUIDES } from "@/data/guides";
import { REGISTRY_ENTRIES } from "@/data/registry";
import { STARTER_BOTS } from "@/data/starter-bots";
import { BOT_USE_CASES } from "@/data/use-cases";
import { CREW_KITS } from "@/data/crew-kits";
import { PROOF_ROOM_DEMOS } from "@/data/proof-room";
import { SPECIALISTS, CREW_PLANS } from "@/data/specialist-collection";
import {
  botDates,
  specialistDates,
  startPageDate,
  staticRouteDate,
  useCaseDates,
} from "@/data/content-dates";

const baseUrl = "https://botcabinet.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/fit",
    "/start",
    "/start/hermes",
    "/hermes",
    "/hermes/manual",
    "/start/grok",
    "/start/dots",
    "/compare",
    "/bots",
    "/workbench",
    "/workshop",
    "/portraits",
    "/use-cases",
    "/starter-pack",
    "/crew-kits",
    "/proof",
    "/watch",
    "/platforms/grok-bot",
    "/community",
    "/guides",
    "/trust",
    "/contribute",
    "/about",
  ];

  const dated = (route: string, date?: string) => ({ route, date });
  const routes = [
    ...staticRoutes.map((route) => dated(route, staticRouteDate(route))),
    ...STARTER_BOTS.map((bot) => dated(`/bots/${bot.slug}`, botDates(bot.slug).updatedAt)),
    ...SPECIALISTS.map((bot) => dated(`/bots/${bot.slug}`, specialistDates(bot.slug).updatedAt)),
    ...STARTER_BOTS.map((bot) => dated(`/start/chatgpt/${bot.slug}`, startPageDate("chatgpt", bot.slug))),
    ...STARTER_BOTS.map((bot) => dated(`/start/grok/${bot.slug}`, startPageDate("grok", bot.slug))),
    ...BOT_USE_CASES.map((useCase) => dated(`/use-cases/${useCase.slug}`, useCaseDates(useCase.slug).updatedAt)),
    // Not dated in content-dates yet: crew kits, crew plans, test records and community projects.
    ...CREW_KITS.map((kit) => dated(`/crew-kits/${kit.slug}`)),
    ...CREW_PLANS.map((kit) => dated(`/crew-kits/${kit.slug}`)),
    ...PROOF_ROOM_DEMOS.map((demo) => dated(`/proof/${demo.slug}`)),
    ...REGISTRY_ENTRIES.map((entry) => dated(`/community/${entry.slug}`)),
    ...GUIDES.map((guide) => dated(`/guides/${guide.slug}`, guide.updated)),
  ];

  return routes.map(({ route, date }) => ({
    url: `${baseUrl}${route}/`.replace(`${baseUrl}//`, `${baseUrl}/`),
    ...(date ? { lastModified: new Date(date) } : {}),
  }));
}
