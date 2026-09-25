"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";

import {
  BOT_MAX_RECORDED_RUNS,
  BOT_CHECKPOINT_IDS,
  BOT_RUN_CHECKPOINT_IDS,
  clearBotProgress,
  emptyBotProgress,
  markBotProgressStarted,
  readBotProgress,
  recordBotRun,
  saveBotProgress,
  sendBotWorkbenchStartedReport,
  sendBotRunOutcomeReport,
  type BotProgressRecord,
  type BotRunOutcome,
} from "@/lib/bot-progress";
import styles from "./bot-workbench.module.css";

const setupSteps = [
  { id: "downloaded", label: "I downloaded and inspected this Bot’s files." },
  { id: "imported", label: "I imported the profile without replacing an existing Bot." },
  { id: "access-reviewed", label: "I reviewed its requested access and kept only what this job needs." },
] as const;

const runSteps = [
  { id: "task-run", label: "I ran one real, bounded task with material I was comfortable using." },
  { id: "result-reviewed", label: "I checked the result, sources and requested actions before using it." },
] as const;

const checkpointIds = BOT_CHECKPOINT_IDS;
const runCheckpointIds = BOT_RUN_CHECKPOINT_IDS;

export function BotWorkbench({ botSlug, botName, packVersion }: {
  botSlug: string;
  botName: string;
  packVersion: string;
}) {
  const [record, setRecord] = useState<BotProgressRecord>(() => emptyBotProgress(packVersion));
  const complete = Object.keys(record.checked).length;
  const cycleReady = complete === checkpointIds.length;
  const runLimitReached = record.runs.length >= BOT_MAX_RECORDED_RUNS;
  const nextRun = record.runs.length + 1;

  useEffect(() => {
    const restore = window.requestAnimationFrame(() => {
      setRecord(readBotProgress(window.localStorage, botSlug, packVersion, checkpointIds));
    });
    return () => window.cancelAnimationFrame(restore);
  }, [botSlug, packVersion]);

  const outcomeSummary = useMemo(() => record.runs.map(run => (
    `Run ${run.run}: ${run.outcome === "useful" ? "useful" : "needed work"}`
  )), [record.runs]);

  function updateCheckpoint(id: string, checked: boolean) {
    const nextChecked = { ...record.checked };
    if (checked) nextChecked[id] = true;
    else delete nextChecked[id];
    let next = { ...record, checked: nextChecked };
    if (checked && !record.started) {
      sendBotWorkbenchStartedReport(botSlug, packVersion, false, track);
      next = markBotProgressStarted(next);
    }
    setRecord(next);
    saveBotProgress(window.localStorage, botSlug, next);
  }

  function reportRun(outcome: BotRunOutcome) {
    if (!cycleReady || runLimitReached) return;
    sendBotRunOutcomeReport(botSlug, packVersion, outcome, record.runs.length, track);
    const next = recordBotRun(record, outcome, runCheckpointIds);
    setRecord(next);
    saveBotProgress(window.localStorage, botSlug, next);
  }

  function reset() {
    setRecord(clearBotProgress(window.localStorage, botSlug, packVersion));
  }

  function checklist(items: readonly { id: string; label: string }[]) {
    return items.map(item => (
      <label className={styles.item} key={item.id}>
        <input type="checkbox" checked={Boolean(record.checked[item.id])} onChange={event => updateCheckpoint(item.id, event.target.checked)} />
        <span>{item.label}</span>
      </label>
    ));
  }

  return (
    <div id="bot-workbench" className={styles.panel} aria-label={`${botName} workbench`}>
      <div className={styles.heading}>
        <div><span>Your Bot workbench</span><h3>Continue after the download</h3></div>
        <small>Pack {packVersion}</small>
      </div>
      <p><strong>{complete} of {checkpointIds.length} current-cycle checkpoints recorded.</strong> These are your confirmations, not independent Cabinet verification. Progress stays in this browser.</p>
      <progress className={styles.progress} max={checkpointIds.length} value={complete} aria-label={`${botName} setup and run progress`} />
      <div className={styles.grid}>
        <fieldset><legend>Set up once</legend>{checklist(setupSteps)}</fieldset>
        <fieldset><legend>Check each real run</legend>{checklist(runSteps)}</fieldset>
      </div>
      {cycleReady && !runLimitReached ? (
        <div className={styles.outcome}>
          <p><strong>Was real run {nextRun} useful?</strong></p>
          <p>Record the outcome—not the task or its contents. The two run checks reset after your answer; setup stays checked.</p>
          <div>
            <button type="button" onClick={() => reportRun("useful")}>Useful result</button>
            <button type="button" onClick={() => reportRun("needs-work")}>Needed another pass</button>
          </div>
        </div>
      ) : null}
      {outcomeSummary.length ? <p className={styles.history} role="status"><strong>Real-use history:</strong> {outcomeSummary.join(" · ")}</p> : null}
      {runLimitReached ? <p className={styles.limit}><strong>Three outcomes recorded.</strong> This workbench stops here: it is a bounded usefulness signal, not a permanent activity log.</p> : null}
      <div className={styles.footerActions}>
        <a href="/workbench" data-funnel-event="bot_workbench_hub_open" data-funnel-surface="bot_detail" data-funnel-destination={botSlug}>View all my active Bots</a>
        <button type="button" className={styles.reset} onClick={reset}>Clear this browser’s {botName} progress</button>
      </div>
    </div>
  );
}
