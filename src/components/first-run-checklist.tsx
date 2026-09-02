"use client";

import { track } from "@vercel/analytics";
import {
  ArrowSquareOut,
  Check,
  CheckCircle,
  DownloadSimple,
  Play,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CopyTextButton } from "@/components/copy-text-button";
import { FirstRunOutcomePrompt } from "@/components/first-run-outcome-prompt";

const STORAGE_KEY = "bot-cabinet-first-run-scout";
const COMPLETION_STORAGE_KEY = "bot-cabinet-first-run-scout-completion-tracked";

const steps = [
  {
    title: "Install Hermes Desktop",
    copy: "Download Hermes Agent and open the desktop app. The official guide covers the current installation choices.",
    action: (
      <a
        className="button button-secondary"
        href="https://hermes-agent.nousresearch.com/docs/installation"
        target="_blank"
        rel="noreferrer"
        data-funnel-event="first_run_install_docs"
        data-funnel-surface="start_page"
        data-funnel-destination="hermes_installation_docs"
      >
        Open the installation guide <ArrowSquareOut size={16} aria-hidden="true" />
      </a>
    ),
    checkpoint: "Hermes Desktop opens and shows its main conversation screen.",
  },
  {
    title: "Connect an AI provider",
    copy: "Choose one supported provider inside Hermes and add its API key. Provider charges vary; a short Scout test should use very little.",
    action: (
      <a
        className="text-link"
        href="https://hermes-agent.nousresearch.com/docs/integrations/providers"
        target="_blank"
        rel="noreferrer"
        data-funnel-event="first_run_provider_docs"
        data-funnel-surface="start_page"
        data-funnel-destination="hermes_provider_docs"
      >
        See supported providers <ArrowSquareOut size={15} aria-hidden="true" />
      </a>
    ),
    checkpoint: "Hermes can answer a short test message.",
  },
  {
    title: "Download and import Scout",
    copy: "Scout is a research Bot. Its profile archive includes the role, instructions, Passport, and setup notes that Hermes needs.",
    action: (
      <div className="button-row">
        <a
          className="button button-primary"
          href="/downloads/starter-bots/scout.tar.gz"
          download
          data-funnel-event="first_run_profile_download"
          data-funnel-surface="start_page"
          data-funnel-destination="scout_profile"
        >
          Download Scout <DownloadSimple size={16} aria-hidden="true" />
        </a>
        <a
          className="text-link"
          href="https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions"
          target="_blank"
          rel="noreferrer"
          data-funnel-event="first_run_import_docs"
          data-funnel-surface="start_page"
          data-funnel-destination="profile_distribution_docs"
        >
          Import instructions <ArrowSquareOut size={15} aria-hidden="true" />
        </a>
      </div>
    ),
    checkpoint: "Scout appears as a profile in Hermes Desktop.",
  },
  {
    title: "Give Scout one small research job",
    copy: "Start with a public topic and a narrow result. Copy this first prompt, then paste it into Scout.",
    action: (
      <div className="first-run-prompt">
        <p>
          Find three reliable public sources that explain how a small organization can reduce
          meeting overload. Rank them by usefulness. For each source, give me the link, two
          sentences on what it says, and one sentence on why it matters. End with three practical
          actions I could test next week.
        </p>
        <CopyTextButton
          text="Find three reliable public sources that explain how a small organization can reduce meeting overload. Rank them by usefulness. For each source, give me the link, two sentences on what it says, and one sentence on why it matters. End with three practical actions I could test next week."
          label="Copy the first prompt"
          analyticsEvent="first_run_prompt_copy"
          analyticsSurface="start_page"
        />
      </div>
    ),
    checkpoint: "Scout begins researching and returns links you can open.",
  },
  {
    title: "Check the result",
    copy: "Open each source and confirm that it supports Scout’s summary. Ask Scout to correct anything unclear before you use the brief.",
    action: (
      <Link
        className="text-link"
        href="/bots/scout"
        data-funnel-event="first_run_scout_details"
        data-funnel-surface="start_page"
        data-funnel-destination="scout_page"
      >
        See Scout’s complete setup and review information
      </Link>
    ),
    checkpoint: "You have three working links, a short explanation of each, and three practical actions.",
  },
] as const;

function loadCompletedSteps() {
  if (typeof window === "undefined") return [] as number[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isInteger(value)) : [];
  } catch {
    return [] as number[];
  }
}

export function FirstRunChecklist() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const completionTracked = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(loadCompletedSteps());
      completionTracked.current = window.localStorage.getItem(COMPLETION_STORAGE_KEY) === "true";
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed, ready]);

  function toggleStep(index: number) {
    setCompleted((current) => {
      const isComplete = current.includes(index);
      const next = isComplete ? current.filter((item) => item !== index) : [...current, index];
      if (!isComplete) {
        track(index === 0 ? "first_run_started" : "first_run_step_completed", {
          bot: "scout",
          step: index + 1,
        });
        if (next.length === steps.length && !completionTracked.current) {
          completionTracked.current = true;
          window.localStorage.setItem(COMPLETION_STORAGE_KEY, "true");
          track("first_run_completed", { bot: "scout", steps: steps.length });
        }
      }
      return next;
    });
  }

  return (
    <div className="first-run-checklist" aria-label="First Bot setup checklist">
      <div className="first-run-progress" aria-live="polite">
        <span>{completed.length} of {steps.length} steps complete</span>
        <div aria-hidden="true"><span style={{ width: `${(completed.length / steps.length) * 100}%` }} /></div>
      </div>

      <ol className="first-run-steps">
        {steps.map((step, index) => {
          const isComplete = completed.includes(index);
          return (
            <li className={isComplete ? "is-complete" : ""} key={step.title}>
              <div className="first-run-step-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="first-run-step-copy">
                <h2>{step.title}</h2>
                <p>{step.copy}</p>
                {step.action}
                <div className="first-run-checkpoint">
                  <CheckCircle size={20} weight="thin" aria-hidden="true" />
                  <span><strong>Checkpoint:</strong> {step.checkpoint}</span>
                </div>
              </div>
              <button
                type="button"
                className="first-run-step-toggle"
                onClick={() => toggleStep(index)}
                aria-pressed={isComplete}
              >
                {isComplete ? <Check size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
                {isComplete ? "Done" : "Mark done"}
              </button>
            </li>
          );
        })}
      </ol>

      {completed.length === steps.length ? (
        <>
          <div className="first-run-finish" role="status">
            <CheckCircle size={30} weight="fill" aria-hidden="true" />
            <div>
              <h2>Scout is working</h2>
              <p>You now have a Bot, a first result, and a clear way to check its work. Keep the conversation going or choose a different specialist from The Cabinet.</p>
            </div>
            <Link className="button button-primary" href="/bots" data-funnel-event="first_run_choose_next_bot" data-funnel-surface="start_page">
              Choose another Bot
            </Link>
          </div>
          <FirstRunOutcomePrompt />
        </>
      ) : null}
    </div>
  );
}
