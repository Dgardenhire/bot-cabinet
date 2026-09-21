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
  });
});
