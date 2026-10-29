import { describe, expect, it } from "vitest";
import { sendPackRequest } from "./pack-access";

describe("Starter Pack signup event", () => {
  it("records one signup event after the request succeeds, with no email or name", async () => {
    const events: Array<[string, Record<string, string>]> = [];
    await sendPackRequest("reader@example.com", "Reader", async () => undefined, (event, properties) => { events.push([event, properties]); });
    expect(events).toEqual([["starter_pack_requested", { surface: "starter_pack" }]]);
    expect(JSON.stringify(events)).not.toMatch(/reader|example\.com/i);
  });

  it("records nothing when the request fails", async () => {
    const events: string[] = [];
    await expect(sendPackRequest("reader@example.com", "", async () => { throw new Error("Please try again."); }, (event) => { events.push(event); })).rejects.toThrow("Please try again.");
    expect(events).toEqual([]);
  });
});
