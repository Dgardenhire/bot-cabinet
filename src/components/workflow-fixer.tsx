"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { CopyTextButton } from "./copy-text-button";
import { handoffBotFitDraftToBotLab } from "../lib/bot-fit-handoff";
import { downloadMarkdown } from "../lib/browser-download";
import { draftDiagnosis, draftWorkflowMap, WORKFLOW_AI_ERROR_MESSAGES, WorkflowAiError } from "../lib/workflow-ai";
import {
  coerceWorkflowMap,
  EMPTY_WORKFLOW,
  EXAMPLE_WORKFLOW,
  firstPrompt,
  focusStep,
  formatHours,
  FREQUENCIES,
  hoursPerMonth,
  matchTemplate,
  MAX_STEPS,
  MAX_WHYS,
  newStep,
  problemStatement,
  rankFriction,
  recommendFix,
  SNAGS,
  toWorkshopDraft,
  totalHours,
  WORKFLOW_STORAGE_KEY,
  workflowToMarkdown,
  type Frequency,
  type Snag,
  type WorkflowMap,
  type WorkflowStep,
} from "../lib/workflow-fixer";
import styles from "./workflow-fixer.module.css";

const STAGES = [
  { id: "map", number: "1", title: "Map it", hint: "How the work actually runs today" },
  { id: "friction", number: "2", title: "Find the friction", hint: "Where it is slow, manual or stuck" },
  { id: "cause", number: "3", title: "Get to the cause", hint: "Why that step is slow" },
  { id: "fix", number: "4", title: "Your fix", hint: "What to do about it, starting today" },
] as const;

type StageId = (typeof STAGES)[number]["id"];

function starterMap(): WorkflowMap {
  return { ...EMPTY_WORKFLOW, steps: [newStep(), newStep(), newStep()] };
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "my-workflow";
}

