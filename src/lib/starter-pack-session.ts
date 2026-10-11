const KEY = "bot-cabinet:starter-pack-access";
export const PACK_SESSION_TTL_MS = 30 * 60 * 1000;
type SessionStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function forgetPackSession(storage?: SessionStore) {
  try { storage?.removeItem(KEY); } catch { /* Storage may be unavailable. */ }
}
export function readPackSession(storage?: SessionStore, now = Date.now()): { token: string; expiresAt: number } | null {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (typeof value.token === "string" && /^[A-Za-z0-9_-]{43}$/.test(value.token) && Number.isFinite(value.expiresAt) && value.expiresAt > now && value.expiresAt <= now + PACK_SESSION_TTL_MS) return { token: value.token, expiresAt: value.expiresAt };
  } catch { /* Invalid or unavailable storage never grants access. */ }
  forgetPackSession(storage);
  return null;
}
export function rememberPackSession(token: string, storage?: SessionStore, now = Date.now()) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return;
  try {
    if (!storage) return undefined;
    const expiresAt = now + PACK_SESSION_TTL_MS;
    storage.setItem(KEY, JSON.stringify({ token, expiresAt }));
    return expiresAt;
  } catch { /* The current in-memory view still works. */ }
}
