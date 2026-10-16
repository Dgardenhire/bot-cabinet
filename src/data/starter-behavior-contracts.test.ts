import { describe, expect, it } from "vitest";
import { STARTER_BOTS } from "./starter-bots";
import { starterBotToPortablePackV2 } from "../lib/portable-bot-pack-v2";

describe("first-answer regression instructions reach the downloadable role", () => {
  it("Receipt explicitly asks for a missing promise date before calculating lateness", () => {
    const bot = STARTER_BOTS.find(bot => bot.slug === "receipt")!;
    const role = starterBotToPortablePackV2(bot).instructions.durableRoleAndBoundaries;
    expect(role).toContain("Ask the user for the date of an undated promise");
    expect(role).toContain("Do not assume that a promised refund has been processed");
  });

  it("Coach does not turn offers into commitments or infer available capacity", () => {
    const bot = STARTER_BOTS.find(bot => bot.slug === "coach")!;
    const role = starterBotToPortablePackV2(bot).instructions.durableRoleAndBoundaries;
    expect(role).toContain("An offer or invitation is not an accepted commitment");
    expect(role).toContain("Do not invent the user's energy level");
  });

  it("Professor preserves fictional labels and separates reported ability from tested progress", () => {
    const bot = STARTER_BOTS.find(bot => bot.slug === "professor")!;
    const role = starterBotToPortablePackV2(bot).instructions.durableRoleAndBoundaries;
    expect(role).toContain("Preserve any fictional or synthetic label");
    expect(role).toContain("Do not record successful learning or mastery");
  });
});
