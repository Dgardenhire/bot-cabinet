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
    expect(html).toContain("Sources we check (12)");
    expect(html).toContain("Grok Bot Marketplace");
    expect(html).toContain("OpenBot plugins");
    expect(html).toContain("Hermes Agent releases");
    expect(html).toContain("Instinct");
    expect(html).toContain("Fresh listings");
    expect(html).toContain("What may be worth trying");
    expect(html).toContain("Import Bot");
    expect(html).toContain("tinkabot");
    expect(html).toContain("Official Grok Bot Marketplace listing");
    expect(html).toContain("Creator");
    expect(html).toContain("Access and outside actions");
    expect(html).toContain("Closest current match");
    expect(html).toContain("What Bot Cabinet will do");
    expect(html).toContain("Improve an existing Bot");
    expect(html).toContain("Test an adaptation");
    expect(html).toContain("Inspected");
    expect(html).toContain("Show 10 more reviewed notes");
    expect(html).toContain("Cabinet Keeper is not yet supplying continuous updates");
    expect(html).not.toContain("bounce");
    expect(html).not.toContain("Vercel");
    expect(html).not.toContain("Three-Run Trial");
    expect(html).not.toContain("X search is not connected");
    expect(html).not.toContain("RSS");
    expect(html).not.toContain("all three");
    expect(html).toContain("Guide available");
    expect(metadata.alternates?.types).toBeUndefined();
    expect(html).toContain("https://gemini.google/overview/agent/spark/");
    expect(sitemap().some(entry => entry.url === "https://botcabinet.com/watch/")).toBe(true);
  });
});
