// Catalog entry: a published Hermes profile distribution.
// Each entry maps to a git repo containing distribution.yaml + SOUL.md + cron/ + skills/.
// Anyone can install with: hermes profile install <repo>

export interface CronJob {
  name: string;
  schedule: string;
  deliver: string; // "telegram" | "discord" | "slack" | "local" | ...
  summary: string; // one line of what the job actually does
}

export interface Distribution {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  authorHandle: string;
  repo: string;
  category: Category;
  integrations: string[];
  cronJobs: CronJob[];
  skillCount: number;
  hermesRequires: string;
  submittedAt: string;
  verified: boolean;
  soulExcerpt: string;
  recommendedTeammates?: string[];
  modelRecommendation?: string;
  image?: string; // path to character portrait, e.g. "/bot-scout.png"
}

export type Category =
  | "work-ops"
  | "research"
  | "sales"
  | "personal"
  | "coding"
  | "money"
  | "legal";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "work-ops", label: "Work & ops" },
  { key: "research", label: "Research" },
  { key: "sales", label: "Sales" },
  { key: "personal", label: "Personal admin" },
  { key: "coding", label: "Coding" },
  { key: "money", label: "Money" },
  { key: "legal", label: "Legal" },
];

export const CATEGORY_LABEL: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label])
) as Record<Category, string>;