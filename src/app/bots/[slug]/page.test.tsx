import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StarterBotPage from "./page";

describe("starter Bot detail", () => {
  it("connects the primary download area to the guided workbench", async () => {
    const page = await StarterBotPage({ params: Promise.resolve({ slug: "scout" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('href="#bot-workbench"');
    expect(html).toContain('data-funnel-event="bot_workbench_open"');
    expect(html).toContain('data-funnel-surface="bot_detail"');
    expect(html).toContain('data-funnel-destination="scout"');
    expect(html).toContain("After downloading: continue setup and test Scout");
    expect(html).toContain('id="bot-workbench"');
    expect(html).toContain("Job contract");
    expect(html).toContain("Source of truth");
    expect(html).toContain("Needs approval for");
    expect(html).toContain("Run the named first test");
    expect(html).toContain("Test one failure");
    expect(html).toContain("Repeat before automating");
  });

  it("publishes the Daily Newspaper import and bounded runtime evidence", async () => {
    const page = await StarterBotPage({ params: Promise.resolve({ slug: "daily-newspaper" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Hermes Agent 0.21.4");
    expect(html).toContain("September 23, 2026");
    expect(html).toContain("one run, not evidence of general reliability");
    expect(html).toContain('href="/proof-room/daily-newspaper/runtime-summary.md"');
    expect(html).toContain("Bounded task passed");
    expect(html).not.toContain("Role-specific output testing remains pending");
  });
});
