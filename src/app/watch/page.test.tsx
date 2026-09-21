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

  it("renders the open-ended boundary and honest unfinished status", () => {
    const html = renderToStaticMarkup(<AgentWatchPage />);
    expect(html).toContain("Named platforms are examples—not the boundary");
    expect(html).toContain("The Morning Newspaper turns agent work into a finished ritual");
    expect(html).toContain("Personal agents are splitting into different jobs");
    expect(html).toContain("No duplicate Bot was added");
    expect(html).toContain("https://ollie.ai/");
    expect(html).toContain("https://wajo.ai/");
    expect(html).toContain("https://www.town.com/docs/getting-started");
    expect(html).toContain("A return visit is not the same as repeat usefulness");
    expect(html).toContain("A bounce can still contain a useful action");
    expect(html).toContain("custom events from the calculation");
    expect(html).toContain("https://vercel.com/docs/analytics#bounce-rate");
    expect(html).toContain('href="/workbench"');
    expect(html).toContain("second and third real Bot runs");
    expect(html).toContain("browser-private Three-Run Trial");
    expect(html).toContain("supervision, cost range and interruption recovery");
    expect(html).toContain('href="/start"');
    expect(html).toContain("Native X search is not connected");
    expect(html).toContain("Reusable procedures are becoming portable Agent Skills");
    expect(html).toContain("rankings measure installations");
    expect(html).toContain("does not certify another host");
    expect(html).toContain("https://agentskills.io/specification");
    expect(html).toContain("not yet installed on the cloud Keeper");
    expect(html).toContain("Prepared locally · not deployed");
    expect(html).toContain('href="/watch/feed.xml"');
    expect(html).toContain("Subscribe to Agent Watch RSS");
    expect(html).toContain("Checking this browser for new Agent Watch notes");
    expect(metadata.alternates).toBeTruthy();
    expect(html).toContain("https://gemini.google/overview/agent/spark/");
    expect(sitemap().some(entry => entry.url === "https://botcabinet.com/watch/")).toBe(true);
  });
});
