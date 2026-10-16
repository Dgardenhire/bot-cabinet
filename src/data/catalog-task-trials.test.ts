import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CATALOG_TASK_TRIALS, CATALOG_TRIAL_PATH } from "./catalog-task-trials";

describe("contributed skill first-task records", () => {
  it("preserves completed skill-loaded runs without claiming Desktop or outside-action tests", () => {
    expect(CATALOG_TASK_TRIALS.filter(trial => trial.status === "Passed this sample")).toHaveLength(1);
    expect(CATALOG_TASK_TRIALS.filter(trial => trial.status === "Needs correction")).toHaveLength(3);
    for (const trial of CATALOG_TASK_TRIALS) {
      const root = `public${CATALOG_TRIAL_PATH}/${trial.slug}`;
      const run = JSON.parse(readFileSync(`${root}-run.json`, "utf8"));
      expect(run.roleLoaded).toBe(true);
      expect(run.completed).toBe(true);
      expect(run.desktopInstallTested).toBe(false);
      expect(run.outsideActionsTested).toBe(false);
      expect(run.humanApproved).toBe(false);
      expect(run.commit).toBe("35d75fbe66c18e3e45c8340825b7d4d390a04c0d");
      expect(readFileSync(`${root}-input.md`, "utf8")).toContain("SYNTHETIC FIXTURE");
      expect(readFileSync(`${root}-output.md`, "utf8").length).toBeGreaterThan(100);
    }
  });
});
