"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

/**
 * Records only deliberate product-funnel actions marked with data attributes.
 * Bot names, job descriptions, form contents, and other visitor-entered text are
 * deliberately excluded from these events.
 */
export function FunnelAnalytics() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const action = target.closest<HTMLElement>("[data-funnel-event]");
      if (!action?.dataset.funnelEvent) return;

      track(action.dataset.funnelEvent, {
        surface: action.dataset.funnelSurface ?? "site",
        destination: action.dataset.funnelDestination ?? undefined,
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
