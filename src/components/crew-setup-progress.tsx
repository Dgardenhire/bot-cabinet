"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";

import {
  clearCrewProgress,
  emptyCrewProgress,
  readCrewProgress,
  recordCrewRun,
  saveCrewProgress,
  sendCrewRunOutcomeReport,
  type CrewProgressRecord,
  type CrewRunOutcome,
} from "@/lib/crew-progress";
import styles from "./crew-setup-progress.module.css";

const finalSteps = ["A person approved each handoff", "Schedules remain inactive", "A person reviewed the final deliverable"];

export function CrewSetupProgress({ kitSlug, members, steps }: {
  kitSlug: string;
  members: { slug: string; name: string }[];
  steps: readonly string[];
}) {
  const [record, setRecord] = useState<CrewProgressRecord>(emptyCrewProgress);
  const checkpointIds = useMemo(() => [
    ...members.flatMap(member => steps.map((_, index) => `${member.slug}:${index}`)),
    ...finalSteps.map((_, index) => `crew:${index}`),
  ], [members, steps]);
  const finalCheckpointIds = useMemo(() => finalSteps.map((_, index) => `crew:${index}`), []);

  useEffect(() => {
    const restore = window.requestAnimationFrame(() => {
      setRecord(readCrewProgress(window.localStorage, kitSlug, checkpointIds));
    });
    return () => window.cancelAnimationFrame(restore);
  }, [checkpointIds, kitSlug]);

  const total = members.length * steps.length + finalSteps.length;
  const complete = Object.keys(record.checked).length;
  const cycleReady = complete === total;

  function updateCheckpoint(id: string, checked: boolean) {
    const nextChecked = { ...record.checked };
    if (checked) nextChecked[id] = true;
    else delete nextChecked[id];
    const next = { ...record, checked: nextChecked };
    setRecord(next);
    saveCrewProgress(window.localStorage, kitSlug, next);
  }

  function reportRun(outcome: CrewRunOutcome) {
    if (!cycleReady) return;
    sendCrewRunOutcomeReport(kitSlug, outcome, record.completedRuns, track);
    const next = recordCrewRun(record, outcome, finalCheckpointIds);
    setRecord(next);
    saveCrewProgress(window.localStorage, kitSlug, next);
  }

  function reset() {
    setRecord(clearCrewProgress(window.localStorage, kitSlug));
  }

  function checkbox(id: string, label: string) {
    return <label key={id} className={styles.item}><input type="checkbox" checked={!!record.checked[id]} onChange={event => updateCheckpoint(id, event.target.checked)} /><span>{label}</span></label>;
  }
  return <div className={styles.panel}>
    <p role="status"><strong>{complete} of {total} checkpoints recorded</strong></p>
    <p>These are your confirmations, not automated verification. Progress and completed-cycle counts stay only in this browser; no documents, prompts, or written responses are stored.</p>
    <progress max={total} value={complete} aria-label="Crew setup progress" className={styles.progress} />
    <div className={styles.grid}>{members.map(member => <fieldset key={member.slug} className={styles.member}><legend>{member.name}</legend>{steps.map((step, i) => checkbox(`${member.slug}:${i}`, step))}</fieldset>)}</div>
    <fieldset className={styles.member}><legend>One manual crew cycle</legend>{finalSteps.map((step, i) => checkbox(`crew:${i}`, step))}</fieldset>
    {cycleReady ? <div className={styles.outcome}>
      <p><strong>Did this manual crew cycle produce a useful deliverable?</strong></p>
      <p>Your answer records a first or repeat outcome. It is still your assessment, not independent verification.</p>
      <div>
        <button type="button" onClick={() => reportRun("useful")}>Useful deliverable</button>
        <button type="button" onClick={() => reportRun("needs-work")}>Needs another pass</button>
      </div>
    </div> : null}
    {record.completedRuns > 0 ? <p role="status"><strong>{record.completedRuns} manual {record.completedRuns === 1 ? "cycle" : "cycles"} recorded in this browser.</strong> Last result: {record.lastRunOutcome === "useful" ? "useful deliverable" : "needs another pass"}. Recheck the three manual-cycle items to record another run.</p> : null}
    <button type="button" className={styles.reset} onClick={reset}>Clear this browser’s saved progress</button>
  </div>;
}
