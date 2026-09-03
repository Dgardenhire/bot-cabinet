import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BotPlatformChooser } from "./bot-platform-chooser";

describe("BotPlatformChooser", () => {
  it("separates the supported Hermes path from the prepared Grok adaptation", () => {
    const html = renderToStaticMarkup(
      <BotPlatformChooser botName="Scout" botSlug="scout" />,
    );

    expect(html).toContain("Use Scout on your platform");
    expect(html).toContain("Downloadable profile");
    expect(html).toContain("Prepared · test pending");
    expect(html).toContain("Portable Bot Pack");
    expect(html).toContain('href="/downloads/starter-bots/scout.tar.gz"');
    expect(html).toContain('href="/downloads/grok-bot-templates/scout.md"');
    expect(html).toContain('href="/downloads/portable-bot-packs/scout.md"');
    expect(html).toContain('href="/downloads/portable-bot-packs/scout.json"');
    expect(html).not.toMatch(/compatible with Grok|install (?:in|for) Grok/i);
  });
});