export function WorkflowFixer() {
  const [map, setMap] = useState<WorkflowMap>(starterMap);
  const [stage, setStage] = useState<StageId>("map");
  const [ready, setReady] = useState(false);
  const [description, setDescription] = useState("");
  const [aiBusy, setAiBusy] = useState<"map" | "diagnose" | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [handoffMessage, setHandoffMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(WORKFLOW_STORAGE_KEY);
        const restored = stored ? coerceWorkflowMap(JSON.parse(stored)) : null;
        if (restored && restored.steps.length) setMap(restored);
      } catch {
        /* Private windows can block storage; the tool still works. */
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }, [map, ready]);

  const steps = map.steps;
  const filledSteps = steps.filter((step) => step.text.trim());
  const ranked = useMemo(() => rankFriction(steps), [steps]);
  const focus = useMemo(() => focusStep(map), [map]);
  const statement = useMemo(() => problemStatement(map), [map]);
  const prompt = useMemo(() => firstPrompt(map), [map]);
  const template = useMemo(() => matchTemplate(map), [map]);
  const fix = focus ? recommendFix(focus) : null;

  function go(next: StageId) {
    setStage(next);
    setAiMessage("");
    window.requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
    if (next === "fix") track("workflow_fixer_completed", { surface: "workflow-fixer", fix: fix?.kind ?? "none" });
  }

  function update(patch: Partial<WorkflowMap>) {
    setMap((current) => ({ ...current, ...patch }));
  }

  function updateStep(id: string, patch: Partial<WorkflowStep>) {
    setMap((current) => ({ ...current, steps: current.steps.map((step) => (step.id === id ? { ...step, ...patch } : step)) }));
  }

  function moveStep(index: number, delta: number) {
    setMap((current) => {
      const next = [...current.steps];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, steps: next };
    });
  }

  function removeStep(id: string) {
    setMap((current) => ({
      ...current,
      steps: current.steps.filter((step) => step.id !== id),
      focusStepId: current.focusStepId === id ? null : current.focusStepId,
    }));
  }

  function toggleSnag(id: string, snag: Snag) {
    setMap((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.id !== id ? step : { ...step, snags: step.snags.includes(snag) ? step.snags.filter((s) => s !== snag) : [...step.snags, snag] },
      ),
    }));
  }

  function loadExample() {
    setMap(EXAMPLE_WORKFLOW);
    setAiMessage("This is a worked example. Change any line to make it yours, or start over.");
  }

  function startOver() {
    if (filledSteps.length && !window.confirm("Clear this workflow and start a new one?")) return;
    setMap(starterMap());
    setDescription("");
    setStage("map");
    setAiMessage("");
  }

  async function aiMap() {
    setAiBusy("map");
    setAiMessage("");
    try {
      const draft = await draftWorkflowMap(description);
      setMap({ ...EMPTY_WORKFLOW, workflowName: draft.workflowName, goal: draft.goal, steps: draft.steps.slice(0, MAX_STEPS) });
      setAiMessage("Here is a first map. Fix anything that is not how it really happens.");
      track("workflow_fixer_ai_map", { surface: "workflow-fixer" });
    } catch (error) {
      setAiMessage(WORKFLOW_AI_ERROR_MESSAGES[error instanceof WorkflowAiError ? error.code : "network"]);
    } finally {
      setAiBusy(null);
    }
  }

  async function aiDiagnose() {
    if (!focus) return;
    setAiBusy("diagnose");
    setAiMessage("");
    try {
      const result = await draftDiagnosis({ workflowName: map.workflowName, goal: map.goal, step: focus });
      const whys = result.whys.slice(0, MAX_WHYS);
      while (whys.length < 3) whys.push("");
      update({ whys, outcome: map.outcome.trim() ? map.outcome : result.outcome, focusStepId: focus.id });
      setAiMessage("These are suggestions. Keep only what is true for you.");
      track("workflow_fixer_ai_diagnose", { surface: "workflow-fixer" });
    } catch (error) {
      setAiMessage(WORKFLOW_AI_ERROR_MESSAGES[error instanceof WorkflowAiError ? error.code : "network"]);
    } finally {
      setAiBusy(null);
    }
  }

  function continueInBotLab(event: MouseEvent<HTMLAnchorElement>) {
    const draft = toWorkshopDraft(map);
    if (!draft) {
      event.preventDefault();
      return;
    }
    const handoff = handoffBotFitDraftToBotLab({
      storage: window.localStorage,
      draft,
      confirm: (message) => window.confirm(message),
    });
    if (handoff.status !== "transferred") {
      event.preventDefault();
      if (handoff.status === "unavailable") setHandoffMessage("This browser could not pass the plan along. Download the worksheet, then open Bot Lab.");
      return;
    }
    track("workflow_fixer_continue_to_lab", { surface: "workflow-fixer", destination: "workshop" });
  }

  const stageIndex = STAGES.findIndex((item) => item.id === stage);
  const current = STAGES[stageIndex];
  const canLeaveMap = filledSteps.length >= 2;
  const canLeaveFriction = ranked.length >= 1;

  return (
    <section className={`${styles.tool} shell`} aria-labelledby="workflow-stage-title">
      <ol className={styles.rail} aria-label="Workflow Fixer steps">
        {STAGES.map((item, index) => {
          const unlocked = index === 0 || (index === 1 && canLeaveMap) || (index >= 2 && canLeaveMap && canLeaveFriction);
          return (
            <li key={item.id}>
              <button
                type="button"
                className={styles.railButton}
                aria-current={item.id === stage ? "step" : undefined}
                disabled={!unlocked}
                onClick={() => go(item.id)}
              >
                <span className={styles.railNumber}>{item.number}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.panel}>
        <header className={styles.panelHead}>
          <p className={styles.kicker}>Step {current.number} of 4</p>
          <h2 id="workflow-stage-title" ref={headingRef} tabIndex={-1}>{current.title}</h2>
        </header>

        {aiMessage ? <p className={styles.notice} role="status">{aiMessage}</p> : null}

        {stage === "map" ? (
          <div className={styles.stack}>
            <div className={styles.quickStart}>
              <label htmlFor="workflow-description">
                <strong>Describe it in your own words</strong>
                <span>Tell it like you would to a new coworker. AI turns it into a step list you can edit.</span>
              </label>
              <textarea
                id="workflow-description"
                rows={3}
                maxLength={3000}
                value={description}
                placeholder="Every Friday I pull numbers from three spreadsheets, read the team's notes, write an update email for each client, then wait for my partner to approve it..."
                onChange={(event) => setDescription(event.target.value)}
              />
              <div className={styles.row}>
                <button type="button" className="button button-secondary" disabled={aiBusy !== null || description.trim().length < 10} onClick={aiMap}>
                  {aiBusy === "map" ? "Drafting the map..." : "Draft my map"}
                </button>
                <button type="button" className={styles.linkButton} onClick={loadExample}>Or see a worked example</button>
              </div>
            </div>

            <div className={styles.fields}>
              <label>
                <span>What is the workflow?</span>
                <input value={map.workflowName} maxLength={120} placeholder="Weekly client update" onChange={(event) => update({ workflowName: event.target.value })} />
              </label>
              <label>
                <span>What is it for?</span>
                <input value={map.goal} maxLength={300} placeholder="Keep clients sure the project is on track" onChange={(event) => update({ goal: event.target.value })} />
              </label>
            </div>

            <div>
              <p className={styles.sectionLabel}>The steps, in order, the way they really happen. Last Tuesday counts more than the ideal version.</p>
              <ol className={styles.steps}>
                {steps.map((step, index) => (
                  <li key={step.id} className={styles.stepRow}>
                    <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
                    <div className={styles.stepFields}>
                      <label className={styles.stepText}>
                        <span className="sr-only">Step {index + 1}</span>
                        <input value={step.text} maxLength={200} placeholder={index === 0 ? "What happens first?" : "Then what?"} onChange={(event) => updateStep(step.id, { text: event.target.value })} />
                      </label>
                      <label>
                        <span>Who</span>
                        <input value={step.who} maxLength={80} placeholder="I" onChange={(event) => updateStep(step.id, { who: event.target.value })} />
                      </label>
                      <label>
                        <span>How often</span>
                        <select value={step.frequency} onChange={(event) => updateStep(step.id, { frequency: event.target.value as Frequency })}>
                          {FREQUENCIES.map((freq) => <option key={freq.id} value={freq.id}>{freq.label}</option>)}
                        </select>
                      </label>
                      <label>
                        <span>Minutes each time</span>
                        <input type="number" inputMode="numeric" min={0} max={600} value={step.minutes} onChange={(event) => updateStep(step.id, { minutes: Math.min(600, Math.max(0, Number(event.target.value) || 0)) })} />
                      </label>
                    </div>
                    <div className={styles.stepTools}>
                      <button type="button" aria-label={`Move step ${index + 1} up`} disabled={index === 0} onClick={() => moveStep(index, -1)}>Up</button>
                      <button type="button" aria-label={`Move step ${index + 1} down`} disabled={index === steps.length - 1} onClick={() => moveStep(index, 1)}>Down</button>
                      <button type="button" aria-label={`Remove step ${index + 1}`} disabled={steps.length <= 1} onClick={() => removeStep(step.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ol>
              <button type="button" className={styles.linkButton} disabled={steps.length >= MAX_STEPS} onClick={() => update({ steps: [...steps, newStep()] })}>
                Add a step
              </button>
            </div>

            <footer className={styles.nav}>
              <span className={styles.meter}>{filledSteps.length ? `${filledSteps.length} steps, about ${formatHours(totalHours(filledSteps))} a month` : "Add at least two steps"}</span>
              <button type="button" className="button button-primary" disabled={!canLeaveMap} onClick={() => go("friction")}>Next: find the friction</button>
            </footer>
          </div>
        ) : null}

        {stage === "friction" ? (
          <div className={styles.stack}>
            <p className={styles.lede}>For each step, tap what makes it slow. Leave a step blank if it is simply work that has to happen.</p>
            <ol className={styles.frictionList}>
              {filledSteps.map((step, index) => (
                <li key={step.id}>
                  <div className={styles.frictionHead}>
                    <strong>{index + 1}. {step.text}</strong>
                    <span>{formatHours(hoursPerMonth(step))} a month</span>
                  </div>
                  <div className={styles.chips} role="group" aria-label={`What slows down: ${step.text}`}>
                    {SNAGS.map((snag) => (
                      <button key={snag.id} type="button" aria-pressed={step.snags.includes(snag.id)} onClick={() => toggleSnag(step.id, snag.id)}>
                        {snag.label}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            {ranked.length ? (
              <div className={styles.ranking}>
                <p className={styles.sectionLabel}>Where your time goes, biggest first</p>
                <ol>
                  {ranked.map((step) => {
                    const share = Math.max(4, Math.round((hoursPerMonth(step) / Math.max(hoursPerMonth(ranked[0]), 0.01)) * 100));
                    return (
                      <li key={step.id}>
                        <span className={styles.barLabel}>{step.text}</span>
                        <span className={styles.bar} aria-hidden="true"><span style={{ width: `${share}%` }} /></span>
                        <span className={styles.barValue}>{formatHours(hoursPerMonth(step))}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}

            <footer className={styles.nav}>
              <button type="button" className={styles.linkButton} onClick={() => go("map")}>Back</button>
              <button type="button" className="button button-primary" disabled={!canLeaveFriction} onClick={() => go("cause")}>Next: get to the cause</button>
            </footer>
          </div>
        ) : null}

        {stage === "cause" ? (
          <div className={styles.stack}>
            <fieldset className={styles.focusPick}>
              <legend className={styles.sectionLabel}>Which step do you want to fix first? The biggest one is picked for you.</legend>
              {ranked.map((step) => (
                <label key={step.id} className={styles.radio}>
                  <input type="radio" name="focus-step" checked={focus?.id === step.id} onChange={() => update({ focusStepId: step.id })} />
                  <span>{step.text}</span>
                  <small>{formatHours(hoursPerMonth(step))} a month</small>
                </label>
              ))}
            </fieldset>

            <div>
              <p className={styles.lede}>
                Keep asking why. The first answer is usually the symptom. Stop when you reach something you could actually change.
              </p>
              <ol className={styles.whys}>
                {map.whys.map((why, index) => (
                  <li key={index}>
                    <label>
                      <span>{index === 0 ? `Why is "${focus?.text ?? "this step"}" slow?` : "Why is that?"}</span>
                      <input value={why} maxLength={300} onChange={(event) => update({ whys: map.whys.map((w, i) => (i === index ? event.target.value : w)) })} />
                    </label>
                  </li>
                ))}
              </ol>
              <div className={styles.row}>
                <button type="button" className={styles.linkButton} disabled={map.whys.length >= MAX_WHYS} onClick={() => update({ whys: [...map.whys, ""] })}>Ask why again</button>
                <button type="button" className="button button-secondary" disabled={aiBusy !== null || !focus} onClick={aiDiagnose}>
                  {aiBusy === "diagnose" ? "Thinking it through..." : "Suggest the whys"}
                </button>
              </div>
            </div>

            <label className={styles.single}>
              <span>What would done well look like? Make it something you could check.</span>
              <input value={map.outcome} maxLength={300} placeholder="Each client gets a clear update every Friday in under 15 minutes of my time" onChange={(event) => update({ outcome: event.target.value })} />
            </label>

            <footer className={styles.nav}>
              <button type="button" className={styles.linkButton} onClick={() => go("friction")}>Back</button>
              <button type="button" className="button button-primary" disabled={!focus} onClick={() => go("fix")}>See my fix</button>
            </footer>
          </div>
        ) : null}

        {stage === "fix" && focus && fix ? (
          <div className={styles.stack}>
            <article className={styles.statement}>
              <p className={styles.sectionLabel}>The problem, stated clearly</p>
              <p className={styles.statementText}>{statement}</p>
              <CopyTextButton text={statement} label="Copy the problem statement" analyticsEvent="workflow_fixer_copy_statement" analyticsSurface="workflow-fixer" />
            </article>

            <article className={styles.fixCard} data-kind={fix.kind}>
              <p className={styles.sectionLabel}>The right-sized fix</p>
              <h3>{fix.label}</h3>
              <p>{fix.why}</p>
            </article>

            <article className={styles.promptCard}>
              <div className={styles.promptHead}>
                <div>
                  <p className={styles.sectionLabel}>Start today</p>
                  <h3>{fix.aiHelps ? "Paste this into any AI assistant" : "Use AI to redesign the step"}</h3>
                  <p>Works in ChatGPT, Claude, Gemini, Grok or Copilot. It carries your map, so the first answer is about your work.</p>
                </div>
                <CopyTextButton text={prompt} label="Copy the prompt" analyticsEvent="workflow_fixer_copy_prompt" analyticsSurface="workflow-fixer" />
              </div>
              <pre className={styles.prompt}>{prompt}</pre>
            </article>

            {fix.aiHelps ? (
              <div className={styles.nextGrid}>
                <article>
                  <p className={styles.sectionLabel}>Make it stick</p>
                  <h3>Build it as a Bot</h3>
                  <p>Bot Lab opens with this step already filled in. Download a Bot for Hermes, or instructions for ChatGPT, Claude, Gemini and Grok.</p>
                  <Link className="button button-primary" href="/workshop/#workshop-builder-heading" onClick={continueInBotLab}>Open in Bot Lab</Link>
                  {handoffMessage ? <p role="status" className={styles.small}>{handoffMessage}</p> : null}
                </article>
                {template ? (
                  <article>
                    <p className={styles.sectionLabel}>Or start from a ready Bot</p>
                    <h3>{template.name}</h3>
                    <p>{template.reason}</p>
                    <Link className="button button-secondary" href={`/bots/${template.slug}/`}>See the {template.name} Bot</Link>
                  </article>
                ) : (
                  <article>
                    <p className={styles.sectionLabel}>Not sure how big to go?</p>
                    <h3>Take the Bot Fit Test</h3>
                    <p>Five questions decide between a saved prompt, a skill, a routine, a Bot or a crew.</p>
                    <Link className="button button-secondary" href="/fit/">Take the Fit Test</Link>
                  </article>
                )}
              </div>
            ) : null}

            {ranked.length > 1 ? (
              <div className={styles.others}>
                <p className={styles.sectionLabel}>The rest of your list</p>
                <ul>
                  {ranked.filter((step) => step.id !== focus.id).map((step) => (
                    <li key={step.id}>
                      <span>{step.text}</span>
                      <span>{formatHours(hoursPerMonth(step))} a month</span>
                      <span>{recommendFix(step).label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <footer className={styles.nav}>
              <div className={styles.row}>
                <button type="button" className={styles.linkButton} onClick={() => go("cause")}>Back</button>
                <button type="button" className={styles.linkButton} onClick={startOver}>Start a new workflow</button>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  downloadMarkdown(workflowToMarkdown(map), `${slug(map.workflowName)}-workflow.md`);
                  track("workflow_fixer_download", { surface: "workflow-fixer" });
                }}
              >
                Download the worksheet
              </button>
            </footer>
          </div>
        ) : null}
      </div>

      <p className={styles.privacy}>Your answers stay in this browser. Nothing is sent anywhere unless you press a button that asks AI to draft.</p>
    </section>
  );
}
