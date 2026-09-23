import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { KeeperTrustStatusTable } from "./keeper-trust-status";
import { KEEPER_TRUST_FALLBACK } from "@/lib/keeper-status-live";

describe("Keeper Trust status table", () => {
  it("shows unknown rather than a false green result before a reviewed publication exists", () => {
    const html = renderToStaticMarkup(<KeeperTrustStatusTable fallback={KEEPER_TRUST_FALLBACK} />);
    expect(html).toContain("Not connected yet");
    expect(html.match(/No public record/g)?.length).toBe(5);
    expect(html).not.toContain("status-passed");
  });
});
