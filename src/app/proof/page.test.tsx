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

  it("shows website task results, preserved failures and unfinished coverage", () => {
    const html = renderToStaticMarkup(<ProofPage />);
    expect(html).toContain("Website Bot tests");
    expect(html).toContain("Correction awaiting retest");
    expect(html).toContain("35 Bots not yet run in this series");
    expect(html).toContain("/proof-room/website-tasks-20261015/index.json");
    expect(html).toContain("three-minute deadline");
  });
});
