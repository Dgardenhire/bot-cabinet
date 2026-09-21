"use client";

import { track } from "@vercel/analytics";
import { CheckCircle, ClockCounterClockwise } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import {
  beginAgentWatchVisit,
  markAgentWatchSeen,
  type AgentWatchProgress,
} from "@/lib/agent-watch-progress";
import styles from "./agent-watch-visit-status.module.css";

type VisitState = {
  record: AgentWatchProgress;
  firstVisit: boolean;
  newSlugs: string[];
};

export function AgentWatchVisitStatus({ slugs }: { slugs: readonly string[] }) {
  const [state, setState] = useState<VisitState>();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const visit = beginAgentWatchVisit(window.localStorage, slugs);
      setState(visit);
      if (visit.returnVisit) {
        try {
          track("agent_watch_return_visit", {
            surface: "agent_watch",
            newNotes: visit.newSlugs.length,
          });
        } catch {
          // Update status remains useful when analytics is unavailable.
        }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [slugs]);

  if (!state) return <p className={styles.loading} role="status">Checking this browser for new Agent Watch notes…</p>;

  function markSeen() {
    if (!state) return;
    const record = markAgentWatchSeen(window.localStorage, state.record, slugs);
    setState({ ...state, record, newSlugs: [] });
    try {
      track("agent_watch_notes_marked_seen", { surface: "agent_watch" });
    } catch {
      // The browser-private seen state does not depend on analytics.
    }
  }

  if (state.firstVisit) return (
    <div className={styles.panel} role="status">
      <ClockCounterClockwise size={21} aria-hidden="true" />
      <p><strong>First saved visit in this browser.</strong> Future field notes will be counted here. This does not create an account or sync between devices.</p>
    </div>
  );

  if (!state.newSlugs.length) return (
    <div className={styles.panel} role="status">
      <CheckCircle size={21} aria-hidden="true" />
      <p><strong>You are caught up in this browser.</strong> Agent Watch will flag newly added notes on a later visit.</p>
    </div>
  );

  return (
    <div className={`${styles.panel} ${styles.hasUpdates}`} role="status">
      <ClockCounterClockwise size={21} aria-hidden="true" />
      <p><strong>{state.newSlugs.length} new {state.newSlugs.length === 1 ? "field note" : "field notes"} since this browser’s saved visit.</strong> New means newly listed here—not independently verified or necessarily important to your work.</p>
      <button type="button" onClick={markSeen}>Mark current notes as seen</button>
    </div>
  );
}
