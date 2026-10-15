import type { BotUseCase } from "@/data/use-cases";
import type { JobCategory } from "@/data/workflow-categories";
export { JOB_CATEGORIES, type JobCategory } from "@/data/workflow-categories";
export type WorkflowCard = Pick<BotUseCase, "slug" | "title" | "audience" | "outcome"> & {
  category: JobCategory;
  image: string;
  hasSample: boolean;
};

export function workflowCategory(job: BotUseCase): JobCategory {
  if (job.category) return job.category;
  if (job.botSlugs.includes("professor")) return "Learning";
  if (["software-feature-build", "website-content-update", "product-technology-direction", "operations-status-report"].includes(job.slug)) return "Building";
  if (["weekly-newsletter", "social-media-content-set", "narrative-message-system"].includes(job.slug)) return "Writing";
  if (job.slug === "personal-morning-newspaper") return "Home and family";
  return "Business";
}

export function filterWorkflowJobs(jobs: WorkflowCard[], query: string, category: JobCategory | "All") {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter(job => (category === "All" || job.category === category)
    && words.every(word => `${job.title} ${job.audience} ${job.outcome}`.toLowerCase().includes(word)));
}
