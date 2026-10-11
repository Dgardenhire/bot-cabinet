export const NEWSLETTER_ORIGIN = "https://ai-seminar.linchpin.studio";
export const ACCESS_REQUEST_URL = `${NEWSLETTER_ORIGIN}/api/starter-pack-access`;
export const PACK_CONTENT_URL = `${NEWSLETTER_ORIGIN}/api/starter-pack`;
export type StarterPackEntry = {
  id: string; number: number; title: string; subtitle: string; audience: string;
  setup_time: string; bot_type: string; app_fit: string; status: string;
  where: string; general: string; prompt: string; first: string;
  guardrails: string[]; watch: string; tested: string;
};
export type StarterPack = {
  intro: string[]; pick: string[]; ground_rules: string[];
  types: string[]; platforms: string[]; entries: StarterPackEntry[];
};
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === "string");
export function isStarterPack(value: unknown): value is StarterPack {
  if (!value || typeof value !== "object") return false;
  const pack = value as Record<string, unknown>;
  if (!["intro", "pick", "ground_rules", "types", "platforms"].every(key => strings(pack[key]))) return false;
  return Array.isArray(pack.entries) && pack.entries.length === 10 && pack.entries.every(entry => {
    if (!entry || typeof entry !== "object") return false;
    return ["id", "title", "subtitle", "audience", "setup_time", "bot_type", "app_fit", "status", "where", "general", "prompt", "first", "watch", "tested"].every(key => typeof entry[key] === "string") &&
      typeof entry.number === "number" && strings(entry.guardrails);
  });
}
export async function requestStarterPack(email: string, name: string, fetcher: typeof fetch = fetch) {
  const response = await fetcher(ACCESS_REQUEST_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), name: name.trim() }),
  });
  if (response.status === 429) throw new Error("Please wait a few minutes before trying again.");
  if (!response.ok) throw new Error("We couldn’t request your pack. Please try again.");
  const result = await response.json();
  if (result.accepted !== true) throw new Error("We couldn’t request your pack. Please try again.");
}
export class PackAccessError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}
export async function loadStarterPack(token: string, fetcher: typeof fetch = fetch): Promise<StarterPack> {
  const response = await fetcher(PACK_CONTENT_URL, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  if (response.status === 401 || response.status === 403) throw new PackAccessError("This access link has expired or is invalid. Request a fresh link below.", response.status);
  if (!response.ok) throw new Error("Your pack couldn’t load. Please reopen your email link to try again.");
  const result = await response.json();
  if (!isStarterPack(result)) throw new Error("Your pack couldn’t load. Please try again later.");
  return result;
}
