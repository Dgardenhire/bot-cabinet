import type { BeforeSendEvent } from "@vercel/analytics";

/**
 * A Starter Pack access token, after a plain or percent-encoded "#access=". Some email link tracking encodes the "#",
 * which puts the token in the page path instead of the fragment.
 */
const PACK_TOKEN = /(#|%23|%2523)access(=|%3D)[^&#?/]+/gi;

/** Matches an encoded pack token in a page path and captures the token, for the 404 page's redirect. */
export const ENCODED_PACK_TOKEN_IN_PATH = /(?:%23|%2523)access(?:=|%3D)([^/?#]+)/i;

const INTERNAL_KEY = "bot-cabinet-internal";

/** Replaces any Starter Pack access token in a URL, so tokens never reach analytics. */
export function redactPackToken(url: string): string {
  return url.replace(PACK_TOKEN, "$1access$2redacted");
}

/** The repaired Starter Pack link for a 404 path that holds an encoded token, or null. */
export function rescuedPackLink(pathname: string): string | null {
  const match = pathname.match(ENCODED_PACK_TOKEN_IN_PATH);
  return match ? `/starter-pack/#access=${match[1]}` : null;
}

/**
 * Opening any page with ?bc_internal=1 marks this browser as internal (an audit or test session) until it opens a
 * page with ?bc_internal=0. Events from an internal browser are not sent.
 */
export function isInternalBrowser(url: string, storage: Storage | undefined): boolean {
  let flag: string | null = null;
  try { flag = new URL(url).searchParams.get("bc_internal"); } catch { /* Not a full URL; nothing to read. */ }
  try {
    if (flag === "1") storage?.setItem(INTERNAL_KEY, "1");
    if (flag === "0") storage?.removeItem(INTERNAL_KEY);
    return flag === "1" || storage?.getItem(INTERNAL_KEY) === "1";
  } catch {
    return flag === "1"; // Private browser settings may disable storage.
  }
}

export function filterAnalyticsEvent(event: BeforeSendEvent, storage: Storage | undefined): BeforeSendEvent | null {
  if (isInternalBrowser(event.url, storage)) return null;
  return { ...event, url: redactPackToken(event.url) };
}

/** The beforeSend hook for Vercel Web Analytics. */
export function analyticsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  let storage: Storage | undefined;
  try { storage = window.localStorage; } catch { /* Private browser settings may disable storage. */ }
  return filterAnalyticsEvent(event, storage);
}
