import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BOT_USE_CASES } from "../../data/use-cases";
import UseCaseDetailPage from "./[slug]/page";

describe("outcome-first workflow adaptations", () => {
  const useCase = BOT_USE_CASES.find(item => item.slug === "personal-morning-newspaper")!;

  it("supports known and future hosts without changing the workflow shape", () => {
    expect(BOT_USE_CASES.find(item => item.slug === "morning-industry-briefing")?.adaptations).toBeUndefined();
    expect(useCase.adaptations?.map(item => item.platform)).toEqual([
      "Grok Bot", "Hermes", "Muse", "Instinct", "Another agent or emerging tool",
    ]);
    expect(useCase.adaptations?.every(item => item.status && item.limitations)).toBe(true);
    expect(useCase.adaptations?.find(item => item.platform === "Grok Bot")?.status).toBe("original-source");
    expect(useCase.botSlugs).toEqual(["daily-newspaper"]);
    expect(useCase.adaptations?.find(item => item.platform === "Hermes")?.status).toBe("cabinet-tested");
  });

  it("renders attribution, implementation status and the portable path", async () => {
    const html = renderToStaticMarkup(await UseCaseDetailPage({ params: Promise.resolve({ slug: useCase.slug }) }));
    expect(html).toContain("Karen X. Cheng");
    expect(html).toContain("https://x.ai/bot/marketplace/bots/the-morning-newspaper");
    expect(html).toContain("Another agent or emerging tool");
    expect(html).toContain("What to check — not tested");
    expect(html).toContain("One bounded run passed");
    expect(html).toContain("/bots/daily-newspaper");
    expect(html).toContain("/proof-room/daily-newspaper/runtime-summary.md");
  });
});
