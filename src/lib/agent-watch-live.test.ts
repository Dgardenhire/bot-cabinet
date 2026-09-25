import { describe, expect, it } from "vitest";
import { mergeWatchItems, parsePublicWatchFeed, parsePublicWatchItem } from "./agent-watch-live";
import type { AgentWatchItem } from "@/data/agent-watch";

const item: AgentWatchItem = {
  slug: "useful-agent",
  observedOn: "2026-09-20",
  reviewAgainBy: "2026-10-04",
  title: "Useful agent",
  signal: "Something changed.",
  evidence: "observed",
  whyItMatters: "It may help.",
  cabinetResponse: "We reviewed it.",
  responseStatus: "published",
  limits: "It is not fully tested.",
  sources: [{ label: "Official", href: "https://example.com" }],
  botDetails: {
    name: "Useful Bot",
    creator: "A maker",
    platform: "Example",
    job: "Handles one useful job.",
    requiredAccess: "An account and one selected file.",
    outsideActions: "None during the first test.",
    evidenceStatus: "inspected",
    cabinetDecision: "test-adaptation",
    cabinetFit: "Test it before deciding whether to add it.",
    closestCabinetMatch: { label: "Scout", href: "/bots/scout" },
  },
};

describe("live Agent Watch feed", () => {
  it("accepts reviewed feed items and rejects unsafe links", () => {
    expect(parsePublicWatchFeed({ items: [item] })).toEqual([item]);
    expect(parsePublicWatchItem({ ...item, sources: [{ label: "bad", href: "javascript:alert(1)" }] })).toBeNull();
    expect(parsePublicWatchItem({ ...item, botDetails: { ...item.botDetails, job: "" } })).toBeNull();
    expect(parsePublicWatchItem({ ...item, botDetails: { ...item.botDetails, closestCabinetMatch: { label: "bad", href: "javascript:alert(1)" } } })).toBeNull();
    expect(parsePublicWatchItem({ ...item, botDetails: { ...item.botDetails, evidenceStatus: "downloaded" } })).toBeNull();
    expect(parsePublicWatchItem({ ...item, botDetails: { ...item.botDetails, cabinetDecision: "copy-it" } })).toBeNull();
  });

  it("uses a newer live revision and keeps the fallback if the feed is down", () => {
    const revised = { ...item, observedOn: "2026-09-21", title: "Revised" };
    expect(mergeWatchItems([revised], [item])).toEqual([revised]);
    expect(mergeWatchItems([], [item])).toEqual([item]);
  });

  it("keeps internal analytics notes out of the public page", () => {
    const retired = { ...item, slug: "bounce-rate-is-not-useful-action" };
    expect(mergeWatchItems([retired], [item])).toEqual([item]);
  });
});
