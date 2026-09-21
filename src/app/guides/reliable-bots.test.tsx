import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GUIDES } from "../../data/guides";
import GuidesPage from "./page";
import GuidePage, { generateStaticParams } from "./[slug]/page";
import sitemap from "../sitemap";

describe("reliable Bots guide", () => {
  const slug = "run-bots-reliably";

  it("is routed, indexed and discoverable", () => {
    expect(GUIDES.filter((guide) => guide.slug === slug)).toHaveLength(1);
    expect(generateStaticParams()).toContainEqual({ slug });
    expect(sitemap().some((entry) => entry.url.includes(`/guides/${slug}`))).toBe(true);
    expect(renderToStaticMarkup(<GuidesPage />)).toContain(`/guides/${slug}`);
  });

  it("renders the complete reliability method and honest attribution", async () => {
    const html = renderToStaticMarkup(
      await GuidePage({ params: Promise.resolve({ slug }) }),
    );

    expect(html).toContain("How to run Bots reliably");
    expect(html).toContain("independent synthesis by GitHub user unicodef1wn");
    expect(html).toContain("It is not official xAI guidance");
    expect(html).toContain("https://github.com/unicodef1wn/grokbot-field-notes");
    expect(html).toContain("Write a short job contract");
    expect(html).toContain("Choose a Bot, a skill or a routine");
    expect(html).toContain("Keep changing facts in one trusted place");
    expect(html).toContain("Match freedom to possible harm");
    expect(html).toContain("Run one small test that looks like the real job");
    expect(html).toContain("Test failure before you trust success");
    expect(html).toContain("Turn corrections into clear rules");
    expect(html).toContain("Control cost before you add a schedule");
    expect(html).toContain("Use the simplest structure that can do the job");
    expect(html).not.toContain("grok-bot-guide-by-spacex-engineers.pdf");
  });
});
