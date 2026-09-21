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
    expect(html).toContain("Useful changes and ideas");
    expect(html).toContain("New and noteworthy Bots");
    expect(html).toContain("Unstick Me Bot");
    expect(html).toContain("Bill Import Bot");
    expect(html).toContain("Stuck Signal Bot");
    expect(html).toContain("Canonizer Bot");
    expect(html).toContain("About Me Bot");
    expect(html).toContain("Scouty Bot");
    expect(html).toContain("Accounts and access");
    expect(html).toContain("Creator");
    expect(html).toContain("Outside the chat");
    expect(html).toContain("Closest Cabinet match");
    expect(html).toContain("Cabinet decision");
    expect(html).toContain("Add a new Bot");
    expect(html).toContain("Test an adaptation");
    expect(html).toContain("Improve an existing Bot");
    expect(html).toContain("Write a guide");
    expect(html).toContain("Inspected");
    expect(html).toContain("Yanqing Cheng");
    expect(html).toContain("Nick Roman");
    expect(html).toContain("href=\"/bots/reentry\"");
    expect(html).toContain("href=\"/bots/scout\"");
    expect(html).toContain("https://x.com/YanqingCheng/status/2099206038368977179");
    expect(html).toContain("https://x.ai/bot/A3pcjyO0dAkvRGxD4VGeH");
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
