import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { buildBotBlueprint, type WorkshopDraft } from "../lib/workshop";
import { WorkshopLiveDrawing } from "./workshop-live-drawing";

const draft: WorkshopDraft = {
  botName: "Weekly Update Bot",
  jobOutcome: "Prepare a weekly client update and action list.",
  inputsContext: "Approved client notes",
  outputsDeliverables: "A concise update and action list",
  cadenceTrigger: "When I request it",
  toolsIntegrations: "Read-only client documents",
  approvalBoundaries: "Not yet specified",
  firstRunTest: "Use sample notes to prepare one draft.",
};

it("shows unresolved placeholder fields as incomplete in the live preview", () => {
  const markup = renderToStaticMarkup(
    <WorkshopLiveDrawing blueprint={buildBotBlueprint(draft)} />,
  );

  expect(markup).toContain("7 of 8 fields filled");
  expect(markup).not.toContain("All 8 fields filled");
  expect(markup).toContain("Approval items needed");
  expect(markup).toContain("Next: Approval required");
});
