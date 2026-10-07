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
    expect(html).toContain("Directories, guides and releases");
    expect(html).toContain("Browse the sources (23)");
    expect(html).toContain("Grok Bot Marketplace");
    expect(html).toContain("OpenBot plugins");
    expect(html).toContain("Hermes Agent releases");
    expect(html).toContain("OpenBot releases");
    expect(html).toContain("GitHub agent repositories");
    expect(html).toContain("GitLab agent repositories");
    expect(html).toContain("Instinct");
    expect(html).toContain("Pick a first task");
    expect(html).toContain("Try Daily Newspaper");
    expect(html).toContain("Fix a bad AI answer");
    expect(html).toContain("/guides/fix-one-bad-ai-result");
    expect(html).toContain('data-funnel-event="watch_tested_example_opened"');
    expect(html).toContain("/use-cases/personal-morning-newspaper");
    expect(html).toContain("Current listings");
    expect(html).toContain("Why it stands out");
    expect(html).toContain("Source reviewed");
    expect(html).toContain("Bots for specific jobs, with source links and test status");
    expect(html).toContain("Import Bot");
    expect(html).toContain("Diagnose My Agent&#x27;s Mistake");
    expect(html).toContain("Muse at Work");
    expect(html).toContain("Try the step-by-step guide");
    expect(html).toContain(
      "/downloads/starter-bots/v2/ops/skills/diagnose-ai-result/SKILL.md",
    );
    expect(html).toContain("has not yet been task-tested");
    expect(html).toContain("Nasiko");
    expect(html).toContain("Agent infrastructure");
    expect(html).toContain("Official Grok Bot Marketplace listing");
    expect(html).toContain("Creator");
    expect(html).toContain("Accounts, tools and actions");
    expect(html).toContain("Similar Cabinet Bot");
    expect(html).toContain("Bot Cabinet plans");
    expect(html).toContain("Improve an existing Bot");
    expect(html).toContain("Test an adaptation");
    expect(html).toContain("Listing reviewed");
    expect(html).toMatch(/Show \d+ more reviewed notes/);
    expect(html).toContain("Current listings come from fourteen sources");
    expect(html).not.toContain("Cabinet Keeper is not yet supplying");
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
