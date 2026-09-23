export type KeeperTrustResult = "passed" | "attention" | "late" | "not-running" | "no-record";

export type KeeperTrustCheck = {
  key: string;
  label: string;
  result: KeeperTrustResult;
  last_run: string | null;
  late_after_hours: number;
};

export type KeeperTrustCandidate = {
  schema: "bot-cabinet-trust-status-candidate/v1";
  generated_at: string;
  approval_required: true;
  publication_status: "private-candidate";
  checks: KeeperTrustCheck[];
};

type PublicationRow = { revision: number; payload: unknown; published_at: string };

const results = new Set<KeeperTrustResult>(["passed", "attention", "late", "not-running", "no-record"]);
const expectedKeys = new Set(["public-site", "github-public", "download-inventory", "agent-watch", "agent-landscape"]);

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function parseCheck(value: unknown): KeeperTrustCheck | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (typeof item.key !== "string" || !expectedKeys.has(item.key)) return null;
  if (typeof item.label !== "string" || item.label.trim().length < 3 || item.label.length > 160) return null;
  if (!results.has(item.result as KeeperTrustResult)) return null;
  if (item.last_run !== null && !isTimestamp(item.last_run)) return null;
  if (!Number.isInteger(item.late_after_hours) || Number(item.late_after_hours) < 1 || Number(item.late_after_hours) > 168) return null;
  return item as KeeperTrustCheck;
}

export function parseKeeperTrustCandidate(value: unknown): KeeperTrustCandidate | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (item.schema !== "bot-cabinet-trust-status-candidate/v1") return null;
  if (!isTimestamp(item.generated_at) || item.approval_required !== true || item.publication_status !== "private-candidate") return null;
  if (!Array.isArray(item.checks) || item.checks.length !== expectedKeys.size) return null;
  const checks = item.checks.map(parseCheck);
  if (checks.some((check) => !check)) return null;
  if (new Set(checks.map((check) => check!.key)).size !== expectedKeys.size) return null;
  return item as unknown as KeeperTrustCandidate;
}

export function latestPublication(rows: PublicationRow[]) {
  for (const row of [...rows].sort((a, b) => b.revision - a.revision)) {
    const status = parseKeeperTrustCandidate(row.payload);
    if (status) return { revision: row.revision, publishedAt: row.published_at, status };
  }
  return null;
}
