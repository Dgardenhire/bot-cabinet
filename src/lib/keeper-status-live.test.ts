import { describe, expect, it } from "vitest";
import { ageKeeperStatus, keeperSnapshotIsOld, parsePublicKeeperStatus } from "./keeper-status-live";

const checks = [
  { key: "public-site", label: "Pages, links and social cards", result: "passed", last_run: "2026-09-23T11:55:00Z", late_after_hours: 1 },
  { key: "github-public", label: "Public repository and release", result: "passed", last_run: "2026-09-23T11:30:00Z", late_after_hours: 2 },
  { key: "download-inventory", label: "Downloads, packages and file hashes", result: "attention", last_run: "2026-09-23T08:10:36Z", late_after_hours: 36 },
  { key: "agent-watch", label: "Published Agent Watch feed", result: "passed", last_run: "2026-09-23T08:00:00Z", late_after_hours: 36 },
  { key: "agent-landscape", label: "Registered discovery sources", result: "no-record", last_run: null, late_after_hours: 36 },
];

const response = {
  version: 1,
  publication: {
    revision: 1,
    publishedAt: "2026-09-23T12:05:00Z",
    status: { schema: "bot-cabinet-trust-status-candidate/v1", generated_at: "2026-09-23T12:00:00Z", approval_required: true, publication_status: "private-candidate", checks },
  },
};

describe("public Keeper status", () => {
  it("accepts one reviewed five-check publication", () => {
    const parsed = parsePublicKeeperStatus(response);
    expect(parsed?.revision).toBe(1);
    expect(parsed?.checks.find((item) => item.key === "download-inventory")?.result).toBe("attention");
  });

  it("fails closed on missing, duplicated, or unreviewed records", () => {
    expect(parsePublicKeeperStatus({ version: 1, publication: null })).toBeNull();
    expect(parsePublicKeeperStatus({ ...response, publication: { ...response.publication, status: { ...response.publication.status, approval_required: false } } })).toBeNull();
    expect(parsePublicKeeperStatus({ ...response, publication: { ...response.publication, status: { ...response.publication.status, checks: [...checks.slice(0, 4), checks[0]] } } })).toBeNull();
  });

  it("ages old passes without pretending that Keeper stopped or erasing an attention result", () => {
    const parsed = parsePublicKeeperStatus(response)!;
    const recent = ageKeeperStatus(parsed, Date.parse("2026-09-23T12:20:00Z"));
    expect(recent.checks.find((item) => item.key === "public-site")?.result).toBe("passed");
    expect(keeperSnapshotIsOld(parsed, Date.parse("2026-09-23T12:20:00Z"))).toBe(false);

    const older = ageKeeperStatus(parsed, Date.parse("2026-09-25T12:20:00Z"));
    expect(older.checks.filter((item) => item.result === "passed")).toHaveLength(0);
    expect(older.checks.find((item) => item.key === "download-inventory")?.result).toBe("attention");
    expect(older.checks.find((item) => item.key === "agent-landscape")?.result).toBe("no-record");
    expect(older.checks.some((item) => item.result === "not-running")).toBe(false);
    expect(keeperSnapshotIsOld(parsed, Date.parse("2026-09-25T12:20:00Z"))).toBe(true);
  });
});
