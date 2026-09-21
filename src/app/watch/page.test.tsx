import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AGENT_WATCH_ITEMS } from "../../data/agent-watch";
import sitemap from "../sitemap";
import AgentWatchPage, { metadata } from "./page";

describe("Agent Watch", () => {
  it("keeps source evidence, interpretation, response and review dates explicit", () => {
    expect(AGENT_WATCH_ITEMS.length).toBeGreaterThanOrEqual(5);
    for (const item of AGENT_WATCH_ITEMS) {
      expect(item.sources.length).toBeGreaterThan(0);
      expect(item.observedOn).toMatch(/^2026-/);
      expect(item.reviewAgainBy).toMatch(/^2026-/);
      expect(item.limits.length).toBeGreaterThan(40);
    }
  });

  it("renders the live feed, clear evidence labels and honest unfinished status", () => {
    const html = renderToStaticMarkup(<AgentWatchPage />);
    expect(html).toContain("This page is the Agent Watch feed");
    expect(html).toContain("The Morning Newspaper turns agent work into a finished ritual");
    expect(html).toContain("Personal agents are splitting into different jobs");
    expect(html).toContain("did not add a duplicate Bot");
    expect(html).toContain("https://ollie.ai/");
    expect(html).toContain("https://wajo.ai/");
    expect(html).toContain("https://www.town.com/docs/getting-started");
    expect(html).toContain("A return visit is not the same as repeat usefulness");
    expect(html).toContain("A bounce can still contain a useful action");
    expect(html).toContain("be counted as a bounce");
    expect(html).toContain("https://vercel.com/docs/analytics#bounce-rate");
    expect(html).toContain('href="/workbench"');
    expect(html).toContain("compare three attempts at the same job");
    expect(html).toContain("private Three-Run Trial");
    expect(html).toContain("supervision, cost and whether the work recovered after an interruption");
    expect(html).toContain('href="/start"');
    expect(html).toContain("X search is not connected");
    expect(html).toContain("Agent Skills can carry instructions between services");
    expect(html).toContain("rankings count installs");
    expect(html).toContain("does not prove the file works with another service");
    expect(html).toContain("https://agentskills.io/specification");
    expect(html).toContain("not installed on the cloud Keeper");
    expect(html).not.toContain("Prepared locally · not deployed");
    expect(html).toContain("Added to Bot Cabinet");
    expect(html).toContain("Still being tested");
    expect(html).toContain('href="/watch/feed.xml"');
    expect(html).toContain("Follow by RSS");
    expect(html).toContain("Checking this browser for new Agent Watch notes");
    expect(metadata.alternates).toBeTruthy();
    expect(html).toContain("https://gemini.google/overview/agent/spark/");
    expect(sitemap().some(entry => entry.url === "https://botcabinet.com/watch/")).toBe(true);
  });
});
