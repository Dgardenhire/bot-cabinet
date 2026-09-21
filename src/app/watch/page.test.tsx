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

  it("renders useful public guidance without exposing internal operations or analytics", () => {
    const html = renderToStaticMarkup(<AgentWatchPage />);
    expect(html).toContain("New tools and useful ideas");
    expect(html).toContain("Find the signal");
    expect(html).toContain("Maker’s claim");
    expect(html).toContain("Try this");
    expect(html).toContain("The Morning Newspaper turns agent work into a finished ritual");
    expect(html).toContain("New personal agents are choosing different kinds of work");
    expect(html).toContain("Ollie is presented as an organizer for families");
    expect(html).toContain("Wajo&#x27;s Fo is presented as an agent for phone calls");
    expect(html).toContain("https://ollie.ai/");
    expect(html).toContain("https://wajo.ai/");
    expect(html).toContain("https://www.town.com/docs/getting-started");
    expect(html).not.toContain("bounce");
    expect(html).not.toContain("Vercel");
    expect(html).not.toContain("Three-Run Trial");
    expect(html).not.toContain("cloud Keeper");
    expect(html).not.toContain("X search is not connected");
    expect(html).not.toContain("live feed");
    expect(html).not.toContain("RSS");
    expect(html).not.toContain("all three");
    expect(html).toContain("Agent Skills can carry instructions between services");
    expect(html).toContain("rankings count installs");
    expect(html).toContain("does not prove that the same file works somewhere else");
    expect(html).toContain("https://agentskills.io/specification");
    expect(html).toContain("Guide available");
    expect(html).toContain("Testing in progress");
    expect(metadata.alternates?.types).toBeUndefined();
    expect(html).toContain("https://gemini.google/overview/agent/spark/");
    expect(sitemap().some(entry => entry.url === "https://botcabinet.com/watch/")).toBe(true);
  });
});
