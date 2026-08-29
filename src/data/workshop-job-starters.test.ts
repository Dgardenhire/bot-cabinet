import { describe, expect, it } from "vitest";

import { buildBotBlueprint } from "../lib/workshop";
import {
  WORKSHOP_JOB_STARTERS,
  getWorkshopJobStarter,
  hasWorkshopDraftContent,
} from "./workshop-job-starters";

describe("WORKSHOP_JOB_STARTERS", () => {
  it("provides the eight plain-language starting jobs", () => {
    expect(WORKSHOP_JOB_STARTERS.map((starter) => starter.label)).toEqual([
      "Research a decision",
      "Prepare for a meeting",
      "Draft an article",
      "Plan a project",
      "Review a document",
      "Organize a busy week",
      "Develop a new venture",
      "Turn notes into a presentation",
    ]);
    expect(new Set(WORKSHOP_JOB_STARTERS.map((starter) => starter.id)).size).toBe(
      8,
    );
  });

  it("fills every required Blueprint field for every starting job", () => {
    for (const starter of WORKSHOP_JOB_STARTERS) {
      const blueprint = buildBotBlueprint(starter.draft);

      expect(blueprint.completedFields, starter.label).toBe(8);
      expect(blueprint.missingFields, starter.label).toEqual([]);
      expect(starter.draft.approvalBoundaries, starter.label).toBeTruthy();
      expect(starter.draft.firstRunTest, starter.label).toBeTruthy();
    }
  });

  it("looks up a starter without treating an empty draft as existing work", () => {
    const starter = getWorkshopJobStarter("plan-project");

    expect(starter?.label).toBe("Plan a project");
    expect(hasWorkshopDraftContent(starter!.draft)).toBe(true);
    expect(
      hasWorkshopDraftContent({
        ...starter!.draft,
        ...Object.fromEntries(
          Object.keys(starter!.draft).map((key) => [key, ""]),
        ),
      }),
    ).toBe(false);
  });
});
