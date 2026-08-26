import type { MetadataRoute } from "next";

import { GUIDES } from "@/data/guides";
import { REGISTRY_ENTRIES } from "@/data/registry";
import { STARTER_BOTS } from "@/data/starter-bots";
import { BOT_USE_CASES } from "@/data/use-cases";

const baseUrl = "https://botcabinet.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/bots",
    "/workshop",
    "/use-cases",
    "/community",
    "/guides",
    "/trust",
    "/contribute",
    "/about",
  ];

  const routes = [
    ...staticRoutes,
    ...STARTER_BOTS.map((bot) => `/bots/${bot.slug}`),
    ...BOT_USE_CASES.map((useCase) => `/use-cases/${useCase.slug}`),
    ...REGISTRY_ENTRIES.map((entry) => `/community/${entry.slug}`),
    ...GUIDES.map((guide) => `/guides/${guide.slug}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}/`.replace(`${baseUrl}//`, `${baseUrl}/`),
    lastModified: new Date("2026-08-26"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
