import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunOutcomePrompt } from "./first-run-outcome-prompt";

describe("FirstRunOutcomePrompt", () => {
  it("asks one plain-English outcome question with two bounded answers", () => {
    const markup = renderToStaticMarkup(<FirstRunOutcomePrompt />);

    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("Yes, it worked");
    expect(markup).toContain("I got stuck");
    expect(markup.match(/<button/g)).toHaveLength(2);
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toContain("data-funnel-event");
  });
});
