import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getGuide } from "@/data/guides";
import sitemap from "../sitemap";
import GuidePage from "./[slug]/page";

describe("Fix one bad AI result guide", () => {
  it("connects an attributed idea to a usable, honest first task", async () => {
    const guide = getGuide("fix-one-bad-ai-result");
    expect(guide).toBeDefined();
    const html = renderToStaticMarkup(await GuidePage({ params: Promise.resolve({ slug: "fix-one-bad-ai-result" }) }));
    expect(html).toContain("Fix one bad AI result");
    expect(html).toContain("My original task:");
    expect(html).toContain("What I expected instead:");
    expect(html).toContain("Copy this text");
    expect(html).toContain("Run the same task again");
    expect(html).toContain("Original Muse at Work listing");
    expect(html).toContain("has not run the original Muse workflow");
    expect(html).toContain("/downloads/starter-bots/v2/ops/skills/diagnose-ai-result/SKILL.md");
    expect(sitemap().some((entry) => entry.url === "https://botcabinet.com/guides/fix-one-bad-ai-result/")).toBe(true);
  });
});
