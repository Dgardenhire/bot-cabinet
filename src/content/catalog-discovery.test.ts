import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PUBLIC_BOT_CATALOG } from "./public-manifest";
import {
  BOT_CABINET_ORIGIN,
  CATALOG_DISCOVERY_RELEASE,
  PUBLIC_CATALOG_RSS,
  PUBLIC_CATALOG_UPDATES,
  PUBLIC_LLMS_TEXT,
  buildCatalogRevision,
  buildCatalogRss,
  buildCatalogUpdates,
} from "./catalog-discovery";

describe("public catalog discovery files", () => {
  it("builds a deterministic, versioned updates feed from the public catalog", () => {
    const first = buildCatalogUpdates(PUBLIC_BOT_CATALOG);
    const second = buildCatalogUpdates(PUBLIC_BOT_CATALOG);

    expect(first).toEqual(second);
    expect(first).toEqual(PUBLIC_CATALOG_UPDATES);
    expect(first.schemaVersion).toBe(1);
    expect(first.feedVersion).toBe(CATALOG_DISCOVERY_RELEASE.feedVersion);
    expect(first.releasedAt).toBe(CATALOG_DISCOVERY_RELEASE.releasedAt);
    expect(first.catalogVersion).toBe(PUBLIC_BOT_CATALOG.catalogVersion);
    expect(first.revision).toBe(buildCatalogRevision(PUBLIC_BOT_CATALOG));
    expect(first.revision).toMatch(/^[a-f0-9]{64}$/);
    expect(first.count).toBe(PUBLIC_BOT_CATALOG.count);
    expect(first.entries.map((entry) => entry.slug)).toEqual(
      PUBLIC_BOT_CATALOG.bots.map((bot) => bot.slug),
    );
    expect(first.entries.every((entry) => entry.id.endsWith(`@${entry.version}`))).toBe(
      true,
    );
    expect(
      first.entries.every((entry) =>
        entry.links.detail.startsWith(`${BOT_CABINET_ORIGIN}/bots/`),
      ),
    ).toBe(true);
    expect(first.entries[0].platforms.hermes.packageStatus).toBe(
      "files-and-archive-checked",
    );
    expect(first.entries[0].platforms.grok?.testStatus).toBe(
      "adaptation-prepared-not-tested",
    );
    expect(first.entries[0].platforms.portable.markdown).toBe(
      `${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/scout.md`,
    );
    expect(first.entries[0].platforms.portable.json).toBe(
      `${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/scout.json`,
    );
  });

  it("changes the revision when published profile content changes without a version bump", () => {
    const changedCatalog = {
      ...PUBLIC_BOT_CATALOG,
      bots: PUBLIC_BOT_CATALOG.bots.map((bot, index) =>
        index === 0
          ? {
              ...bot,
              identity: {
                ...bot.identity,
                summary: `${bot.identity.summary} Updated public copy.`,
              },
            }
          : bot,
      ),
    };

    expect(changedCatalog.catalogVersion).toBe(
      PUBLIC_BOT_CATALOG.catalogVersion,
    );
    expect(buildCatalogRevision(changedCatalog)).not.toBe(
      buildCatalogRevision(PUBLIC_BOT_CATALOG),
    );
    expect(buildCatalogUpdates(changedCatalog).revision).not.toBe(
      PUBLIC_CATALOG_UPDATES.revision,
    );
  });

  it("does not invent popularity, review, or runtime evidence", () => {
    expect(JSON.stringify(PUBLIC_CATALOG_UPDATES)).not.toMatch(
      /"(?:copies|installs|popularity|rating|reviews|tested|verified|reproduced|runtimeEvidence)"/i,
    );
  });

  it("emits a valid RSS 2.0 document with escaped content and stable dates", () => {
    expect(PUBLIC_CATALOG_RSS).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(PUBLIC_CATALOG_RSS).toContain(
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    );
    expect(PUBLIC_CATALOG_RSS).toContain(
      `<atom:link href="${BOT_CABINET_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`,
    );
    expect(PUBLIC_CATALOG_RSS.match(/<item>/g)).toHaveLength(
      PUBLIC_BOT_CATALOG.count,
    );
    expect(PUBLIC_CATALOG_RSS).toContain(
      `<lastBuildDate>${new Date(CATALOG_DISCOVERY_RELEASE.releasedAt).toUTCString()}</lastBuildDate>`,
    );

    const escapedCatalog = {
      ...PUBLIC_BOT_CATALOG,
      count: 1,
      bots: [
        {
          ...PUBLIC_BOT_CATALOG.bots[0],
          identity: {
            ...PUBLIC_BOT_CATALOG.bots[0].identity,
            name: "Research & Planning",
            summary: "Compare <options> before deciding.",
          },
        },
      ],
    };
    const escapedRss = buildCatalogRss(escapedCatalog);

    expect(escapedRss).toContain("Research &amp; Planning");
    expect(escapedRss).toContain("Compare &lt;options&gt; before deciding.");
    expect(escapedRss).not.toContain("Compare <options>");
  });

  it("keeps llms.txt concise and points agents to public resources", () => {
    expect(PUBLIC_LLMS_TEXT).toContain("# Bot Cabinet");
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v1/bots.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v2/index.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v2/bots.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v2/portable-bot-pack.schema.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v1/updates.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/api/v1/bot-fit-test.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(`${BOT_CABINET_ORIGIN}/fit/`);
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/platforms/grok-bot/`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/scout.md`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/v2/scout.json`,
    );
    expect(PUBLIC_LLMS_TEXT).toContain(
      `${BOT_CABINET_ORIGIN}/downloads/portable-bot-packs/v2/scout.md`,
    );
    expect(PUBLIC_LLMS_TEXT).toMatch(/Legacy V1 Bot catalog/);
    for (const kind of ["Assignment", "Skill", "Routine", "Bot", "Crew"]) {
      expect(PUBLIC_LLMS_TEXT).toContain(kind);
    }
    expect(PUBLIC_LLMS_TEXT).toContain(`${BOT_CABINET_ORIGIN}/feed.xml`);
    expect(PUBLIC_LLMS_TEXT.length).toBeLessThan(5_000);
    for (const bot of PUBLIC_BOT_CATALOG.bots) {
      expect(PUBLIC_LLMS_TEXT).toContain(bot.identity.name);
      expect(PUBLIC_LLMS_TEXT).toContain(
        `${BOT_CABINET_ORIGIN}${bot.links.detailUrl}`,
      );
    }
  });

  it("matches the committed public discovery files", async () => {
    const projectRoot = process.cwd();
    const [updates, rss, llms] = await Promise.all([
      readFile(path.join(projectRoot, "public/api/v1/updates.json"), "utf8"),
      readFile(path.join(projectRoot, "public/feed.xml"), "utf8"),
      readFile(path.join(projectRoot, "public/llms.txt"), "utf8"),
    ]);

    expect(JSON.parse(updates)).toEqual(PUBLIC_CATALOG_UPDATES);
    expect(rss).toBe(PUBLIC_CATALOG_RSS);
    expect(llms).toBe(PUBLIC_LLMS_TEXT);
  });
});
