export type KeeperTrustResult = "passed" | "attention" | "late" | "not-running" | "no-record";

export type KeeperTrustCheck = {
  key: string;
  label: string;
  result: KeeperTrustResult;
  lastRun: string | null;
  lateAfterHours: number;
};

export type KeeperTrustStatus = {
  revision: number | null;
  publishedAt: string | null;
  generatedAt: string | null;
  checks: KeeperTrustCheck[];
};

export const KEEPER_STATUS_API_URL = "https://mdjchixwgvicovkwrgle.supabase.co/functions/v1/keeper-status";

export const KEEPER_TRUST_FALLBACK: KeeperTrustStatus = {
  revision: null,
  publishedAt: null,
  generatedAt: null,
  checks: [
    { key: "public-site", label: "Pages, links and social cards", result: "no-record", lastRun: null, lateAfterHours: 1 },
    { key: "github-public", label: "Public repository and release", result: "no-record", lastRun: null, lateAfterHours: 2 },
    { key: "download-inventory", label: "Downloads, packages and file hashes", result: "no-record", lastRun: null, lateAfterHours: 36 },
    { key: "agent-watch", label: "Published Agent Watch feed", result: "no-record", lastRun: null, lateAfterHours: 36 },
    { key: "agent-landscape", label: "Registered discovery sources", result: "no-record", lastRun: null, lateAfterHours: 36 },
  ],
};

const results = new Set<KeeperTrustResult>(["passed", "attention", "late", "not-running", "no-record"]);
const expectedKeys = new Set(KEEPER_TRUST_FALLBACK.checks.map((item) => item.key));

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function parsePublicKeeperStatus(value: unknown): KeeperTrustStatus | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const publication = (value as { publication?: unknown }).publication;
  if (!publication || typeof publication !== "object" || Array.isArray(publication)) return null;
  const row = publication as Record<string, unknown>;
  const status = row.status;
  if (!status || typeof status !== "object" || Array.isArray(status)) return null;
  const candidate = status as Record<string, unknown>;
  if (candidate.schema !== "bot-cabinet-trust-status-candidate/v1" || candidate.approval_required !== true) return null;
  if (!Number.isInteger(row.revision) || Number(row.revision) < 1 || !isTimestamp(row.publishedAt) || !isTimestamp(candidate.generated_at)) return null;
  if (!Array.isArray(candidate.checks) || candidate.checks.length !== expectedKeys.size) return null;
  const checks = candidate.checks.flatMap((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
    const item = raw as Record<string, unknown>;
    if (typeof item.key !== "string" || !expectedKeys.has(item.key)) return [];
    if (typeof item.label !== "string" || !item.label.trim() || !results.has(item.result as KeeperTrustResult)) return [];
    if (item.last_run !== null && !isTimestamp(item.last_run)) return [];
    if (!Number.isInteger(item.late_after_hours) || Number(item.late_after_hours) < 1) return [];
    return [{ key: item.key, label: item.label, result: item.result as KeeperTrustResult, lastRun: item.last_run as string | null, lateAfterHours: Number(item.late_after_hours) }];
  });
  if (checks.length !== expectedKeys.size || new Set(checks.map((item) => item.key)).size !== expectedKeys.size) return null;
  return { revision: Number(row.revision), publishedAt: row.publishedAt as string, generatedAt: candidate.generated_at as string, checks };
}
