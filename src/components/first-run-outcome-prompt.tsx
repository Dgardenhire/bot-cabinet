"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import { useState } from "react";

import {
  sendFirstBotRunReport,
  type FirstBotRunOutcome,
} from "../lib/first-run-outcome";

export function FirstRunOutcomePrompt() {
  const [reported, setReported] = useState<FirstBotRunOutcome>();

  function report(outcome: FirstBotRunOutcome) {
    if (reported) return;
    setReported(outcome);
    sendFirstBotRunReport(outcome, track);
  }

  return (
    <section className="first-run-outcome-prompt" aria-labelledby="first-run-outcome-question">
      <div>
        <span>One-click outcome check</span>
        <h2 id="first-run-outcome-question">Did your Bot produce the expected result?</h2>
        <p>Only your choice—worked or stuck—is recorded.</p>
      </div>
      <div className="first-run-outcome-actions" role="group" aria-label="Report your first Bot result">
        <button
          type="button"
          onClick={() => report("worked")}
          aria-pressed={reported === "worked"}
          disabled={Boolean(reported)}
        >
          <CheckCircle size={18} aria-hidden="true" /> Yes, it worked
        </button>
        <button
          type="button"
          onClick={() => report("stuck")}
          aria-pressed={reported === "stuck"}
          disabled={Boolean(reported)}
        >
          <WarningCircle size={18} aria-hidden="true" /> I got stuck
        </button>
      </div>
      {reported ? (
        <p className="first-run-outcome-thanks" role="status">
          Thanks. Your response was recorded as “{reported === "worked" ? "worked" : "stuck"}.”
        </p>
      ) : null}
    </section>
  );
}
