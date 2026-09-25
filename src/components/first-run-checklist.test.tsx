import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunChecklist } from "./first-run-checklist";

describe("FirstRunChecklist", () => {
  it("lets a visitor report a problem without claiming success before running the Bot", () => {
    const markup = renderToStaticMarkup(<FirstRunChecklist />);

    expect(markup).toContain("0 of 5 steps complete");
    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("I got stuck");
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>[\s\S]*Yes, it worked/);
    expect(markup).not.toContain("Scout is working");
  });
});
