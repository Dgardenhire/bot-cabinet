"use client";

import { CheckCircle, Wrench } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

import {
  nextRepeatBotRun,
  readFirstBotRunRecord,
  reportRepeatBotRun,
  type RepeatBotRunNumber,
  type RepeatBotRunOutcome,
} from "@/lib/first-run-outcome";

export function RepeatUsePrompt() {
  const [run, setRun] = useState<RepeatBotRunNumber>();
  const [reported, setReported] = useState<RepeatBotRunOutcome>();

  useEffect(() => {
    const restore = window.requestAnimationFrame(() => {
      setRun(nextRepeatBotRun(readFirstBotRunRecord(window.localStorage)));
    });
    return () => window.cancelAnimationFrame(restore);
  }, []);

  if (!run) return null;

  function report(outcome: RepeatBotRunOutcome) {
    if (reported) return;
    const result = reportRepeatBotRun(window.localStorage, outcome, track);
    if (!result) return;
    setReported(outcome);
  }

  return (
    <section className="repeat-use-prompt" aria-labelledby="repeat-use-question">
      <div>
        <span>Real-use check · Run {run} of 3</span>
        <h2 id="repeat-use-question">Did you use this Bot again for a real job?</h2>
        <p>Report the outcome, not the task or its contents. This distinguishes repeat usefulness from simply revisiting the site.</p>
      </div>
      <div className="first-run-outcome-actions" role="group" aria-label={`Report Bot run ${run}`}>
        <button type="button" onClick={() => report("usable")} aria-pressed={reported === "usable"} disabled={Boolean(reported)}>
          <CheckCircle size={18} aria-hidden="true" /> Yes, the result was usable
        </button>
        <button type="button" onClick={() => report("needed-fixing")} aria-pressed={reported === "needed-fixing"} disabled={Boolean(reported)}>
          <Wrench size={18} aria-hidden="true" /> I needed to fix it
        </button>
      </div>
      {reported ? <p className="first-run-outcome-thanks" role="status">Run {run} recorded as “{reported === "usable" ? "usable" : "needed fixing"}.” No task text was collected.</p> : null}
    </section>
  );
}
