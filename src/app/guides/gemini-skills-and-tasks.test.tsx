import { existsSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AGENT_WATCH_ITEMS } from "../../data/agent-watch";
import { GUIDES } from "../../data/guides";
import GuidesPage from "./page";
import GuidePage, { generateStaticParams } from "./[slug]/page";
import sitemap from "../sitemap";
import { agents } from "../compare/agents";

describe("Gemini skills and tasks guide", () => {
  const slug = "gemini-skills-and-tasks";

  it("is first in the Field Manual, statically exported and dated in the sitemap", () => {
    const guide = GUIDES.find((item) => item.slug === slug)!;
    expect(existsSync(path.join(process.cwd(), "public", guide.coverImage!))).toBe(true);
    expect(GUIDES[0].slug).toBe(slug);
    expect(renderToStaticMarkup(<GuidesPage />)).toContain(`/guides/${slug}`);
    expect(generateStaticParams()).toContainEqual({ slug });
    expect(sitemap()).toContainEqual(expect.objectContaining({
      url: `https://botcabinet.com/guides/${slug}/`,
      lastModified: new Date("2026-10-28"),
    }));
  });

  it("renders the dates, the Bot steps, Task mode safeguards, linkable sections and sources", async () => {
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain("November 17, 2026");
    expect(html).toContain("December 17, 2026");
    expect(html).toContain("My Gems from Labs");
    expect(html).toContain("Download the Agent Skill");
    expect(html).toContain("Human checkpoint");
    expect(html).toContain("Customize &gt; Skills &gt; Create &gt; Upload");
    expect(html).toContain("formerly Spark");
    expect(html).toContain("progress chip");
    expect(html).toContain("bulk changes to the private to-dos in your Google Tasks app");
    expect(html).toContain('id="add-a-bot-to-gemini"');
    expect(html).toContain('id="run-a-bot-in-task-mode-formerly-spark"');
    for (const url of [
      "https://support.google.com/gemini/answer/18560919?hl=en",
      "https://support.google.com/gemini/answer/16920332?hl=en",
      "https://support.google.com/gemini/answer/17094296?hl=en",
      "https://support.google.com/gemini/answer/17094507?hl=en",
      "https://support.google.com/gemini/answer/18766567?hl=en",
      "https://developers.google.com/opal/faq",
    ]) {
      expect(html).toContain(url);
    }
    expect(html).toContain("Bot Cabinet has not yet uploaded a Bot to Gemini or run one there");
  });

  it("points /compare's Gemini row at a section id the guide really renders", async () => {
    const gemini = agents.find((agent) => agent.name === "Gemini Tasks (formerly Spark)")!;
    const [route, fragment] = gemini.path.split("#");
    expect(route.replace(/\/$/, "")).toBe(`/guides/${slug}`);
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain(`id="${fragment}"`);
  });

  it("publishes the Gemini Watch item with a link to the guide", () => {
    const item = AGENT_WATCH_ITEMS.find((entry) => entry.slug === "gemini-gems-become-skills")!;
    expect(item.responseStatus).toBe("published");
    expect(item.cabinetLinks).toContainEqual({ label: "Read the Gemini guide", href: `/guides/${slug}/` });
    const text = JSON.stringify(item);
    expect(text).not.toContain("upload its folder");
    expect(text).not.toContain("read-only skills");
  });
});
