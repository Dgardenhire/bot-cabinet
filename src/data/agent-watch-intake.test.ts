import { describe, expect, it } from "vitest";
import { AGENT_WATCH_ITEMS } from "./agent-watch";
import { STARTER_BOTS } from "./starter-bots";

// Bot Cabinet is cross-platform. A Bot spotted on one platform that Bot
// Cabinet decides to add must become a real template people can run anywhere,
// not stay a Watch note that points back at the original. See AGENTS.md.
describe("Agent Watch intake", () => {
  const templateSlugs = new Set(STARTER_BOTS.map((bot) => bot.slug));
  const added = AGENT_WATCH_ITEMS.filter((item) => item.botDetails?.cabinetDecision === "add-new");

  it.each(added.map((item) => [item.slug, item] as const))("%s links to its Bot Cabinet template", (_slug, item) => {
    const template = item.botDetails?.cabinetTemplate;
    expect(template, "add-new items need botDetails.cabinetTemplate").toBeDefined();
    const match = template!.href.match(/^\/bots\/([a-z0-9-]+)\/?$/);
    expect(match, "cabinetTemplate.href must be a /bots/<slug> page").not.toBeNull();
    expect(templateSlugs.has(match![1]), `no starter Bot with slug ${match![1]}`).toBe(true);
    expect(item.cabinetLinks?.[0]?.href, "the template should be the first Bot Cabinet link").toBe(template!.href);
  });

  it("credits the original creator on every template made from a Watch item", () => {
    for (const item of added) {
      const slug = item.botDetails!.cabinetTemplate!.href.split("/").filter(Boolean).pop();
      const bot = STARTER_BOTS.find((candidate) => candidate.slug === slug)!;
      expect(bot.inspiredBy?.creator).toBe(item.botDetails!.creator);
    }
  });
});
