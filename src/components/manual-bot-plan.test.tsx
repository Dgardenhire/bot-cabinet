import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SPECIALISTS, CREW_PLANS } from "@/data/specialist-collection";
import { SpecialistPage, CrewPlanPage } from "./manual-bot-plan";

describe("manual specialist and crew pages", () => {
  it.each(SPECIALISTS)("$name has a usable copy path without claiming native installation", bot => {
    const html = renderToStaticMarkup(<SpecialistPage bot={bot} />);
    expect(html).toContain("Copy role instructions");
    expect(html).toContain("Copy first task");
    expect(html).toContain(`/downloads/specialists/${bot.slug}.md`);
    expect(html).toContain("not an Add Bot link or native import archive");
    expect(html).not.toContain("hermes profile import");
    expect(html).toContain("not an independent review");
  });
  it.each(CREW_PLANS)("$name keeps manual setup and role links", crew => {
    const html = renderToStaticMarkup(<CrewPlanPage crew={crew} />);
    expect(html).toContain("Copy setup plan");
    expect(html).toContain(`/downloads/crew-plans/${crew.slug}.md`);
    expect(html).toContain("simulated text handoffs");
    for (const role of crew.roles) expect(html).toContain(`/bots/${role.slug}/`);
    if (crew.extends) expect(html).toContain(`/crew-kits/${crew.extends}/`);
  });
  it("shows the failed original and distinguishes its correction from a fresh test", () => {
    const bot = SPECIALISTS.find(bot => bot.slug === "deal-reviewer")!;
    const html = renderToStaticMarkup(<SpecialistPage bot={bot} />);
    expect(html).toContain("fail:");
    expect(html).toContain("This correction is not a fresh test.");
    expect(html).toContain("it has not had a fresh task test");
  });
  it("does not turn supplied text into HTML", () => {
    const bot = { ...SPECIALISTS[0], task: '<script>alert("example")</script>' };
    const html = renderToStaticMarkup(<SpecialistPage bot={bot} />);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain('<script>alert("example")</script>');
  });
});
