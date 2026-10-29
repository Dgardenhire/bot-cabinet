import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StarterBotPage, { generateMetadata } from "./page";
import { SPECIALISTS } from "@/data/specialist-collection";
import { STARTER_BOTS } from "@/data/starter-bots";
import { REGISTRY_ENTRIES } from "@/data/registry";

const SUFFIX = " — Bot Cabinet";

async function metadataFor(slug: string) {
  return generateMetadata({ params: Promise.resolve({ slug }) });
}

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
    expect(html).toContain("Ask you before");
    expect(html).toContain("Run the named first test");
    expect(html).toContain("Test one failure");
    expect(html).toContain("Repeat before automating");
  });

  it("publishes the Daily Newspaper import and bounded runtime evidence", async () => {
    const page = await StarterBotPage({ params: Promise.resolve({ slug: "daily-newspaper" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Hermes Agent 0.21.4");
    expect(html).toContain("September 23, 2026");
    expect(html).toContain("one run, not general reliability");
    expect(html).toContain('href="/proof-room/daily-newspaper/runtime-summary.md"');
    expect(html).toContain("One task test passed");
    expect(html).not.toContain("Role-specific output testing remains pending");
  });

  it("keeps every starter and specialist title at 60 characters or fewer with the suffix", async () => {
    for (const bot of [...STARTER_BOTS, ...SPECIALISTS]) {
      const { title } = await metadataFor(bot.slug);
      expect(typeof title, bot.slug).toBe("string");
      const full = `${title as string}${SUFFIX}`;
      expect(full.length, full).toBeLessThanOrEqual(60);
    }
    expect((await metadataFor("editor")).title).toBe("Editor: AI plain-language editor template");
    expect((await metadataFor("ad-spend-review")).title).toBe("Ad Spend Review bot template");
  });

  it("keeps old moved pages out of search without pointing them at the home page", async () => {
    const entry = REGISTRY_ENTRIES[0];
    const metadata = await metadataFor(entry.slug);
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe(`/bots/${entry.slug}/`);
  });

  it("drops the Hermes collection wording from starter portrait alt text", async () => {
    const html = renderToStaticMarkup(await StarterBotPage({ params: Promise.resolve({ slug: "scout" }) }));
    expect(html).toContain('alt="Illustration for Scout in The Cabinet"');
    expect(html).not.toContain("Hermes Bot collection");
  });
});
