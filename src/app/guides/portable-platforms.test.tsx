import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GUIDES } from "../../data/guides";
import GuidesPage from "./page";
import GuidePage, { generateStaticParams } from "./[slug]/page";

describe("portable Bot platform guide", () => {
  const slug = "use-a-bot-on-another-platform";

  it("is listed in the Field Manual and static routes", () => {
    expect(GUIDES.some((guide) => guide.slug === slug)).toBe(true);
    expect(renderToStaticMarkup(<GuidesPage />)).toContain(`/guides/${slug}`);
    expect(generateStaticParams()).toContainEqual({ slug });
  });

  it("gives honest ChatGPT and Claude setup paths with a first test", async () => {
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain("ChatGPT Workspace Agent");
    expect(html).toContain("Cowork plugin or skill");
    expect(html).toContain("Claude Code is the right home only when the Bot&#x27;s job lives in a codebase");
    expect(html).toContain("Example: Chief of Staff");
    expect(html).toContain("A prepared guide is not a tested deployment");
    expect(html).toContain("https://help.openai.com/en/articles/20001143");
    expect(html).toContain("https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork");
  });
});
