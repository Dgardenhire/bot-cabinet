import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ComparePage, { metadata } from "./page";
import { agents } from "./agents";
import { AgentComparison } from "./agent-comparison";
import StartPage from "../start/page";
import sitemap from "../sitemap";

describe("agent comparison", () => {
  it("is discoverable from Start and the sitemap", () => {
    expect(renderToStaticMarkup(<StartPage />)).toContain('href="/compare"');
    expect(sitemap()).toContainEqual(expect.objectContaining({
      url: "https://botcabinet.com/compare/",
      lastModified: new Date("2026-09-29"),
    }));
  });

  it("offers a job-first overview and sourced, qualified details", () => {
    const html = renderToStaticMarkup(<ComparePage />);

    expect(metadata).toHaveProperty("title");
    for (const name of ["ChatGPT Dots", "Grok Bot", "Muse", "Instinct", "Gemini Spark", "Poke", "OpenClaw", "Hermes Agent"]) {
      expect(html).toContain(name);
    }
    expect(html).not.toContain('class="compare-pick-grid"');
    expect(html).not.toContain('class="compare-flow"');
    expect(html).not.toContain('class="compare-choice"');
    expect(html).toContain('id="comparison-details" hidden=""');
    expect(html).toContain("Pick any three of the eight apps");
    expect(html).toContain("Find a Bot for your task");
    expect(html).toContain("Bot Cabinet has not tested all eight products");
    expect(html).toContain("https://x.ai/bot/guides");
    expect(html).toContain("every.to/vibe-check");
  });

  it("limits the visible comparison to three apps and keeps access details closed", () => {
    const html = renderToStaticMarkup(<ComparePage />);
    expect(html.match(/<select /g)).toHaveLength(3);
    expect(html.match(/<option /g)).toHaveLength(24);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="comparison-details"');
    expect(html).not.toContain("compare-table-section");
  });

  it("preserves the cautions, source, and real guide links for every selectable app", () => {
    for (const agent of agents) {
      const others = agents.filter((other) => other.name !== agent.name).slice(0, 2);
      const html = renderToStaticMarkup(<AgentComparison agents={agents} initialSelection={[agent.name, ...others.map((other) => other.name)]} />);
      expect(html).toContain(agent.sourceUrl.replaceAll("&", "&amp;"));
      expect(html).toContain(agent.caution.replaceAll("&", "&amp;"));
      if (agent.path.startsWith("/")) expect(html).toContain(`href="${agent.path}"`);
    }
  });
});
