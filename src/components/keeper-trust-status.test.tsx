import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { KeeperTrustStatusTable, keeperRecheckNotice } from "./keeper-trust-status";
import { KEEPER_TRUST_FALLBACK, type KeeperTrustStatus } from "@/lib/keeper-status-live";

const septemberSnapshot: KeeperTrustStatus = {
  revision: 1,
  publishedAt: "2026-09-25T06:47:51.567267+00:00",
  generatedAt: "2026-09-25T06:30:36+00:00",
  checks: KEEPER_TRUST_FALLBACK.checks.map((check) => ({ ...check, result: "passed", lastRun: "2026-09-25T06:20:37+00:00" })),
};

describe("Keeper Trust status table", () => {
  it("says no recent checks are shown, links the Proof Room and claims no re-run, before scripts run", () => {
    const html = renderToStaticMarkup(<KeeperTrustStatusTable fallback={KEEPER_TRUST_FALLBACK} builtAt={Date.parse("2026-10-27T18:00:00Z")} />);
    expect(html).toContain("No recent reviewed site checks to show. Each Bot’s own test record in the <a href=\"/proof\">Proof Room</a> shows its date.");
    expect(html).not.toContain("re-run");
    expect(html).not.toContain("No reviewed Keeper results have been published");
    expect(html).not.toContain("No results published yet");
    expect(html).not.toContain("keeper-trust-status-row");
    expect(html).not.toContain("status-passed");
  });

  it("hides the dated rows when the newest reviewed snapshot is more than 14 days old", () => {
    expect(keeperRecheckNotice(septemberSnapshot, Date.parse("2026-10-27T18:00:00Z"))).toBe(
      "The last reviewed site checks, from September 25, 2026, are too old to rely on, so they are hidden.",
    );
    expect(keeperRecheckNotice(septemberSnapshot, Date.parse("2026-10-09T06:47:52Z"))).not.toBeNull();
  });

  it("keeps the table for a reviewed snapshot from the last 14 days", () => {
    expect(keeperRecheckNotice(septemberSnapshot, Date.parse("2026-09-30T12:00:00Z"))).toBeNull();
    expect(keeperRecheckNotice(septemberSnapshot, Date.parse("2026-10-09T06:47:51Z"))).toBeNull();
  });

  it("judges age from the build time before scripts run", () => {
    const fresh = renderToStaticMarkup(<KeeperTrustStatusTable fallback={septemberSnapshot} builtAt={Date.parse("2026-09-30T12:00:00Z")} />);
    expect(fresh).toContain("keeper-trust-status-row");
    const stale = renderToStaticMarkup(<KeeperTrustStatusTable fallback={septemberSnapshot} builtAt={Date.parse("2026-10-27T18:00:00Z")} />);
    expect(stale).not.toContain("keeper-trust-status-row");
    expect(stale).toContain("from September 25, 2026, are too old to rely on, so they are hidden.");
  });
});
