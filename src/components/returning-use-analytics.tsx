"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

import { trackReturningVisit } from "@/lib/first-run-outcome";

/** Records one return visit after a visitor reported a successful first Bot result.
 * This is a revisit signal, not evidence that the Bot was used successfully again.
 */
export function ReturningUseAnalytics() {
  useEffect(() => {
    trackReturningVisit(window.localStorage, track);
  }, []);

  return null;
}
