"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

import {
  FIRST_BOT_RUN_FRICTION_REASONS,
  readFirstBotRunRecord,
  reportFirstBotRunOnce,
  sendFirstBotRunFrictionReport,
  type FirstBotRunOutcome,
  type FirstBotRunFrictionReason,
} from "../lib/first-run-outcome";

const frictionLabels: Record<FirstBotRunFrictionReason, string> = {
  "install-hermes": "Installing Hermes",
  "connect-provider": "Connecting a provider",
  "import-profile": "Importing the Bot",
  "run-assignment": "Running the assignment",
  "check-result": "Checking the result",
  "something-else": "Something else",
};

export function FirstRunOutcomePrompt() {
  const [reported, setReported] = useState<FirstBotRunOutcome>();
  const [friction, setFriction] = useState<FirstBotRunFrictionReason>();

  useEffect(() => {
    const restore = window.requestAnimationFrame(() => {
      const previous = readFirstBotRunRecord(window.localStorage);
      if (previous) setReported(previous.outcome);
    });
    return () => window.cancelAnimationFrame(restore);
  }, []);

  function report(outcome: FirstBotRunOutcome) {
    if (reported) return;
    const result = reportFirstBotRunOnce(window.localStorage, outcome, track);
    setReported(result.record.outcome);
  }

  function reportFriction(reason: FirstBotRunFrictionReason) {
    if (friction) return;
    setFriction(reason);
    sendFirstBotRunFrictionReport(reason, track);
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
      {reported === "stuck" ? (
        <div className="first-run-friction">
          <p id="first-run-friction-question">Where did you get stuck? Choose one. No written response is collected.</p>
          <div className="first-run-friction-actions" role="group" aria-labelledby="first-run-friction-question">
            {FIRST_BOT_RUN_FRICTION_REASONS.map((reason) => (
              <button
                type="button"
                key={reason}
                onClick={() => reportFriction(reason)}
                aria-pressed={friction === reason}
                disabled={Boolean(friction)}
              >
                {frictionLabels[reason]}
              </button>
            ))}
          </div>
          {friction ? <p role="status">Thanks. That step was recorded without a written response.</p> : null}
        </div>
      ) : null}
    </section>
  );
}
