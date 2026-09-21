import { describe, expect, it } from "vitest";

import { AGENT_WATCH_ITEMS } from "@/data/agent-watch";
import { AGENT_WATCH_RSS, buildAgentWatchRss } from "./agent-watch-feed";

describe("Agent Watch RSS", () => {
  it("publishes every dated note with stable links and honest limits", () => {
    const rss = buildAgentWatchRss();
    expect(rss).toBe(AGENT_WATCH_RSS);
    expect(rss).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(rss).toContain('href="https://botcabinet.com/watch/feed.xml"');
    expect(rss.match(/<item>/g)).toHaveLength(AGENT_WATCH_ITEMS.length);
    for (const item of AGENT_WATCH_ITEMS) {
      expect(rss).toContain(`https://botcabinet.com/watch/#${item.slug}`);
      expect(rss).toContain(`bot-cabinet:watch:${item.slug}:${item.observedOn}`);
    }
    expect(rss.match(/What remains unproven:/g)).toHaveLength(AGENT_WATCH_ITEMS.length);
  });

  it("escapes source-derived text instead of treating it as markup", () => {
    expect(AGENT_WATCH_RSS).toContain("Cabinet&apos;s documented response");
    expect(AGENT_WATCH_RSS).not.toContain("<script");
  });
});
