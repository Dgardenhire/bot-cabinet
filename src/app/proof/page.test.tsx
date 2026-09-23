import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProofPage from "./page";

describe("Test Records page", () => {
  it("does not present controlled fixtures as real-world proof", () => {
    const html = renderToStaticMarkup(<ProofPage />);

    expect(html).toContain("Test Records");
    expect(html).toContain("These are lab tests");
    expect(html).toContain("They do not prove that a Bot is reliable");
    expect(html).toContain("Unfinished test plans");
    expect(html).toContain("A passed fixture is test evidence");
  });
});
