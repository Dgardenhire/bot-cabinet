import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunChecklist, FirstRunCompletion } from "./first-run-checklist";

describe("FirstRunChecklist", () => {
  it("keeps progress checkmarks separate from the visitor's result report", () => {
    const markup = renderToStaticMarkup(<FirstRunChecklist />);

    expect(markup).toContain("0 of 5 steps complete");
    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("I got stuck");
    const successButton = [...markup.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)]
      .map(([button]) => button)
      .find((button) => button.includes("Yes, it worked"));
    expect(successButton).toBeDefined();
    expect(successButton).not.toContain("disabled");
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
