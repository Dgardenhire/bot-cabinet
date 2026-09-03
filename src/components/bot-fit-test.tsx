"use client";

import {
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  Flask,
  LockKey,
} from "@phosphor-icons/react";
import { track } from "@vercel/analytics";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BOT_FIT_EMPTY_ANSWERS,
  botFitArtifactFileName,
  botFitRecommendationToMarkdown,
  recommendBotFit,
  type BotFitAnswers,
  type BotFitFrequency,
  type BotFitKind,
  type BotFitOverlap,
  type BotFitRecommendation,
} from "../lib/bot-fit-test";
import { downloadMarkdown } from "../lib/browser-download";
import { handoffBotFitDraftToBotLab } from "../lib/bot-fit-handoff";

const FIT_KINDS: Array<{ kind: BotFitKind; label: string; note: string }> = [
  { kind: "assignment", label: "Assignment", note: "One result, one time" },
  { kind: "skill", label: "Skill", note: "A method you will reuse" },
  { kind: "routine", label: "Routine", note: "Tested work on a trigger" },
  { kind: "bot", label: "Bot", note: "An ongoing job and conversation" },
  { kind: "crew", label: "Crew", note: "Specialists that hand work off" },
];

const FREQUENCY_OPTIONS = [
  { value: "once", label: "One time", note: "I need one finished result." },
  {
    value: "repeat",
    label: "I will repeat it",
    note: "I will start it when I need it.",
  },
  {
    value: "scheduled",
    label: "On a schedule or event",
    note: "A trigger should start the work.",
  },
] satisfies ReadonlyArray<{
  value: BotFitFrequency;
  label: string;
  note: string;
}>;

const OVERLAP_OPTIONS = [
  { value: "unsure", label: "Not sure" },
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] satisfies ReadonlyArray<{ value: BotFitOverlap; label: string }>;

