import { describe, expect, it } from "vitest";

import { getStarterBot } from "./starter-bots";
import { BOT_USE_CASES, getBotUseCase } from "./use-cases";
import { CREW_KITS } from "./crew-kits";
import { getUseCaseOperations } from "./use-case-operations";

describe("Crew Kits and workflow operations", () => {
  it("publishes the complete previously approved Crew Kit catalog", () => {
    expect(CREW_KITS.map((kit) => kit.slug)).toEqual([
      "publishing-desk",
      "sales-meeting-desk",
      "customer-support-desk",
      "product-delivery-crew",
      "grant-pursuit-desk",
      "event-operations-desk",
      "weekly-business-review",
      "hiring-support-desk",
      "learning-certification-crew",
      "personal-planning-desk",
      "small-business-admin-desk",
    ]);
  });

  it("makes every Crew Kit complete and internally valid", () => {
    const images = new Set<string>();

    for (const kit of CREW_KITS) {
      expect(kit.roles.length).toBeGreaterThanOrEqual(3);
      expect(kit.workflows.length).toBeGreaterThanOrEqual(2);
      expect(kit.operatingRhythm.length).toBeGreaterThanOrEqual(3);
      expect(kit.sharedInputs.length).toBeGreaterThanOrEqual(3);
      expect(kit.successMeasures.length).toBeGreaterThanOrEqual(3);
      expect(kit.setupSteps.length).toBeGreaterThanOrEqual(4);
      expect(kit.passport.allowedAccess.length).toBeGreaterThan(0);
      expect(kit.passport.approvalActions.length).toBeGreaterThan(0);
      expect(kit.passport.prohibitedActions.length).toBeGreaterThan(0);
      expect(kit.image.src).toMatch(/^\/use-cases\//);
      expect(kit.image.alt).toBeTruthy();
      images.add(kit.image.src);

      for (const role of kit.roles) {
        expect(getStarterBot(role.botSlug)).toBeDefined();
      }
      for (const workflow of kit.workflows) {
        if (workflow.useCaseSlug) {
          const useCase = getBotUseCase(workflow.useCaseSlug);
          expect(useCase).toBeDefined();
          const kitBotSlugs = new Set(kit.roles.map((role) => role.botSlug));
          expect(useCase?.botSlugs.every((slug) => kitBotSlugs.has(slug))).toBe(true);
        }
      }
    }

    expect(images.size).toBe(CREW_KITS.length);
  });

  it("gives every Bot Crew workflow an operational guide", () => {
    for (const useCase of BOT_USE_CASES) {
      const operations = getUseCaseOperations(useCase);
      expect(operations.whenToUse).toBeTruthy();
      expect(operations.cadence).toBeTruthy();
      expect(operations.leadBotSlug).toBe(useCase.botSlugs[0]);
      expect(operations.handoffs).toHaveLength(useCase.steps.length - 1);
      expect(operations.successCheckpoint).toBeTruthy();
      expect(operations.recovery).toBeTruthy();
    }
  });
});
