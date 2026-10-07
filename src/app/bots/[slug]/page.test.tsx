import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StarterBotPage from "./page";

describe("starter Bot detail", () => {
  it("connects platform choice and profile download to the guided workbench", async () => {
    const page = await StarterBotPage({ params: Promise.resolve({ slug: "scout" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('href="#choose-platform"');
    expect(html).toContain('data-funnel-event="bot_choose_platform"');
    expect(html).toContain('data-funnel-event="bot_profile_download"');
    expect(html).toContain('data-funnel-surface="bot_detail"');
    expect(html).toContain('data-funnel-destination="scout"');
    expect(html).toContain("Keep track of your first Hermes run");
    expect(html).toContain('id="bot-workbench"');
    expect(html).toContain("Job and limits");
    expect(html).toContain("Information it relies on");
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
