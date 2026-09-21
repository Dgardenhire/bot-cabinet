import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RepeatUsePrompt } from "./repeat-use-prompt";

describe("RepeatUsePrompt", () => {
  it("renders nothing until local evidence makes a repeat-run checkpoint due", () => {
    expect(renderToStaticMarkup(<RepeatUsePrompt />)).toBe("");
  });
});
