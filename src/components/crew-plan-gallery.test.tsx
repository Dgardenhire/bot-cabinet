import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CrewPlanGallery } from "./crew-plan-gallery";
import { CREW_PLANS } from "@/data/specialist-collection";

describe("new Crew plan gallery", () => {
  it("shows each plan with its own member art, names and setup link", () => {
    const html = renderToStaticMarkup(<CrewPlanGallery />);
    for (const plan of CREW_PLANS) {
      expect(html).toContain(`href="/crew-kits/${plan.slug}"`);
      expect(html).toContain(plan.name);
    }
    expect(html).toContain('%2Fbot-portraits%2Fspecialists%2F');
    expect(html).not.toContain('class="manual-bot-plan_card');
    expect(html.match(/<article/g)).toHaveLength(CREW_PLANS.length);
  });
});
