import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunChecklist, FirstRunCompletion } from "./first-run-checklist";

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

describe("FirstRunCompletion", () => {
  it("reports marked steps without claiming the Bot produced a result", () => {
    const markup = renderToStaticMarkup(<FirstRunCompletion />);

    expect(markup).toContain("All five steps marked complete");
    expect(markup).toContain("Your checkmarks record your progress");
    expect(markup).toContain("Choose another Bot");
    expect(markup).not.toContain("Scout is working");
    expect(markup).not.toContain("You now have a Bot, a first result");
  });
});
