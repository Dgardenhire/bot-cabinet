import { createHash } from "node:crypto";

import {
  PUBLIC_BOT_CATALOG,
  buildPublicBotCatalog,
} from "./public-manifest";
import { BOT_CABINET_ORIGIN } from "../lib/site-constants";

export { BOT_CABINET_ORIGIN };

export const CATALOG_DISCOVERY_RELEASE = {
  feedVersion: "1.1.0",
  releasedAt: "2026-09-03T00:00:00.000Z",
} as const;

type PublicBotCatalog = ReturnType<typeof buildPublicBotCatalog>;

function absoluteUrl(value: string) {
  return new URL(value, BOT_CABINET_ORIGIN).toString();
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
    .join(",")}}`;
}

/**
 * A content address for the complete public catalog, including its ordered Bot
 * list. Unlike catalogVersion, this changes whenever published catalog content
 * changes, even when a release version has not yet been bumped.
 */
export function buildCatalogRevision(catalog: PublicBotCatalog) {
  return createHash("sha256").update(canonicalJson(catalog)).digest("hex");
}

export function buildCatalogUpdates(catalog: PublicBotCatalog) {
  return {
    schemaVersion: 1 as const,
    feedVersion: CATALOG_DISCOVERY_RELEASE.feedVersion,
    releasedAt: CATALOG_DISCOVERY_RELEASE.releasedAt,
    catalogVersion: catalog.catalogVersion,
    revision: buildCatalogRevision(catalog),
    source: `${BOT_CABINET_ORIGIN}/api/v1/bots.json`,
    count: catalog.count,
    // The entry order is the public catalog's source-list order. It is part of
    // the revision so consumers can retain a stable presentation order.
    entries: catalog.bots.map((bot) => ({
      id: `bot:${bot.slug}@${bot.version}`,
      kind: "bot" as const,
      slug: bot.slug,
      version: bot.version,
      name: bot.identity.name,
      title: bot.identity.title,
      category: bot.identity.category,
      summary: bot.identity.summary,
      audience: bot.identity.audience,
      links: {
        detail: absoluteUrl(bot.links.detailUrl),
        customize: absoluteUrl(bot.links.customizationUrl),
      },
      platforms: {
        hermes: {
          minimumVersion: bot.platforms.hermes.minimumVersion,
          artifactKind: bot.platforms.hermes.artifactKind,
          packageStatus: bot.platforms.hermes.packageStatus,
          importStatus: bot.platforms.hermes.importStatus,
          profile: absoluteUrl(bot.platforms.hermes.archiveUrl),
          readableSource: absoluteUrl(
            bot.platforms.hermes.readableSourceUrl,
          ),
        },
        ...(bot.platforms.grok
          ? {
              grok: {
                artifactKind: bot.platforms.grok.artifactKind,
                testStatus: bot.platforms.grok.testStatus,
                adaptation: absoluteUrl(bot.platforms.grok.adaptationUrl),
              },
            }
          : {}),
        portable: {
          artifactKind: bot.platforms.portable.artifactKind,
          markdown: absoluteUrl(bot.platforms.portable.markdownUrl),
          json: absoluteUrl(bot.platforms.portable.jsonUrl),
        },
      },
    })),
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildCatalogRss(catalog: PublicBotCatalog) {
  const releaseDate = new Date(
    CATALOG_DISCOVERY_RELEASE.releasedAt,
  ).toUTCString();
  const items = catalog.bots.flatMap((bot) => [
    "    <item>",
    `      <title>${escapeXml(`${bot.identity.name} — ${bot.identity.title}`)}</title>`,
    `      <link>${escapeXml(absoluteUrl(bot.links.detailUrl))}</link>`,
    `      <guid isPermaLink="false">${escapeXml(`bot-cabinet:bot:${bot.slug}:${bot.version}`)}</guid>`,
    `      <description>${escapeXml(bot.identity.summary)}</description>`,
    `      <category>${escapeXml(bot.identity.category)}</category>`,
    `      <pubDate>${releaseDate}</pubDate>`,
    "    </item>",
  ]);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Bot Cabinet catalog</title>",
    `    <link>${BOT_CABINET_ORIGIN}/bots/</link>`,
    "    <description>Current public Bot Cabinet profiles and their plain-language job descriptions.</description>",
    "    <language>en-us</language>",
    `    <lastBuildDate>${releaseDate}</lastBuildDate>`,
    `    <atom:link href="${BOT_CABINET_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function buildLlmsText(catalog: PublicBotCatalog) {
  const botLinks = catalog.bots.map(
    (bot) =>
      `- [${bot.identity.name}: ${bot.identity.title}](${absoluteUrl(bot.links.detailUrl)})`,
  );

  return [
    "# Bot Cabinet",
    "",
    "> Choose a job, inspect a Bot profile, and download the files needed to use or adapt it.",
    "",
    "Bot Cabinet is an independent guide to practical Bots. Each public profile explains the job, inputs, outputs, requested access, approval limits, first test, and available platform files.",
    "",
    "## Machine-readable catalog",
    "",
    `- [Bot Pack 2.0 index](${BOT_CABINET_ORIGIN}/api/v2/index.json): Current V2 entry points.`,
    `- [Bot Pack 2.0 catalog](${BOT_CABINET_ORIGIN}/api/v2/bots.json): Current V2 definitions.`,
    `- [Bot Pack 2.0 schema](${BOT_CABINET_ORIGIN}/api/v2/portable-bot-pack.schema.json): V2 validation schema.`,
    `- [Bot Pack 2.0 example](${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/v2/scout.json): Scout V2 JSON.`,
    `- [Readable Bot Pack 2.0 example](${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/v2/scout.md): Scout V2 Markdown.`,
    `- [Legacy V1 Bot catalog](${BOT_CABINET_ORIGIN}/api/v1/bots.json): Retained for existing consumers.`,
    `- [Legacy V1 catalog updates](${BOT_CABINET_ORIGIN}/api/v1/updates.json): Earlier discovery feed.`,
    `- [Bot Fit Test contract](${BOT_CABINET_ORIGIN}/api/v1/bot-fit-test.json): Schema and CLI for choosing an Assignment, Skill, Routine, Bot, or Crew.`,
    `- [RSS feed](${BOT_CABINET_ORIGIN}/feed.xml): Public profile feed.`,
    `- [Legacy V1 Portable Bot Pack example](${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/scout.md): Earlier Scout pack.`,
    "",
    "## Useful starting points",
    "",
    `- [Bot Fit Test](${BOT_CABINET_ORIGIN}/fit/): Choose the smallest useful form for a job.`,
    `- [Start here](${BOT_CABINET_ORIGIN}/start/): Set up and test a first Bot.`,
    `- [Browse Bots](${BOT_CABINET_ORIGIN}/bots/): Search the public catalog by job.`,
    `- [Bot Lab](${BOT_CABINET_ORIGIN}/workshop/): Plan and customize a Bot.`,
    `- [Crew Kits](${BOT_CABINET_ORIGIN}/crew-kits/): Plan several Bots with separate jobs and handoffs.`,
    `- [Hermes and Grok Bot](${BOT_CABINET_ORIGIN}/platforms/grok-bot/): Compare the supported setup path for each platform.`,
    `- [Review process](${BOT_CABINET_ORIGIN}/trust/): Understand the labels and checks shown on the site.`,
    "",
    "## Current public Bots",
    "",
    ...botLinks,
    "",
  ].join("\n");
}

export const PUBLIC_CATALOG_UPDATES = buildCatalogUpdates(PUBLIC_BOT_CATALOG);
export const PUBLIC_CATALOG_RSS = buildCatalogRss(PUBLIC_BOT_CATALOG);
export const PUBLIC_LLMS_TEXT = buildLlmsText(PUBLIC_BOT_CATALOG);
