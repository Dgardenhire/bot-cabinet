import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BOT_USE_CASES } from "@/data/use-cases";
import UseCasesPage from "./page";
import UseCaseDetailPage from "./[slug]/page";

describe("job-first workflow browsing", () => {
  it("puts the searchable job library before Crew Kits", () => {
    const html = renderToStaticMarkup(<UseCasesPage />);
    expect(html).toContain("What would you like help with?");
    expect(html).toContain('type="search"');
    expect(html).toContain("Home and family");
    expect(html.indexOf('aria-label="Search jobs"')).toBeLessThan(html.indexOf("Build a standing team"));
  });

  it("offers real setup examples without creating duplicate Bot roles", () => {
    for (const slug of ["school-paperwork", "check-unbilled-work", "check-contractor-invoices", "preserve-family-stories", "prepare-warranty-claim", "draft-product-listings", "plan-home-project", "turn-feedback-into-issues", "practice-a-language", "practice-customer-conversations"]) {
      const job = BOT_USE_CASES.find(item => item.slug === slug);
      expect(job, slug).toBeDefined();
      expect(job?.sample?.input, slug).toBeTruthy();
      expect(job?.sample?.output, slug).toBeTruthy();
      expect(job?.sample?.checks.length, slug).toBeGreaterThan(1);
      expect(job?.inspiredBy?.href, slug).toMatch(/^https:\/\/x.com\//);
    }
  });

  it("shows a complete fictional first request and clearly labeled sample result", async () => {
    const html = renderToStaticMarkup(await UseCaseDetailPage({ params: Promise.resolve({ slug: "check-unbilled-work" }) }));
    expect(html).toContain("Illustrative example, not a recorded Bot run");
    expect(html).toContain("Copy sample task");
    expect(html).toContain("$120");
    expect(html).toContain("Bot Usecases");
    expect(html).toContain("Community report; this adaptation has not been runtime-tested");
    expect(html).toContain("/start/chatgpt/client");
    expect(html).toContain("/start/grok/client");
  });

  it("keeps a specialist workflow on a valid setup path", async () => {
    const html = renderToStaticMarkup(await UseCaseDetailPage({ params: Promise.resolve({ slug: "practice-customer-conversations" }) }));
    expect(html).toContain("Call Coach");
    expect(html).toContain('href="/bots/call-coach"');
    expect(html).not.toContain("/start/chatgpt/call-coach");
    expect(html).toContain("Copy its role instructions into a new Bot");
    expect(html).not.toContain(".tar.gz profile");
    const download = readFileSync("public/downloads/use-cases/practice-customer-conversations.md", "utf8");
    expect(download).toContain("Copy its role instructions into a new Bot");
    expect(download).not.toContain(".tar.gz profile");
  });

  it("credits official Grok examples without claiming the community directory found them", async () => {
    for (const slug of ["sort-inbox-for-review", "check-outdated-guide", "review-product-feedback"]) {
      const html = renderToStaticMarkup(await UseCaseDetailPage({ params: Promise.resolve({ slug }) }));
      expect(html).toContain("Grok Bot use cases");
      expect(html).not.toContain("Bot Usecases, curated by KP");
      expect(html).toContain("this adaptation has not been runtime-tested");
      expect(html).toContain("Copy sample task");
      expect(html).toContain("/start/chatgpt/");
      const download = readFileSync(`public/downloads/use-cases/${slug}.md`, "utf8");
      expect(download).toContain("Grok Bot use cases");
      expect(download).not.toContain("Bot Usecases (");
    }
  });
});
