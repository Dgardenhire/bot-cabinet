import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BotFitTest } from "./bot-fit-test";

describe("BotFitTest", () => {
  it("does not silently answer any branching question for the visitor", () => {
    const markup = renderToStaticMarkup(<BotFitTest />);
    const radios = markup.match(/<input[^>]+type="radio"[^>]*>/g) ?? [];
    expect(radios).toHaveLength(12);
    expect(radios.every((radio) => !radio.includes("checked"))).toBe(true);
    expect(radios.every((radio) => radio.includes("required"))).toBe(true);
    expect(markup).not.toContain('id="fit-test-result"');
  });
  it("presents a plain-language, browser-local path to the right work format", () => {
    const markup = renderToStaticMarkup(<BotFitTest />);

    expect(markup).toContain("What kind of setup does this work need?");
    expect(markup).toContain("What are you trying to accomplish?");
    expect(markup).toContain("How often will this work happen?");
    expect(markup).toContain("Does it need to remember context across conversations?");
    expect(markup).toContain("Does it need several specialists with different jobs?");
    expect(markup).toContain("Have you completed this work successfully by hand?");
    expect(markup).toContain("Does this overlap with a role you already use?");
    expect(markup).toContain("Required for a Routine");
    expect(markup).toContain("Show my best starting point");
    expect(markup).toContain("stays in this browser");
    expect(markup).toContain("Assignment");
    expect(markup).toContain("Skill");
    expect(markup).toContain("Routine");
    expect(markup).toContain("Bot");
    expect(markup).toContain("Crew");
  });
});
