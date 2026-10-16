import type { MetadataRoute } from "next";

import { GUIDES } from "@/data/guides";
import { REGISTRY_ENTRIES } from "@/data/registry";
import { STARTER_BOTS } from "@/data/starter-bots";
import { BOT_USE_CASES } from "@/data/use-cases";
import { CREW_KITS } from "@/data/crew-kits";
import { PROOF_ROOM_DEMOS } from "@/data/proof-room";
import { SPECIALISTS, CREW_PLANS } from "@/data/specialist-collection";

const baseUrl = "https://botcabinet.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/fit",
    "/start",
    "/start/hermes",
    "/hermes",
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

  const routes = [
    ...staticRoutes,
    ...STARTER_BOTS.map((bot) => `/bots/${bot.slug}`),
    ...SPECIALISTS.map((bot) => `/bots/${bot.slug}`),
    ...BOT_USE_CASES.map((useCase) => `/use-cases/${useCase.slug}`),
    ...CREW_KITS.map((kit) => `/crew-kits/${kit.slug}`),
    ...CREW_PLANS.map((kit) => `/crew-kits/${kit.slug}`),
    ...PROOF_ROOM_DEMOS.map((demo) => `/proof/${demo.slug}`),
    ...REGISTRY_ENTRIES.map((entry) => `/community/${entry.slug}`),
    ...GUIDES.map((guide) => `/guides/${guide.slug}`),
  ];
  const updatedRoutes = new Set([...SPECIALISTS.map(bot => `/bots/${bot.slug}`), ...CREW_PLANS.map(crew => `/crew-kits/${crew.slug}`), "/bots", "/crew-kits"]);
  const jobReleaseRoutes = new Set(["", "/start", "/use-cases", ...BOT_USE_CASES.filter(job => job.sample).map(job => `/use-cases/${job.slug}`)]);
  function modifiedOn(route: string) {
    if (route === "/hermes") return "2026-10-16";
    if (jobReleaseRoutes.has(route)) return "2026-10-15";
    if (updatedRoutes.has(route)) return "2026-10-06";
    if (["/start/dots", "/compare", "/watch"].includes(route)) return "2026-09-29";
    return "2026-09-03";
  }

  return routes.map((route) => ({
    url: `${baseUrl}${route}/`.replace(`${baseUrl}//`, `${baseUrl}/`),
    lastModified: new Date(modifiedOn(route)),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
