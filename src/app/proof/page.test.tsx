import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProofPage from "./page";
import { WEBSITE_TASK_COVERAGE } from "@/data/website-task-trials";

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
    expect(WEBSITE_TASK_COVERAGE.records.some(record => record.attempts.some(attempt => attempt.verdict === "needs-correction"))).toBe(true);
    const pending = WEBSITE_TASK_COVERAGE.records.filter(record => !record.attempts.some(attempt => attempt.completed && attempt.sha256 === record.sha256)).length;
    expect(html).toContain(`${pending} Bots without a completed answer`);
    expect(html).not.toContain("Three have run in this series so far");
    expect(html).toContain("/proof-room/website-tasks-20261015/index.json");
    expect(html).toContain("three-minute deadline");
  });
});
