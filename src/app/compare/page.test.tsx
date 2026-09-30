import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ComparePage, { metadata } from "./page";
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
    expect(html).toContain("Four ways in");
    expect(html).toContain("Give it a job");
    expect(html).toContain("not eight products we personally tested");
    expect(html).toContain("https://x.ai/bot/guides");
    expect(html).toContain("every.to/vibe-check");
  });
});