function YesNoChoice({
  legend,
  hint,
  name,
  value,
  onChange,
}: {
  legend: string;
  hint: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <fieldset className="fit-test-compact-question">
      <legend>{legend}</legend>
      <p>{hint}</p>
      <div className="fit-test-segmented">
        <label>
          <input
            type="radio"
            name={name}
            checked={value}
            onChange={() => onChange(true)}
          />
          <span>Yes</span>
        </label>
        <label>
          <input
            type="radio"
            name={name}
            checked={!value}
            onChange={() => onChange(false)}
          />
          <span>No</span>
        </label>
      </div>
    </fieldset>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="fit-test-result-list">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function OperatingControls({
  controls,
}: {
  controls: NonNullable<BotFitRecommendation["operatingControls"]>;
}) {
  return (
    <div className="fit-test-result-list">
      <h4>Operating controls</h4>
      <ul>
        <li>Trigger: {controls.trigger || "Not defined"}</li>
        <li>Failure response: {controls.failureResponse || "Not defined"}</li>
        <li>Cost limit: {controls.costLimit || "Not defined"}</li>
        <li>Shutdown: {controls.shutdownMethod || "Not defined"}</li>
      </ul>
    </div>
  );
}

export function BotFitTest() {
  const [answers, setAnswers] = useState<BotFitAnswers>({
    ...BOT_FIT_EMPTY_ANSWERS,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedRecommendation, setSubmittedRecommendation] =
    useState<BotFitRecommendation | null>(null);
  const [resultStatus, setResultStatus] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [handoffMessage, setHandoffMessage] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  const completionTrackedRef = useRef(false);
  const currentRecommendation = useMemo(() => recommendBotFit(answers), [answers]);
  const resultNeedsRefresh = resultStatus.startsWith("Answers changed");

  function update<K extends keyof BotFitAnswers>(
    key: K,
    value: BotFitAnswers[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
    if (key === "frequency" && value === "scheduled") setDetailsOpen(true);
    setHandoffMessage("");
    if (submitted) {
      setResultStatus("Answers changed. Submit to update the recommendation.");
    }
  }

  function preventDetailSubmit(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.preventDefault();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!completionTrackedRef.current) {
      track("bot_fit_test_completed", {
        surface: "bot-fit-test",
        destination: currentRecommendation.kind,
      });
      completionTrackedRef.current = true;
    }
    setSubmittedRecommendation(currentRecommendation);
    setResultStatus(`Recommendation ready: ${currentRecommendation.label}.`);
    setSubmitted(true);
    window.requestAnimationFrame(() => {
      const result = resultRef.current;
      result?.focus({ preventScroll: true });
      result?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  function downloadPlan() {
    if (!submittedRecommendation || resultNeedsRefresh) return;
    downloadMarkdown(
      botFitRecommendationToMarkdown(submittedRecommendation),
      botFitArtifactFileName(submittedRecommendation),
    );
  }

  function continueInBotLab(event: MouseEvent<HTMLAnchorElement>) {
    if (resultNeedsRefresh || !submittedRecommendation?.workshopDraft) {
      event.preventDefault();
      return;
    }
    const handoff = handoffBotFitDraftToBotLab({
      storage: window.localStorage,
      draft: submittedRecommendation.workshopDraft,
      confirm: (message) => window.confirm(message),
    });
    if (handoff.status !== "transferred") {
      event.preventDefault();
      if (handoff.status === "unavailable") {
        setHandoffMessage(
          "This browser could not transfer the plan. Download it here, then open Bot Lab.",
        );
      }
      return;
    }
    track("bot_fit_test_continue_to_lab", {
      surface: "bot-fit-test",
      destination: "workshop",
    });
  }

  return (
    <section className="bot-fit-test" aria-labelledby="bot-fit-test-title">
      <header className="fit-test-heading">
        <div>
          <p className="fit-test-kicker">Bot Fit Test</p>
          <h2 id="bot-fit-test-title">What kind of setup does this work need?</h2>
        </div>
        <p>
          Describe the work once. Bot Cabinet will recommend an Assignment, Skill,
          Routine, Bot, or Crew and give you the next step.
        </p>
      </header>

      <div className="fit-test-kinds" aria-label="Possible recommendations">
        {FIT_KINDS.map((item, index) => (
          <div key={item.kind}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
            <small>{item.note}</small>
          </div>
        ))}
      </div>

      <div className="fit-test-privacy">
        <LockKey size={18} aria-hidden="true" />
        <p>
          <strong>Your description stays in this browser.</strong> The Fit Test does
          not send your answers to an AI service.
        </p>
      </div>

      <form id="bot-fit-test-form" className="fit-test-form" onSubmit={submit}>
        <div className="fit-test-primary-question">
          <label htmlFor="fit-test-work-result">What are you trying to accomplish?</label>
          <p>State the finished result in plain language.</p>
          <textarea
            id="fit-test-work-result"
            name="result"
            rows={4}
            maxLength={2000}
            required
            value={answers.result}
            onChange={(event) => update("result", event.target.value)}
            placeholder="For example: Turn each client meeting into a clear follow-up email, action list, and updated project plan."
          />
        </div>

        <fieldset className="fit-test-frequency">
          <legend>How often will this work happen?</legend>
          <div className="fit-test-option-grid">
            {FREQUENCY_OPTIONS.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={answers.frequency === option.value}
                  onChange={() => update("frequency", option.value)}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.note}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="fit-test-question-grid">
          <YesNoChoice
            legend="Does it need to remember context across conversations?"
            hint="Choose Yes when prior decisions, preferences, or history should carry forward."
            name="needs-continuing-context"
            value={answers.needsContinuingContext}
            onChange={(value) => update("needsContinuingContext", value)}
          />
          <YesNoChoice
            legend="Does it need several specialists with different jobs?"
            hint="Choose Yes when the work needs clear roles and handoffs."
            name="needs-multiple-specialists"
            value={answers.needsMultipleSpecialists}
            onChange={(value) => update("needsMultipleSpecialists", value)}
          />
          <YesNoChoice
            legend="Have you completed this work successfully by hand?"
            hint="A scheduled Routine should begin only after the manual version works."
            name="work-proven-manually"
            value={answers.workProvenManually}
            onChange={(value) => update("workProvenManually", value)}
          />
          <fieldset className="fit-test-compact-question">
            <legend>Does this overlap with a role you already use?</legend>
            <p>A separate Bot should have a distinct job.</p>
            <div className="fit-test-segmented fit-test-segmented-three">
              {OVERLAP_OPTIONS.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="overlaps-existing-role"
                    value={option.value}
                    checked={answers.overlapsExistingRole === option.value}
                    onChange={() => update("overlapsExistingRole", option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <details
          className="fit-test-details"
          open={detailsOpen}
          onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
        >
          <summary>
            <span>
              <strong>Add access, approval, and automation details</strong>
              <small>Required for a Routine; useful for every plan</small>
            </span>
          </summary>
          <div className="fit-test-detail-grid">
            <label>
              Access or tools
              <textarea
                rows={3}
                value={answers.access}
                onChange={(event) => update("access", event.target.value)}
                placeholder="Approved folders, web research, email drafts, or other tools"
              />
            </label>
            <label>
              What requires your approval?
              <textarea
                rows={3}
                value={answers.approvals}
                onChange={(event) => update("approvals", event.target.value)}
                placeholder="Sending, publishing, purchases, deletion, or account changes"
              />
            </label>
            <label>
              Trigger
              <input
                type="text"
                value={answers.trigger}
                onChange={(event) => update("trigger", event.target.value)}
                onKeyDown={preventDetailSubmit}
                placeholder="Monday at 8 a.m. or when a meeting ends"
              />
            </label>
            <label>
              What should happen if it fails?
              <input
                type="text"
                value={answers.failurePlan}
                onChange={(event) => update("failurePlan", event.target.value)}
                onKeyDown={preventDetailSubmit}
                placeholder="Stop and tell me what failed"
              />
            </label>
            <label>
              Cost limit
              <input
                type="text"
                value={answers.costLimit}
                onChange={(event) => update("costLimit", event.target.value)}
                onKeyDown={preventDetailSubmit}
                placeholder="For example: $2 per run"
              />
            </label>
            <label>
              Shutdown rule
              <input
                type="text"
                value={answers.shutdown}
                onChange={(event) => update("shutdown", event.target.value)}
                onKeyDown={preventDetailSubmit}
                placeholder="Pause after two failures or when I say stop"
              />
            </label>
          </div>
        </details>

        <div className="fit-test-submit-row">
          <button
            className="button button-primary"
            type="submit"
          >
            Show my best starting point <ArrowRight size={17} aria-hidden="true" />
          </button>
          <span>A few short questions · no account required</span>
        </div>
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {resultStatus}
      </p>

      {submitted && submittedRecommendation && (
        <section
          className="fit-test-result"
          id="fit-test-result"
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="fit-test-result-title"
        >
          <div className="fit-test-result-topline">
            <div className="fit-test-result-icon" aria-hidden="true">
              <Flask size={24} weight="thin" />
            </div>
            <div>
              <p>Your best starting point</p>
              <h3 id="fit-test-result-title">{submittedRecommendation.label}</h3>
            </div>
            <span className="fit-test-result-status">
              <CheckCircle size={17} weight="fill" aria-hidden="true" /> Plan ready
            </span>
          </div>

          <p className="fit-test-result-summary">{submittedRecommendation.summary}</p>

          <div className="fit-test-result-grid">
            <div className="fit-test-result-list">
              <h4>Why this fits</h4>
              <p>{submittedRecommendation.why}</p>
            </div>
            <ResultList title="What it owns" items={submittedRecommendation.owns} />
            <ResultList title="Keep outside this setup" items={submittedRecommendation.excludes} />
            <ResultList title="Access" items={submittedRecommendation.access} />
            <ResultList title="Approval points" items={submittedRecommendation.approvals} />
            {submittedRecommendation.operatingControls && (
              <OperatingControls controls={submittedRecommendation.operatingControls} />
            )}
          </div>

          <div className="fit-test-checkpoints">
            <div>
              <span>First test</span>
              <p>{submittedRecommendation.firstTest}</p>
            </div>
            <div>
              <span>Done check</span>
              <ul>
                {submittedRecommendation.doneCheck.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {submittedRecommendation.graduation && (
            <div className="fit-test-graduation">
              <strong>Before this can become a Routine</strong>
              <ul>
                {submittedRecommendation.graduation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="fit-test-next-action">
            <div>
              <span>Next action</span>
              <p>{submittedRecommendation.nextAction}</p>
            </div>
            {!resultNeedsRefresh && (
              <div className="fit-test-result-actions">
                {submittedRecommendation.kind === "bot" && submittedRecommendation.workshopDraft && (
                  <Link
                    href="/workshop/#workshop-builder-heading"
                    className="button button-primary"
                    onClick={continueInBotLab}
                  >
                    Continue in Bot Lab <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                )}
                <button
                  type="button"
                  className={`button ${submittedRecommendation.kind === "bot" ? "button-secondary" : "button-primary"}`}
                  onClick={downloadPlan}
                  data-funnel-event="bot_fit_test_plan_download"
                  data-funnel-surface="bot-fit-test"
                  data-funnel-destination={submittedRecommendation.kind}
                >
                  <DownloadSimple size={17} aria-hidden="true" />
                  {submittedRecommendation.kind === "bot" ? "Download a backup plan" : "Download the plan"}
                </button>
                {submittedRecommendation.kind === "crew" && (
                  <Link className="button button-secondary" href="/crew-kits/">
                    Browse Crew Kits
                  </Link>
                )}
              </div>
            )}
          </div>

          <label className="fit-test-override">
            Prefer a different format?
            <select
              value={answers.override}
              onChange={(event) =>
                update("override", event.target.value as BotFitAnswers["override"])
              }
            >
              <option value="auto">Use the recommendation</option>
              {FIT_KINDS.map((item) => (
                <option key={item.kind} value={item.kind}>
                  Choose {item.label}
                </option>
              ))}
            </select>
          </label>
          {handoffMessage && <p className="fit-test-handoff-message">{handoffMessage}</p>}
          {resultNeedsRefresh && (
            <div className="fit-test-refresh-message">
              <p>Your answers changed. Update the recommendation before using this plan.</p>
              <button
                type="submit"
                form="bot-fit-test-form"
                className="button button-secondary"
              >
                Update recommendation
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
