import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BotWorkbench } from "./bot-workbench";

describe("BotWorkbench", () => {
  it("renders a bounded, local, user-confirmed workbench", () => {
    const html = renderToStaticMarkup(<BotWorkbench botSlug="scout" botName="Scout" packVersion="2.0.0" />);
    expect(html).toContain("Continue after the download");
    expect(html).toContain('id="bot-workbench"');
    expect(html).toContain("Pack 2.0.0");
    expect(html).toContain("not independent Cabinet verification");
    expect(html).toContain("Progress stays in this browser");
    expect(html).toContain("Run checks: 0 of 2");
    expect(html).toContain('max="2" value="0"');
    expect(html.match(/type="checkbox"/g)).toHaveLength(5);
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain('type="text"');
    expect(html).toContain('data-funnel-event="bot_workbench_hub_open"');
    expect(html).toContain('data-funnel-destination="scout"');
  });
});
