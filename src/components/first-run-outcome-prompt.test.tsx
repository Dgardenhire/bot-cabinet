import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunOutcomePrompt } from "./first-run-outcome-prompt";

describe("FirstRunOutcomePrompt", () => {
  it("keeps problem reporting available before a successful run can be claimed", () => {
    const markup = renderToStaticMarkup(<FirstRunOutcomePrompt canReportWorked={false} />);

    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("Mark the Run and Check steps complete before reporting success.");
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>.*Yes, it worked/s);
    expect(markup).toContain("I got stuck");
    expect(markup.match(/<button/g)).toHaveLength(2);
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toContain("data-funnel-event");
  });

  it("allows a successful result after the run and check steps are complete", () => {
    const markup = renderToStaticMarkup(<FirstRunOutcomePrompt canReportWorked />);

    expect(markup).toMatch(/<button[^>]*>.*Yes, it worked/s);
    expect(markup).not.toMatch(/<button[^>]*disabled=""[^>]*>.*Yes, it worked/s);
  });
});
