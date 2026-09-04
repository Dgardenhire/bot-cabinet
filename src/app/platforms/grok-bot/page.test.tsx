import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../../../data/starter-bots";
import GrokBotTemplatesPage from "./page";

describe("Grok Bot platform page", () => {
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
});
