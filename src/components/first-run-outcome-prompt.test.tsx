import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FirstRunOutcomePrompt } from "./first-run-outcome-prompt";

describe("FirstRunOutcomePrompt", () => {
  it("lets a visitor report an actual outcome without using progress checkmarks as proof", () => {
    const markup = renderToStaticMarkup(<FirstRunOutcomePrompt />);

    expect(markup).toContain("Did your Bot produce the expected result?");
    expect(markup).toContain("After trying the Bot");
    expect(markup).toContain("checkmarks above only track your progress");
    const successButton = [...markup.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)]
      .map(([button]) => button)
      .find((button) => button.includes("Yes, it worked"));
    expect(successButton).toBeDefined();
    expect(successButton).not.toContain("disabled");
    expect(markup).toContain("I got stuck");
    expect(markup.match(/<button/g)).toHaveLength(2);
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toContain("data-funnel-event");
  });
});
