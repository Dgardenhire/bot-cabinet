import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunChecklist } from "./first-run-checklist";

describe("FirstRunChecklist", () => {
  it("lets a visitor report a result or a problem before every checkbox is complete", () => {
    const markup = renderToStaticMarkup(<FirstRunChecklist />);

    expect(markup).toContain("0 of 5 steps complete");
    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("I got stuck");
    expect(markup).not.toContain("Scout is working");
  });
});
