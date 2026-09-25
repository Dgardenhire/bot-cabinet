import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CrewKitPage from "./page";

describe("Crew Kit measurement path", () => {
  it("marks bounded setup actions without visitor-entered content", async () => {
    const page = await CrewKitPage({ params: Promise.resolve({ slug: "publishing-desk" }) });
    const markup = renderToStaticMarkup(page);

    for (const event of [
      "crew_bundle_download",
      "crew_guided_setup_started",
      "crew_setup_checklist_download",
      "crew_manifest_inspected",
    ]) {
      expect(markup).toContain(`data-funnel-event="${event}"`);
    }
    expect(markup.match(/data-funnel-destination="publishing-desk"/g)).toHaveLength(4);
    expect(markup).not.toContain("data-funnel-content");
  });
});
