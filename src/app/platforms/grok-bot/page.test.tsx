import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../../../data/starter-bots";
import GrokBotTemplatesPage from "./page";

describe("Grok Bot platform page", () => {
  it("offers a dated external-template path without passing it off as a Cabinet runtime test", () => {
    const html = renderToStaticMarkup(<GrokBotTemplatesPage />);
    expect(html).toContain("September 20, 2026 · Not runtime-tested");
    expect(html).toContain('href="https://x.ai/bot/marketplace"');
    expect(html).toContain('href="https://x.ai/bot/guides/templates-for-grok-bot"');
    expect(html).toContain("manual build briefs, not native templates");
  });
  it("shows every prepared adaptation with the correct three-part download path", () => {
    const html = renderToStaticMarkup(<GrokBotTemplatesPage />);

    expect(html.match(/class="portable-template-card"/g)).toHaveLength(
      STARTER_BOTS.length,
    );
    expect(html.match(/Prepared · test pending/g)).toHaveLength(
      STARTER_BOTS.length,
    );
    expect(html).toContain("Prepared build brief · test pending");

    for (const bot of STARTER_BOTS) {
      expect(html).toContain(
        `href="/downloads/grok-bot-templates/v2/${bot.slug}.md"`,
      );
      expect(html).toContain(
        `href="/downloads/portable-bot-packs/${bot.slug}.md"`,
      );
      expect(html).toContain(`href="/bots/${bot.slug}"`);
    }
  });

  it("links to official guidance without claiming import or runtime compatibility", () => {
    const html = renderToStaticMarkup(<GrokBotTemplatesPage />);

    expect(html).toContain("https://docs.x.ai/grok-bot/bots");
    expect(html).toContain(
      "https://docs.x.ai/grok-bot/skills-routines-and-automations",
    );
    expect(html).toContain(
      "https://docs.x.ai/grok-bot/approvals-security-and-privacy",
    );
    expect(html).not.toMatch(
      /one-click|compatible with Grok|Grok (?:installer|import)|install (?:in|for) Grok/i,
    );
  });

  it("includes a dated operator guide and downloadable PDF", () => {
    const html = renderToStaticMarkup(<GrokBotTemplatesPage />);

    expect(html).toContain("Run Grok Bot without losing the plot");
    expect(html).toContain("Checked September 24, 2026");
    expect(html).toContain('href="/downloads/guides/grok-bot-operator-guide.pdf"');
    expect(html).toContain("Choose the right shape");
    expect(html).toContain("Protect accounts and files");
    expect(html).toContain("Use a group only when it helps");
    expect(html).toContain("Outcome · Sources · Constraints · Deliverable · Review point");
  });
});
