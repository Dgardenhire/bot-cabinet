import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { WORK_ARCHETYPES, matchesWorkArchetype } from "./work-archetypes";
import { BOT_USE_CASES } from "./use-cases";

describe("curated work archetypes", () => {
  it("accounts for every standalone role exactly once without inventing more Bots", () => {
    const resources = JSON.parse(readFileSync("public/api/v1/resources.json", "utf8"));
    const slugs = resources.entries.filter((entry: { kind: string }) => ["starter-bot", "manual-specialist"].includes(entry.kind)).map((entry: { slug: string }) => entry.slug);
    const grouped = WORK_ARCHETYPES.flatMap(group => [...group.bots]);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual(slugs.sort());
  });

  it("filters starters and specialists by their shared job", () => {
    expect(matchesWorkArchetype("writer", "writer")).toBe(true);
    expect(matchesWorkArchetype("visual-producer", "writer")).toBe(true);
    expect(matchesWorkArchetype("coder", "writer")).toBe(false);
    expect(matchesWorkArchetype("coder", "all")).toBe(true);
  });

  it("adds Grok-inspired jobs as portable tasks for existing roles with explicit boundaries", () => {
    for (const slug of ["sort-inbox-for-review", "check-outdated-guide", "review-product-feedback"]) {
      const job = BOT_USE_CASES.find(item => item.slug === slug)!;
      expect(job, slug).toBeDefined();
      expect(job.botSlugs).toHaveLength(1);
      expect(job.inspiredBy?.collection?.href).toBe("https://x.ai/bot/use-cases");
      expect(job.inspiredBy?.href).toMatch(/^https:\/\/x.ai\/bot\//);
      expect(job.sample?.checks.length).toBeGreaterThanOrEqual(3);
      expect(job.kickoffMessage).toContain("Do not connect accounts");
      expect(job.sample?.input).toContain("Fictional");
      expect(job.sample?.output.length).toBeGreaterThan(150);
      expect(readFileSync(`public/downloads/use-cases/${slug}.md`, "utf8")).toContain("has not been runtime-tested");
    }
  });
});
