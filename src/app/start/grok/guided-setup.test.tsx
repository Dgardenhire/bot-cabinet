import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { STARTER_BOTS } from "@/data/starter-bots";
import { generateStaticParams } from "./[slug]/page";
import GrokBotSetupPage from "./[slug]/page";

describe("Grok Bot guided setup", () => {
  it("has a guided path for every starter Bot", () => {
    expect(generateStaticParams()).toEqual(
      STARTER_BOTS.map((bot) => ({ slug: bot.slug })),
    );
  });

  it("gives Founding Engineer a job, input list, first task, and optional full brief", async () => {
    const page = await GrokBotSetupPage({ params: Promise.resolve({ slug: "founding-engineer" }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("Build Founding Engineer in Grok Bot");
    expect(html).toContain("Copy job description");
    expect(html).toContain("Copy first task");
    expect(html).toContain("A working prototype or changed project files");
    expect(html).toContain('href="/downloads/grok-bot-templates/v2/founding-engineer.md"');
    expect(html).toContain("Not yet tested in Grok Bot");
    expect(html).toContain("not a Grok import");
  });
});
