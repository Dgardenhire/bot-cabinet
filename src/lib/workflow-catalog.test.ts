import { describe, expect, it } from "vitest";
import { filterWorkflowJobs, workflowCategory, type WorkflowCard } from "./workflow-catalog";
import { BOT_USE_CASES } from "@/data/use-cases";
import { getStarterBot } from "@/data/starter-bots";
import { SPECIALISTS } from "@/data/specialist-collection";

const jobs: WorkflowCard[] = [
  { slug: "school", title: "Sort school messages", audience: "Parents", outcome: "Forms and dates", category: "Home and family", image: "/image.webp", hasSample: true },
  { slug: "invoice", title: "Check supplier invoices", audience: "Contractors", outcome: "Compare prices and quantities", category: "Business", image: "/image.webp", hasSample: true },
  { slug: "writing", title: "Write a newsletter", audience: "Consultants", outcome: "An email draft", category: "Writing", image: "/image.webp", hasSample: false },
];

describe("workflow search and setup targets", () => {
  it("matches all search words across job, audience and result", () => {
    expect(filterWorkflowJobs(jobs, "  PRICES contractor ", "All").map(job => job.slug)).toEqual(["invoice"]);
    expect(filterWorkflowJobs(jobs, "school quantities", "All")).toEqual([]);
  });
  it("combines the selected category and search without dropping jobs on reset", () => {
    expect(filterWorkflowJobs(jobs, "", "Home and family").map(job => job.slug)).toEqual(["school"]);
    expect(filterWorkflowJobs(jobs, "school", "Business")).toEqual([]);
    expect(filterWorkflowJobs(jobs, "", "All")).toHaveLength(3);
  });
  it("categorizes existing guides alongside the new practical jobs", () => {
    expect(workflowCategory(BOT_USE_CASES.find(job => job.slug === "weekly-newsletter")!)).toBe("Writing");
    expect(workflowCategory(BOT_USE_CASES.find(job => job.slug === "practice-a-language")!)).toBe("Learning");
  });
  it("links every recommended role to an existing starter or specialist", () => {
    for (const job of BOT_USE_CASES) for (const slug of job.botSlugs) {
      expect(!!getStarterBot(slug) || SPECIALISTS.some(bot => bot.slug === slug), `${job.slug}: ${slug}`).toBe(true);
    }
    expect(new Set(BOT_USE_CASES.map(job => job.slug)).size).toBe(BOT_USE_CASES.length);
  });
});
