"use client";

import { track } from "@vercel/analytics";
import { DownloadSimple } from "@phosphor-icons/react";
import { FormEvent, useEffect, useState } from "react";

import {
  THREE_RUN_TRIAL_LIMIT,
  clearThreeRunTrial,
  createThreeRunTrial,
  readThreeRunTrial,
  recordThreeRunTrial,
  saveThreeRunTrial,
  summarizeThreeRunTrial,
  threeRunTrialMarkdown,
  type ThreeRunTrial as ThreeRunTrialRecord,
  type TrialCost,
  type TrialOutcome,
  type TrialRecovery,
  type TrialSupervision,
} from "@/lib/three-run-trial";
import styles from "./three-run-trial.module.css";

const defaultRun = {
  outcome: "used" as TrialOutcome,
  supervision: "under-5" as TrialSupervision,
  cost: "unknown" as TrialCost,
  recovery: "not-needed" as TrialRecovery,
};

function quietlyTrack(event: string, properties?: Record<string, string | number>) {
  try {
    track(event, { surface: "three_run_trial", ...properties });
  } catch {
    // The browser-private trial remains useful when analytics is unavailable.
  }
}

export function ThreeRunTrial() {
  const [ready, setReady] = useState(false);
  const [trial, setTrial] = useState<ThreeRunTrialRecord>();
  const [draft, setDraft] = useState({ job: "", tool: "", successStandard: "" });
  const [run, setRun] = useState(defaultRun);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTrial(readThreeRunTrial(window.localStorage));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function startTrial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = createThreeRunTrial(draft);
    if (!next) return;
    setTrial(saveThreeRunTrial(window.localStorage, next));
    quietlyTrack("agent_trial_started");
  }

  function addRun(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trial || trial.runs.length >= THREE_RUN_TRIAL_LIMIT) return;
    const next = recordThreeRunTrial(trial, run);
    setTrial(saveThreeRunTrial(window.localStorage, next));
    quietlyTrack("agent_trial_run_recorded", { run: next.runs.length, outcome: run.outcome });
    if (next.runs.length === THREE_RUN_TRIAL_LIMIT) quietlyTrack("agent_trial_completed");
    setRun(defaultRun);
  }

  function exportTrial() {
    if (!trial) return;
    const blob = new Blob([threeRunTrialMarkdown(trial)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bot-cabinet-three-run-trial.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    quietlyTrack("agent_trial_exported", { runs: trial.runs.length });
  }

  function resetTrial() {
    if (!window.confirm("Clear this browser’s three-run trial and start another?")) return;
    clearThreeRunTrial(window.localStorage);
    setTrial(undefined);
    setDraft({ job: "", tool: "", successStandard: "" });
    setRun(defaultRun);
  }

  if (!ready) return <p className={styles.loading} role="status">Loading this browser’s three-run trial…</p>;

  if (!trial) return (
    <form className={styles.panel} onSubmit={startTrial}>
      <div className={styles.heading}>
        <div><span>One recurring job · three real uses</span><h2>Start a Three-Run Trial</h2></div>
        <strong>Browser-private</strong>
      </div>
      <p>Test the job you care about in the tool you already have. Bot Cabinet stores these fields only in this browser and never sends their contents to analytics.</p>
      <div className={styles.fields}>
        <label>Recurring job<input required maxLength={100} value={draft.job} onChange={event => setDraft({ ...draft, job: event.target.value })} placeholder="Example: prepare my Monday client brief" /></label>
        <label>Tool or agent<input required maxLength={80} value={draft.tool} onChange={event => setDraft({ ...draft, tool: event.target.value })} placeholder="Example: Hermes, Grok Bot, Muse or another tool" /></label>
        <label className={styles.wide}>What counts as a useful result?<input required maxLength={180} value={draft.successStandard} onChange={event => setDraft({ ...draft, successStandard: event.target.value })} placeholder="A specific result you would actually use" /></label>
      </div>
      <p className={styles.privacy}>Use a short label, not confidential task content. This is your record—not independent Cabinet verification.</p>
      <button className="button button-primary" type="submit">Begin the three-run trial</button>
    </form>
  );

  const summary = summarizeThreeRunTrial(trial);
  const complete = trial.runs.length >= THREE_RUN_TRIAL_LIMIT;

  return (
    <div className={styles.panel}>
      <div className={styles.heading}>
        <div><span>Three-Run Trial</span><h2>{trial.job}</h2><p>{trial.tool}</p></div>
        <strong>{summary.completed}/{THREE_RUN_TRIAL_LIMIT} runs</strong>
      </div>
      <p><strong>Useful means:</strong> {trial.successStandard}</p>

      {trial.runs.length ? (
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Run</th><th>Result</th><th>Supervision</th><th>Cost</th><th>Recovery</th></tr></thead>
            <tbody>{trial.runs.map(item => (
              <tr key={item.run}>
                <td>{item.run}</td>
                <td>{item.outcome === "used" ? "Used as delivered" : item.outcome === "revised" ? "Used after revision" : "Not used"}</td>
                <td>{item.supervision === "under-5" ? "Under 5 min" : item.supervision === "5-15" ? "5–15 min" : item.supervision === "16-30" ? "16–30 min" : "Over 30 min"}</td>
                <td>{item.cost === "none-known" ? "$0 known" : item.cost === "under-1" ? "Under $1" : item.cost === "1-5" ? "$1–$5" : item.cost === "over-5" ? "Over $5" : "Unknown"}</td>
                <td>{item.recovery === "not-needed" ? "No interruption" : item.recovery === "recovered" ? "Recovered" : "Did not recover"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : null}

      {!complete ? (
        <form className={styles.runForm} onSubmit={addRun}>
          <h3>Record run {trial.runs.length + 1}</h3>
          <div className={styles.runFields}>
            <label>Was the output used?<select value={run.outcome} onChange={event => setRun({ ...run, outcome: event.target.value as TrialOutcome })}><option value="used">Used as delivered</option><option value="revised">Used after revision</option><option value="discarded">Not used</option></select></label>
            <label>Human supervision<select value={run.supervision} onChange={event => setRun({ ...run, supervision: event.target.value as TrialSupervision })}><option value="under-5">Under 5 minutes</option><option value="5-15">5–15 minutes</option><option value="16-30">16–30 minutes</option><option value="over-30">More than 30 minutes</option></select></label>
            <label>Known run cost<select value={run.cost} onChange={event => setRun({ ...run, cost: event.target.value as TrialCost })}><option value="unknown">Unknown</option><option value="none-known">$0 known marginal cost</option><option value="under-1">Under $1</option><option value="1-5">$1–$5</option><option value="over-5">Over $5</option></select></label>
            <label>Interruption recovery<select value={run.recovery} onChange={event => setRun({ ...run, recovery: event.target.value as TrialRecovery })}><option value="not-needed">No interruption</option><option value="recovered">Interrupted and recovered</option><option value="failed">Interrupted and did not recover</option></select></label>
          </div>
          <button className="button button-primary" type="submit">Save run {trial.runs.length + 1}</button>
        </form>
      ) : (
        <div className={styles.summary}>
          <h3>Three real uses recorded</h3>
          <p>{summary.delivered} used as delivered · {summary.revised} used after revision · {summary.discarded} not used</p>
          <p>This small trial describes your three attempts. It does not establish general reliability or prove that another person will get the same result.</p>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className="button button-secondary" onClick={exportTrial}><DownloadSimple size={16} aria-hidden="true" /> Download Markdown record</button>
        <button type="button" className={styles.reset} onClick={resetTrial}>Clear and start another trial</button>
      </div>
    </div>
  );
}
