import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GUIDES } from "../../data/guides";
import GuidesPage from "./page";
import GuidePage, { generateStaticParams } from "./[slug]/page";
import sitemap from "../sitemap";

describe("morning newspaper cross-platform implementation guide", () => {
  const slug = "morning-newspaper-across-agents";
  it("is routed, indexed and discoverable", () => {
    expect(GUIDES.filter(guide => guide.slug === slug)).toHaveLength(1);
    expect(generateStaticParams()).toContainEqual({ slug });
    expect(sitemap().some(entry => entry.url.includes(`/guides/${slug}`))).toBe(true);
    expect(renderToStaticMarkup(<GuidesPage />)).toContain(`/guides/${slug}`);
  });
  it("renders attribution, usable briefs and explicit untested delivery status", async () => {
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain("https://x.ai/bot/marketplace/bots/the-morning-newspaper");
    expect(html).toContain("Karen X. Cheng");
    expect(html).toContain("Create a sample of my morning newspaper");
    expect(html).toContain("Can you implement this approved morning edition");
    expect(html).toContain("setup ideas, not tested connections");
    expect(html).toContain("We have not tested automatic printing");
    expect(html).toContain("Hermes: make one edition before you schedule it");
    expect(html).toContain("Muse or Instinct");
    expect(html).toContain("not a spending cap");
  });
});
