import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "../data/starter-bots";
import { starterBotToPortablePackV2 } from "../lib/portable-bot-pack-v2";

import { BotPackV2Panel } from "./bot-pack-v2-panel";

describe("BotPackV2Panel", () => {
  it("shows the working recipe without claiming that it has been tested", () => {
    const pack = starterBotToPortablePackV2(STARTER_BOTS[0]);
    const html = renderToStaticMarkup(<BotPackV2Panel pack={pack} />);

    expect(html).toContain("Bot Pack 2.0");
    expect(html).toContain("First assignment");
    expect(html).toContain("Review checkpoint");
    expect(html).toContain("Reusable Skill");
    expect(html).toContain("Planned Routine");
    expect(html).toContain("Prepared · test pending");
    expect(html).toContain("Manual test required");
    expect(html).not.toMatch(/verified|runtime tested|ready to schedule/i);
  });
});
