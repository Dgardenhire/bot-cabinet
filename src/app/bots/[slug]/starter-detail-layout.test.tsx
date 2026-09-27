import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StarterBotPage from "./page";

describe("starter Bot detail layout", () => {
  it("leads with one use action and a first task before the platform choices", async () => {
    const html = renderToStaticMarkup(await StarterBotPage({
      params: Promise.resolve({ slug: "founding-engineer" }),
    }));

    expect(html).toContain('href="#choose-platform"');
    expect(html).toContain('id="first-task"');
    expect(html).toContain('id="choose-platform"');
    expect(html.indexOf('id="first-task"')).toBeLessThan(html.indexOf('id="choose-platform"'));
    expect(html).toContain('id="review-details"');
    expect(html).toContain("Hermes archive import checked; a full task run is still pending.");
    expect(html).toContain('id="bot-workbench"');
  });
});
