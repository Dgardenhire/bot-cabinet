import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WEBSITE_TASK_COVERAGE, WEBSITE_TASK_TRIALS } from "./website-task-trials";
import { STARTER_BOTS } from "./starter-bots";
import { SPECIALISTS } from "./specialist-collection";

describe("website task evidence", () => {
  it("accounts for every standalone Bot without counting prepared cases as completed tests", () => {
    expect(WEBSITE_TASK_COVERAGE.records.map(r => r.slug).sort()).toEqual([...STARTER_BOTS, ...SPECIALISTS].map(b => b.slug).sort());
    expect(WEBSITE_TASK_TRIALS).toHaveLength(3);
    expect(WEBSITE_TASK_COVERAGE.humanApproved).toBe(false);
    for (const record of WEBSITE_TASK_COVERAGE.records) {
      const task = JSON.parse(readFileSync(`public${record.case}`, "utf8"));
      expect(task.task.length).toBeGreaterThan(50);
      expect(task.checklist.length).toBeGreaterThanOrEqual(3);
      if (!record.attempts.length) expect(record.status).toBe("not-run");
    }
  });

  it("binds every completed answer to its preserved downloaded source and same input across revisions", () => {
    for (const record of WEBSITE_TASK_TRIALS) {
      const inputs = new Set<string>();
      for (const attempt of record.attempts) {
        const source = readFileSync(`public${attempt.files.source}`);
        expect(createHash("sha256").update(source).digest("hex")).toBe(attempt.sha256);
        inputs.add(readFileSync(`public${attempt.files.input}`, "utf8"));
        const run = JSON.parse(readFileSync(`public${attempt.files.run}`, "utf8"));
        expect(run.humanApproved).toBe(false);
        if (attempt.completed) {
          expect(readFileSync(`public${attempt.files.output}`, "utf8").length).toBeGreaterThan(100);
          expect(run.desktopInstallTested).toBe(false);
          expect(run.outsideActionsTested).toBe(false);
        }
      }
      expect(inputs.size).toBe(1);
      if (record.status === "passed-sample") {
        const latestPass = record.attempts.findLast(a => a.completed && a.verdict === "passed-sample")!;
        expect(latestPass.sha256).toBe(record.sha256);
        expect(createHash("sha256").update(readFileSync(`public/downloads/portable-bot-packs/v2/${record.slug}.json`)).digest("hex")).toBe(record.sha256);
      }
    }
  });
});
