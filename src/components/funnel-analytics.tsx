"use client";

import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";
import { analyticsBeforeSend, redactPackToken } from "@/lib/analytics-filter";

const LINCHPIN_HOST = /(^|\.)linchpin\.studio$/i;

/** The host and path of a link to a LINCHPIN site, or null for any other link. Query strings and fragments are dropped. */
export function linchpinExitDestination(href: string, base: string): string | null {
  let url: URL;
  try { url = new URL(href, base); } catch { return null; }
  if ((url.protocol !== "https:" && url.protocol !== "http:") || !LINCHPIN_HOST.test(url.hostname)) return null;
  return url.hostname + url.pathname;
}

/**
 * Records only deliberate product-funnel actions marked with data attributes, plus exits to LINCHPIN sites that have
 * no event of their own. Bot names, job descriptions, form contents, and other visitor-entered text are
 * deliberately excluded from these events.
 */
export function FunnelAnalytics() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const action = target.closest<HTMLElement>("[data-funnel-event]");
      if (action?.dataset.funnelEvent) {
        track(action.dataset.funnelEvent, {
          surface: action.dataset.funnelSurface ?? "site",
          destination: action.dataset.funnelDestination ?? undefined,
        });
        return;
      }

      const href = target.closest("a[href]")?.getAttribute("href");
      const destination = href ? linchpinExitDestination(href, window.location.href) : null;
      if (destination) track("linchpin_exit", { surface: redactPackToken(window.location.pathname), destination });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}

/** Vercel Web Analytics with Starter Pack tokens removed and internal sessions skipped. */
export function SiteAnalytics() {
  return <Analytics beforeSend={analyticsBeforeSend} />;
}
