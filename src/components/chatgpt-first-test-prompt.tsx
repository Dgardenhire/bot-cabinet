"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

import {
  readChatGPTFirstTestOutcome,
  reportChatGPTFirstTestOnce,
  type ChatGPTFirstTestOutcome,
} from "@/lib/chatgpt-first-test-outcome";

export function ChatGPTFirstTestPrompt({ bot }: { bot: string }) {
  const [reported, setReported] = useState<ChatGPTFirstTestOutcome>();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReported(readChatGPTFirstTestOutcome(window.localStorage, bot));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [bot]);

  function report(outcome: ChatGPTFirstTestOutcome) {
    if (reported) return;
    const result = reportChatGPTFirstTestOnce(window.localStorage, bot, outcome, track);
    setReported(result.outcome);
  }

  return (
    <section className="first-run-outcome-prompt" aria-labelledby="chatgpt-first-test-question">
      <div>
        <span>After you try the sample task</span>
        <h2 id="chatgpt-first-test-question">Did you get a useful first result?</h2>
        <p>Tell us only whether it worked for you. We do not collect your prompt, files, or answer. This is your report, not an independent test.</p>
      </div>
      <div className="first-run-outcome-actions" role="group" aria-label="Report your ChatGPT first test">
        <button type="button" onClick={() => report("worked")} aria-pressed={reported === "worked"} disabled={Boolean(reported)}>
          <CheckCircle size={18} aria-hidden="true" /> Yes, it helped
        </button>
        <button type="button" onClick={() => report("stuck")} aria-pressed={reported === "stuck"} disabled={Boolean(reported)}>
          <WarningCircle size={18} aria-hidden="true" /> I got stuck
        </button>
      </div>
      {reported ? <p className="first-run-outcome-thanks" role="status">Thanks. Your first test was recorded as “{reported === "worked" ? "helped" : "stuck"}.”</p> : null}
    </section>
  );
}
