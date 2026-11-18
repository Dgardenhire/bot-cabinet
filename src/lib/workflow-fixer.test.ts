import { describe, expect, it } from "vitest";

import { getStarterBot } from "@/data/starter-bots";
import { coerceWorkshopDraft } from "./workshop-contract";
import {
  coerceWorkflowMap,
  EMPTY_WORKFLOW,
  EXAMPLE_WORKFLOW,
  firstPrompt,
  focusStep,
  formatHours,
  hoursPerMonth,
  matchTemplate,
  newStep,
  problemStatement,
  rankFriction,
  recommendFix,
  toWorkshopDraft,
  workflowToMarkdown,
  type WorkflowStep,
} from "./workflow-fixer";

function step(overrides: Partial<WorkflowStep>): WorkflowStep {
  return { ...newStep("A step", "s1"), ...overrides };
}

describe("workflow fixer", () => {
  it("turns frequency and minutes into hours a month", () => {
    expect(hoursPerMonth({ frequency: "weekly", minutes: 60 })).toBeCloseTo(4.3);
    expect(hoursPerMonth({ frequency: "daily", minutes: 30 })).toBeCloseTo(10.5);
    expect(formatHours(0.5)).toBe("30 minutes");
    expect(formatHours(1)).toBe("1 hour");
    expect(formatHours(42.4)).toBe("42 hours");
  });

  it("ranks only steps with snags, biggest time first", () => {
    const ranked = rankFriction(EXAMPLE_WORKFLOW.steps);
    expect(ranked.map((s) => s.id)).toEqual(["ex3", "ex1", "ex4", "ex2"]);
  });

  it("says plainly when AI is not the fix", () => {
    expect(recommendFix(step({ snags: ["waiting"] }))).toMatchObject({ kind: "process", aiHelps: false });
    expect(recommendFix(step({ snags: ["judgment"] })).kind).toBe("process");
  });

  it("climbs the same ladder as the Bot Fit Test", () => {
    expect(recommendFix(step({ frequency: "rarely", snags: ["writing"] })).kind).toBe("prompt");
    expect(recommendFix(step({ frequency: "weekly", snags: ["writing"] })).kind).toBe("skill");
    expect(recommendFix(step({ snags: ["reminding"] })).kind).toBe("routine");
    expect(recommendFix(step({ snags: ["copying", "writing", "checking"] })).kind).toBe("bot");
  });

  it("writes a problem statement from the focus step and the last why", () => {
    const statement = problemStatement(EXAMPLE_WORKFLOW);
    expect(statement).toContain('"Write the update email for each client"');
    expect(statement).toContain("about 4.3 hours a month");
    expect(statement).toContain("because we never wrote down what a good update includes");
    expect(statement).toContain("The goal: each client gets a clear update");
    expect(statement.startsWith("Weekly client update: I spend")).toBe(true);
    expect(problemStatement(EMPTY_WORKFLOW)).toBe("");
  });

  it("falls back to the biggest friction step when no focus is chosen", () => {
    expect(focusStep({ ...EXAMPLE_WORKFLOW, focusStepId: null })?.id).toBe("ex3");
  });

  it("builds a first prompt that carries the reader's own context", () => {
    const prompt = firstPrompt(EXAMPLE_WORKFLOW);
    expect(prompt).toContain("Pull this week's numbers");
    expect(prompt).toContain("Ask me up to three questions");
    const waiting = firstPrompt({ ...EXAMPLE_WORKFLOW, focusStepId: "ex4" });
    expect(waiting).toContain("AI cannot do this step for me");
  });

  it("matches a template only when one honestly fits, and the template exists", () => {
    const match = matchTemplate(EXAMPLE_WORKFLOW);
    expect(match?.slug).toBe("writer");
    expect(getStarterBot(match!.slug)).toBeTruthy();
    expect(matchTemplate({ ...EXAMPLE_WORKFLOW, steps: [step({ text: "Mow the lawn", snags: ["judgment"] })], focusStepId: "s1" })).toBeNull();
  });

  it("hands Bot Lab a draft its own contract accepts", () => {
    const draft = toWorkshopDraft(EXAMPLE_WORKFLOW);
    expect(coerceWorkshopDraft(draft)).toEqual(draft);
    expect(draft?.botName).toBe("Weekly client update Helper");
    expect(draft?.jobOutcome).toContain("Write the update email");
  });

  it("exports a markdown worksheet", () => {
    const md = workflowToMarkdown(EXAMPLE_WORKFLOW);
    expect(md).toContain("# Weekly client update");
    expect(md).toContain("| 3 | Write the update email for each client |");
    expect(md).toContain("## Problem statement");
  });

  it("rejects or cleans bad saved data", () => {
    expect(coerceWorkflowMap(null)).toBeNull();
    expect(coerceWorkflowMap({ version: 2, steps: [] })).toBeNull();
    const cleaned = coerceWorkflowMap({
      version: 1,
      steps: [{ id: "a", text: "x", frequency: "hourly", minutes: 9999, snags: ["copying", "bogus", "copying"] }],
      focusStepId: "missing",
      whys: ["one"],
    });
    expect(cleaned?.steps[0]).toMatchObject({ frequency: "weekly", minutes: 600, snags: ["copying"] });
    expect(cleaned?.focusStepId).toBeNull();
    expect(cleaned?.whys).toHaveLength(3);
    expect(coerceWorkflowMap(EXAMPLE_WORKFLOW)).toEqual(EXAMPLE_WORKFLOW);
  });
});
