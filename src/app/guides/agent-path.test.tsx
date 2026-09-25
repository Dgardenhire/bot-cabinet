import { existsSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GUIDES } from "../../data/guides";
import GuidesPage from "./page";
import GuidePage, { generateStaticParams } from "./[slug]/page";
import sitemap from "../sitemap";

describe("cross-platform agent path guide", () => {
  const slug = "choose-your-agent-path";
  it("is discoverable from the Field Manual and sitemap with a real cover", () => {
    const guide = GUIDES.find(item => item.slug === slug)!;
    expect(existsSync(path.join(process.cwd(), "public", guide.coverImage!))).toBe(true);
    expect(renderToStaticMarkup(<GuidesPage />)).toContain(`/guides/${slug}`);
    expect(generateStaticParams()).toContainEqual({ slug });
    expect(sitemap().some(entry => entry.url.includes(`/guides/${slug}`))).toBe(true);
  });
  it("renders dated source links and distinguishes research from runtime proof", async () => {
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain("2026-09-20");
    expect(html).toContain("not a full ranking or a hands-on test");
    expect(html).toContain("step-by-step build guides, not Grok template links");
    expect(html).toContain("https://docs.typesafe.ai/concepts/system-one");
    expect(html).toContain("https://instinct.com/");
    expect(html).toContain("https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/");
    expect(html).toContain("Ready-made assistants are splitting into different jobs");
    expect(html).toContain("https://ollie.ai/");
    expect(html).toContain("https://wajo.ai/");
    expect(html).toContain("https://www.town.com/docs/getting-started");
    expect(html).toContain("Overlap is a reason to compare the experience");
    expect(html).toContain("has not created a new Bot from these findings");
    expect(html).toContain("second and third real occasion");
    expect(html).toContain("A harness is the code around an AI model");
  });
});
