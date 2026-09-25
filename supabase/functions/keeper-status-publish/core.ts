import { parseKeeperTrustCandidate, type KeeperTrustCandidate } from "../keeper-status/core.ts";

export type KeeperStatusPublishRequest = {
  status: KeeperTrustCandidate;
  expectedRevision: number;
  contentSha256: string;
  approval: { approvedBy: string; approvedAt: string; note: string };
};

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, sortJson(child)]));
  return value;
}

export function stableStatusJson(status: KeeperTrustCandidate) {
  return JSON.stringify(sortJson(status));
}

export async function parsePublishRequest(value: unknown): Promise<KeeperStatusPublishRequest | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const status = parseKeeperTrustCandidate(candidate.status);
  const approval = candidate.approval as Record<string, unknown> | undefined;
  if (!status || !Number.isInteger(candidate.expectedRevision) || Number(candidate.expectedRevision) < 0) return null;
  if (typeof candidate.contentSha256 !== "string" || !/^[0-9a-f]{64}$/.test(candidate.contentSha256)) return null;
  if (!approval || typeof approval.approvedBy !== "string" || approval.approvedBy.trim().length < 2 || approval.approvedBy.length > 120) return null;
  if (typeof approval.note !== "string" || approval.note.trim().length < 2 || approval.note.length > 500) return null;
  if (typeof approval.approvedAt !== "string" || Number.isNaN(Date.parse(approval.approvedAt))) return null;
  if (await sha256Hex(stableStatusJson(status)) !== candidate.contentSha256) return null;
  return { status, expectedRevision: Number(candidate.expectedRevision), contentSha256: candidate.contentSha256, approval: approval as KeeperStatusPublishRequest["approval"] };
}

export async function secretsMatch(provided: string, expected: string) {
  if (!provided || !expected) return false;
  const [a, b] = await Promise.all([sha256Hex(provided), sha256Hex(expected)]);
  return a === b;
}
