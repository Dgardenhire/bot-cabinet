import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import sitemap from "../app/sitemap";
import {
  BOT_DATES,
  SPECIALIST_DATES,
  STATIC_ROUTE_DATES,
  USE_CASE_DATES,
  botDates,
  startPageDate,
  staticRouteDate,
} from "./content-dates";
import { SPECIALISTS } from "./specialist-collection";
import { STARTER_BOTS } from "./starter-bots";
import { BOT_USE_CASES } from "./use-cases";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function expectSameKeys(table: Record<string, unknown>, slugs: string[]) {
  expect(Object.keys(table).sort()).toEqual([...slugs].sort());
}

describe("content dates", () => {
  it("has exactly one entry for every Bot, specialist and use case", () => {
    expectSameKeys(BOT_DATES, STARTER_BOTS.map((bot) => bot.slug));
    expectSameKeys(SPECIALIST_DATES, SPECIALISTS.map((bot) => bot.slug));
    expectSameKeys(USE_CASE_DATES, BOT_USE_CASES.map((useCase) => useCase.slug));
  });

  it("uses real calendar dates and never updates an item before it was added", () => {
    for (const table of [BOT_DATES, SPECIALIST_DATES, USE_CASE_DATES]) {
      for (const [slug, dates] of Object.entries(table)) {
        expect(dates.addedAt, slug).toMatch(ISO_DATE);
        expect(dates.updatedAt, slug).toMatch(ISO_DATE);
        expect(new Date(dates.addedAt).toISOString().slice(0, 10)).toBe(dates.addedAt);
        expect(new Date(dates.updatedAt).toISOString().slice(0, 10)).toBe(dates.updatedAt);
        expect(dates.updatedAt >= dates.addedAt, slug).toBe(true);
      }
    }
    for (const [route, date] of Object.entries(STATIC_ROUTE_DATES)) {
      expect(date, route).toMatch(ISO_DATE);
    }
  });

  it("looks dates up by exact key only", () => {
    expect(botDates("unstick-me")).toEqual({ addedAt: "2026-10-19", updatedAt: "2026-10-19" });
    expect(() => botDates("unstick")).toThrow(/no Bot entry/);
    expect(() => botDates("Unstick-Me")).toThrow(/no Bot entry/);
    expect(() => botDates("toString")).toThrow(/no Bot entry/);
    expect(() => staticRouteDate("/bots/")).toThrow(/no static route entry/);
  });

  it("is a committed table that never runs git", () => {
    const source = readFileSync(path.join(process.cwd(), "src/data/content-dates.ts"), "utf8");
    expect(source).not.toMatch(/child_process|execSync|execFile|spawn/);
  });
});

describe("sitemap dates", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

  it("lists the 42 Bot setup pages and leaves out /submit/", () => {
    const startPages = entries.filter((entry) =>
      /^https:\/\/botcabinet\.com\/start\/(chatgpt|grok)\/[a-z0-9-]+\/$/.test(entry.url),
    );
    expect(startPages).toHaveLength(STARTER_BOTS.length * 2);
    expect(STARTER_BOTS.length * 2).toBe(42);
    expect(byUrl.has("https://botcabinet.com/submit/")).toBe(false);
  });

  it("has no changefreq or priority and no duplicate URLs", () => {
    for (const entry of entries) {
      expect(entry).not.toHaveProperty("changeFrequency");
      expect(entry).not.toHaveProperty("priority");
    }
    expect(byUrl.size).toBe(entries.length);
  });

  it("dates each Bot, specialist, use case and static route from content-dates", () => {
    expect(byUrl.get("https://botcabinet.com/bots/unstick-me/")?.lastModified).toEqual(new Date("2026-10-19"));
    for (const bot of STARTER_BOTS) {
      expect(byUrl.get(`https://botcabinet.com/bots/${bot.slug}/`)?.lastModified).toEqual(
        new Date(BOT_DATES[bot.slug].updatedAt),
      );
      expect(byUrl.get(`https://botcabinet.com/start/chatgpt/${bot.slug}/`)?.lastModified).toEqual(
        new Date(startPageDate("chatgpt", bot.slug)),
      );
      expect(byUrl.get(`https://botcabinet.com/start/grok/${bot.slug}/`)?.lastModified).toEqual(
        new Date(startPageDate("grok", bot.slug)),
      );
    }
    for (const bot of SPECIALISTS) {
      expect(byUrl.get(`https://botcabinet.com/bots/${bot.slug}/`)?.lastModified).toEqual(
        new Date(SPECIALIST_DATES[bot.slug].updatedAt),
      );
    }
    for (const useCase of BOT_USE_CASES) {
      expect(byUrl.get(`https://botcabinet.com/use-cases/${useCase.slug}/`)?.lastModified).toEqual(
        new Date(USE_CASE_DATES[useCase.slug].updatedAt),
      );
    }
    for (const [route, date] of Object.entries(STATIC_ROUTE_DATES)) {
      expect(byUrl.get(`https://botcabinet.com${route}/`)?.lastModified, route).toEqual(new Date(date));
    }
  });
});
