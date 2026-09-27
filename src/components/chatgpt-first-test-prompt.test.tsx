import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChatGPTFirstTestPrompt } from "./chatgpt-first-test-prompt";

describe("ChatGPTFirstTestPrompt", () => {
  it("asks for a first result without collecting task content", () => {
    const markup = renderToStaticMarkup(<ChatGPTFirstTestPrompt bot="chief-of-staff" />);
    expect(markup).toContain("Did you get a useful first result?");
    expect(markup).toContain("not an independent test");
    expect(markup).toContain("Yes, it helped");
    expect(markup).toContain("I got stuck");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<textarea");
  });
});
