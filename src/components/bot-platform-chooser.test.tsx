import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import { starterBotToPortablePackV2 } from "../lib/portable-bot-pack-v2";

import { BotPlatformChooser } from "./bot-platform-chooser";

describe("BotPlatformChooser", () => {
  it("separates the supported Hermes path from the prepared Grok adaptation", () => {
    const pack = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const html = renderToStaticMarkup(
      <BotPlatformChooser pack={pack} />,
    );

    expect(html).toContain("Use Scout on your platform");
    expect(html).toContain("Archive import passed");
    expect(html).toContain("Hermes Agent 0.21.0");
    expect(html).toContain("output testing remains pending");
    expect(html).toContain("Prepared · test pending");
    expect(html).toContain("Portable Bot Pack");
    expect(html).toContain('href="/downloads/starter-bots/v2/scout.tar.gz"');
    expect(html).toContain('href="/downloads/grok-bot-templates/v2/scout.md"');
    expect(html).toContain('href="/downloads/portable-bot-packs/v2/scout.md"');
    expect(html).toContain('href="/downloads/portable-bot-packs/v2/scout.json"');
    expect(html).not.toMatch(/compatible with Grok|install (?:in|for) Grok/i);
  });

  it("uses the versioned V2 artifacts when a V2 pack is supplied", () => {
    const pack = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const html = renderToStaticMarkup(
      <BotPlatformChooser
        pack={pack}
      />,
    );

    expect(html).toContain(
      'href="/downloads/starter-bots/v2/scout.tar.gz"',
    );
    expect(html).toContain(
      'href="/downloads/starter-bots/v2/scout.zip"',
    );
    expect(html).toContain(
      'href="/downloads/grok-bot-templates/v2/scout.md"',
    );
    expect(html).toContain(
      'href="/downloads/portable-bot-packs/v2/scout.md"',
    );
    expect(html).toContain(
      'href="/downloads/portable-bot-packs/v2/scout.json"',
    );
  });
});
