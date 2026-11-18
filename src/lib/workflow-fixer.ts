import { EMPTY_WORKSHOP_DRAFT, type WorkshopDraft } from "./workshop-contract";

/**
 * Workflow Fixer: map how a piece of work actually happens, find where it
 * sticks, get to the root cause, and leave with a fix you can use today.
 *
 * Everything here is pure and runs in the browser. The optional AI draft in
 * workflow-ai.ts only fills these same shapes; the reader edits every line.
 */

export const WORKFLOW_STORAGE_KEY = "bot-cabinet.workflow-fixer.v1";

export const FREQUENCIES = [
  { id: "daily", label: "Every day", perMonth: 21 },
  { id: "weekly", label: "Every week", perMonth: 4.3 },
  { id: "monthly", label: "Every month", perMonth: 1 },
  { id: "rarely", label: "A few times a year", perMonth: 0.25 },
] as const;

export type Frequency = (typeof FREQUENCIES)[number]["id"];

/**
 * What makes a step slow. Each one points to a different kind of fix, and two
 * of them are honest "AI is not the fix" answers.
 */
export const SNAGS = [
  { id: "copying", label: "Copying between tools or files" },
  { id: "hunting", label: "Hunting for information" },
  { id: "writing", label: "Writing from a blank page" },
  { id: "checking", label: "Checking for mistakes" },
  { id: "sorting", label: "Sorting, tagging or routing things" },
  { id: "summarizing", label: "Reading a lot to pull out a little" },
  { id: "reminding", label: "Remembering to do it or chasing people" },
  { id: "waiting", label: "Waiting on someone else" },
  { id: "judgment", label: "A hard call only a person can make" },
] as const;

export type Snag = (typeof SNAGS)[number]["id"];

export type WorkflowStep = {
  id: string;
  text: string;
  who: string;
  frequency: Frequency;
  minutes: number;
  snags: Snag[];
};

export type WorkflowMap = {
  version: 1;
  workflowName: string;
  goal: string;
  steps: WorkflowStep[];
  focusStepId: string | null;
  whys: string[];
  outcome: string;
};

export const EMPTY_WORKFLOW: WorkflowMap = {
  version: 1,
  workflowName: "",
  goal: "",
  steps: [],
  focusStepId: null,
  whys: ["", "", ""],
  outcome: "",
};

export const MAX_STEPS = 15;
export const MAX_WHYS = 5;

export function newStep(text = "", id = makeId()): WorkflowStep {
  return { id, text, who: "", frequency: "weekly", minutes: 15, snags: [] };
}

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function hoursPerMonth(step: Pick<WorkflowStep, "frequency" | "minutes">): number {
  const freq = FREQUENCIES.find((item) => item.id === step.frequency);
  const minutes = Number.isFinite(step.minutes) ? Math.max(0, step.minutes) : 0;
  return ((freq?.perMonth ?? 0) * minutes) / 60;
}

export function formatHours(hours: number): string {
  if (hours <= 0) return "0 hours";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} minutes`;
  const rounded = hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours);
  return `${rounded} ${rounded === 1 ? "hour" : "hours"}`;
}

/**
 * Rank steps by time at stake. A step with no snags is not friction even if it
 * takes a while: some work is just work.
 */
export function rankFriction(steps: WorkflowStep[]): WorkflowStep[] {
  return steps
    .filter((step) => step.text.trim() && step.snags.length > 0)
    .sort((a, b) => hoursPerMonth(b) - hoursPerMonth(a));
}

export function totalHours(steps: WorkflowStep[]): number {
  return steps.reduce((sum, step) => sum + hoursPerMonth(step), 0);
}

export type FixKind = "prompt" | "skill" | "routine" | "bot" | "process";

export type FixRecommendation = {
  kind: FixKind;
  label: string;
  why: string;
  aiHelps: boolean;
};

const FIX_LABELS: Record<FixKind, string> = {
  prompt: "A saved prompt",
  skill: "A reusable AI skill",
  routine: "A scheduled routine",
  bot: "A Bot that keeps the job",
  process: "A process fix, not AI",
};

/**
 * Pick the lightest fix that will hold. This mirrors the Bot Fit Test's
 * ladder (assignment, skill, routine, bot) so the two tools agree.
 */
export function recommendFix(step: WorkflowStep): FixRecommendation {
  const snags = new Set(step.snags);
  const aiSnags = step.snags.filter((snag) => snag !== "waiting" && snag !== "judgment");

  if (aiSnags.length === 0) {
    const reason = snags.has("waiting")
      ? "The time goes to waiting on someone. AI cannot answer for them. Set a deadline, a default answer if they miss it, or a smaller ask they can say yes to quickly."
      : "The hard part is a judgment call that belongs to a person. AI can gather what you need before you decide, but the decision itself should stay with you.";
    return { kind: "process", label: FIX_LABELS.process, why: reason, aiHelps: false };
  }

  if (snags.has("reminding") || (step.frequency === "daily" && (snags.has("hunting") || snags.has("summarizing")))) {
    return {
      kind: "routine",
      label: FIX_LABELS.routine,
      why: "This happens on a clock. A routine that runs on schedule and hands you the result removes the step instead of speeding it up.",
      aiHelps: true,
    };
  }

  if (aiSnags.length >= 3 || (step.frequency === "daily" && aiSnags.length >= 2)) {
    return {
      kind: "bot",
      label: FIX_LABELS.bot,
      why: "Several kinds of busywork stack up in one step, often enough that a Bot that remembers the job, your standards and your sources will pay back the setup time.",
      aiHelps: true,
    };
  }

  if (step.frequency === "rarely") {
    return {
      kind: "prompt",
      label: FIX_LABELS.prompt,
      why: "It does not come up often enough to build anything. Save one good prompt and paste it in when the day comes.",
      aiHelps: true,
    };
  }

  return {
    kind: "skill",
    label: FIX_LABELS.skill,
    why: "It repeats the same way each time. Write the method down once as a reusable skill or custom instruction and every run starts from your best version.",
    aiHelps: true,
  };
}

function lower(text: string): string {
  const trimmed = text.trim().replace(/[.!?]+$/, "");
  if (!trimmed) return trimmed;
  // Keep acronyms and names ("CRM", "Monday") as typed.
  if (/^[A-Z]{2,}/.test(trimmed)) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

export function rootCause(map: WorkflowMap): string {
  const filled = map.whys.map((why) => why.trim()).filter(Boolean);
  return filled.length ? filled[filled.length - 1] : "";
}

export function focusStep(map: WorkflowMap): WorkflowStep | null {
  const ranked = rankFriction(map.steps);
  return (
    map.steps.find((step) => step.id === map.focusStepId && step.text.trim()) ??
    ranked[0] ??
    null
  );
}

/**
 * The problem statement the Optimizely method ends on, in plain words:
 * who, what, how much time, why, and what good looks like.
 */
export function problemStatement(map: WorkflowMap): string {
  const step = focusStep(map);
  if (!step) return "";
  const who = step.who.trim() || "I";
  const verb = who === "I" ? "spend" : /\band\b|,|team|we\b/i.test(who) ? "spend" : "spends";
  const freq = FREQUENCIES.find((item) => item.id === step.frequency)?.label.toLowerCase() ?? "";
  const cause = rootCause(map);
  const outcome = map.outcome.trim();
  const workflow = map.workflowName.trim();

  let sentence = `${workflow ? `${workflow.replace(/[.:]+$/, "")}: ` : ""}${who} ${verb} about ${formatHours(hoursPerMonth(step))} a month on "${step.text.trim()}" (${freq}, about ${step.minutes} minutes each time)`;
  sentence += cause ? ` because ${lower(cause)}.` : ".";
  if (outcome) sentence += ` The goal: ${lower(outcome)}.`;
  return sentence;
}

function snagLabels(step: WorkflowStep): string[] {
  return step.snags
    .map((snag) => SNAGS.find((item) => item.id === snag)?.label.toLowerCase())
    .filter((label): label is string => Boolean(label));
}

/**
 * A first prompt that works in any chat assistant: ChatGPT, Claude, Gemini,
 * Grok, Copilot. It carries the reader's own context so the first answer is
 * about their work, not generic advice.
 */
export function firstPrompt(map: WorkflowMap): string {
  const step = focusStep(map);
  if (!step) return "";
  const fix = recommendFix(step);
  const cause = rootCause(map);
  const before = map.steps
    .filter((item) => item.text.trim())
    .map((item, index) => `${index + 1}. ${item.text.trim()}${item.who.trim() ? ` (${item.who.trim()})` : ""}`)
    .join("\n");

  const lines = [
    `I want help with one step of a workflow${map.workflowName.trim() ? ` called "${map.workflowName.trim()}"` : ""}.`,
    map.goal.trim() ? `The workflow exists to: ${map.goal.trim()}` : "",
    "",
    "Here is how it actually runs today:",
    before,
    "",
    `The step that costs the most time is: "${step.text.trim()}". It happens ${FREQUENCIES.find((f) => f.id === step.frequency)?.label.toLowerCase()} and takes about ${step.minutes} minutes.`,
    snagLabels(step).length ? `What makes it slow: ${snagLabels(step).join("; ")}.` : "",
    cause ? `The root cause, as best I can tell: ${cause.trim()}` : "",
    map.outcome.trim() ? `What good looks like: ${map.outcome.trim()}` : "",
    "",
  ];

  if (fix.aiHelps) {
    lines.push(
      "Please do three things:",
      "1. Ask me up to three questions about anything you need to know first. Wait for my answers.",
      "2. Then do one real run of this step with me, using an example I give you.",
      "3. Then write the instructions I should save so this step goes the same way every time, including what you should never do without asking me.",
    );
  } else {
    lines.push(
      "AI cannot do this step for me. Please help me redesign it instead:",
      "1. Ask me up to three questions about who is involved and what they need.",
      "2. Suggest the smallest change to the process that removes the wait or makes the decision easier.",
      "3. Draft the message I would send to put that change in place.",
    );
  }

  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n").trim();
}

export type TemplateMatch = { slug: string; name: string; reason: string };

const TEMPLATE_RULES: Array<{ slug: string; name: string; words: RegExp; snags?: Snag[]; reason: string }> = [
  { slug: "researcher", name: "Researcher", words: /research|source|find out|look up|data|report on/i, snags: ["hunting", "summarizing"], reason: "It finds and checks sources and tells you what it could not confirm." },
  { slug: "writer", name: "Writer", words: /write|draft|newsletter|post|email|blog|copy|letter/i, snags: ["writing"], reason: "It turns your notes into a first draft in your voice." },
  { slug: "editor", name: "Editor", words: /edit|proof|review|revise|check (the )?(copy|draft|text)/i, snags: ["checking"], reason: "It tightens copy and flags mistakes without rewriting your meaning." },
  { slug: "planner", name: "Planner", words: /plan|schedule|project|timeline|deadline|task list/i, snags: ["reminding"], reason: "It keeps the plan, the dates and the next step in one place." },
  { slug: "client", name: "Client Deliverables", words: /client|proposal|deliverable|invoice|statement of work|report for/i, reason: "It assembles client documents from your notes and past work." },
  { slug: "ops", name: "Ops", words: /monitor|status|log|inbox|ticket|queue|triage|route/i, snags: ["sorting"], reason: "It watches a queue, sorts what comes in and flags what needs you." },
  { slug: "chief-of-staff", name: "Chief of Staff", words: /meeting|follow[- ]?up|priorit|calendar|agenda|brief/i, snags: ["reminding"], reason: "It tracks priorities and follow-ups so nothing waits on your memory." },
  { slug: "professor", name: "Professor", words: /learn|study|course|lesson|teach|quiz/i, reason: "It turns material into lessons and checks what stuck." },
  { slug: "story", name: "Story", words: /brand|message|story|pitch|talking points/i, reason: "It keeps your message consistent across everything you send." },
  { slug: "pulse", name: "Pulse", words: /growth|metrics|sales|leads|pipeline|marketing/i, reason: "It reads your numbers and tells you what changed and why it matters." },
];

/** The closest Bot Cabinet template, or null when nothing fits honestly. */
export function matchTemplate(map: WorkflowMap): TemplateMatch | null {
  const step = focusStep(map);
  if (!step) return null;
  const text = `${map.workflowName} ${map.goal} ${step.text}`;
  let best: { rule: (typeof TEMPLATE_RULES)[number]; score: number } | null = null;
  for (const rule of TEMPLATE_RULES) {
    let score = rule.words.test(step.text) ? 3 : rule.words.test(text) ? 1 : 0;
    score += (rule.snags ?? []).filter((snag) => step.snags.includes(snag)).length;
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }
  return best && best.score >= 2 ? { slug: best.rule.slug, name: best.rule.name, reason: best.rule.reason } : null;
}

function botNameFor(map: WorkflowMap, step: WorkflowStep): string {
  const base = (map.workflowName.trim() || step.text.trim()).replace(/[^\p{L}\p{N} '&-]/gu, "").trim();
  const words = base.split(/\s+/).slice(0, 4).join(" ");
  const name = words ? `${words.charAt(0).toUpperCase()}${words.slice(1)} Helper` : "Workflow Helper";
  return name.slice(0, 100);
}

/** A Bot Lab draft so "Build this as a Bot" opens with the work already filled in. */
export function toWorkshopDraft(map: WorkflowMap): WorkshopDraft | null {
  const step = focusStep(map);
  if (!step) return null;
  const cause = rootCause(map);
  const freq = FREQUENCIES.find((item) => item.id === step.frequency)?.label ?? "";
  const others = map.steps.filter((item) => item.id !== step.id && item.text.trim());

  return {
    ...EMPTY_WORKSHOP_DRAFT,
    botName: botNameFor(map, step),
    jobOutcome: [
      `Take over this step: ${step.text.trim()}.`,
      map.goal.trim() ? `The workflow exists to ${lower(map.goal)}.` : "",
      cause ? `Today it is slow because ${lower(cause)}.` : "",
      map.outcome.trim() ? `Done well: ${map.outcome.trim()}` : "",
    ].filter(Boolean).join(" "),
    inputsContext: [
      ...snagLabels(step).map((label) => `Slow today because of: ${label}`),
      ...others.slice(0, 4).map((item) => `Comes before or after: ${item.text.trim()}`),
    ].join("\n"),
    outputsDeliverables: map.outcome.trim() || `A finished version of "${step.text.trim()}" ready for review`,
    cadenceTrigger: freq ? `${freq}, when this step comes up` : "",
    toolsIntegrations: "",
    approvalBoundaries: "Ask before sending anything to another person\nAsk before deleting or changing source files",
    firstRunTest: `Do one real run of "${step.text.trim()}" from an example I provide and show me the result before saving anything.`,
  };
}

export function workflowToMarkdown(map: WorkflowMap): string {
  const ranked = rankFriction(map.steps);
  const step = focusStep(map);
  const lines: string[] = [
    `# ${map.workflowName.trim() || "My workflow"}`,
    "",
    map.goal.trim() ? `**What it is for:** ${map.goal.trim()}` : "",
    "",
    "## 1. How it actually runs",
    "",
    "| # | Step | Who | How often | Minutes | Hours a month | What slows it |",
    "|---|------|-----|-----------|---------|---------------|---------------|",
    ...map.steps
      .filter((item) => item.text.trim())
      .map((item, index) =>
        `| ${index + 1} | ${cell(item.text)} | ${cell(item.who)} | ${FREQUENCIES.find((f) => f.id === item.frequency)?.label ?? ""} | ${item.minutes} | ${formatHours(hoursPerMonth(item))} | ${cell(snagLabels(item).join("; "))} |`,
      ),
    "",
    `Total: about ${formatHours(totalHours(map.steps))} a month.`,
    "",
    "## 2. Where it sticks",
    "",
    ...(ranked.length
      ? ranked.map((item, index) => {
          const fix = recommendFix(item);
          return `${index + 1}. **${item.text.trim()}**, ${formatHours(hoursPerMonth(item))} a month. Fix: ${fix.label}. ${fix.why}`;
        })
      : ["No snags marked yet."]),
    "",
    "## 3. Root cause",
    "",
    step ? `Step: **${step.text.trim()}**` : "",
    "",
    ...map.whys.map((why) => why.trim()).filter(Boolean).map((why, index) => `- Why ${index + 1}: ${why}`),
    "",
    "## Problem statement",
    "",
    problemStatement(map) || "Not written yet.",
    "",
    "## First prompt (works in ChatGPT, Claude, Gemini, Grok or Copilot)",
    "",
    "```",
    firstPrompt(map),
    "```",
    "",
    "Made with Workflow Fixer at https://botcabinet.com/workflow/",
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function cell(text: string): string {
  return text.trim().replace(/\|/g, "/").replace(/\s+/g, " ");
}

const FREQUENCY_IDS = new Set<string>(FREQUENCIES.map((item) => item.id));
const SNAG_IDS = new Set<string>(SNAGS.map((item) => item.id));

function boundedText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\u0000/g, "").slice(0, max) : "";
}

/** Accept only the saved shape; anything else becomes a fresh map. */
export function coerceWorkflowMap(value: unknown): WorkflowMap | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (raw.version !== 1 || !Array.isArray(raw.steps)) return null;
  const steps = raw.steps.slice(0, MAX_STEPS).flatMap((item): WorkflowStep[] => {
    if (!item || typeof item !== "object") return [];
    const s = item as Record<string, unknown>;
    const minutes = typeof s.minutes === "number" && Number.isFinite(s.minutes) ? Math.min(Math.max(0, Math.round(s.minutes)), 600) : 15;
    return [{
      id: boundedText(s.id, 20) || makeId(),
      text: boundedText(s.text, 200),
      who: boundedText(s.who, 80),
      frequency: FREQUENCY_IDS.has(s.frequency as string) ? (s.frequency as Frequency) : "weekly",
      minutes,
      snags: Array.isArray(s.snags) ? [...new Set(s.snags.filter((x): x is Snag => SNAG_IDS.has(x as string)))] : [],
    }];
  });
  const whys = Array.isArray(raw.whys) ? raw.whys.slice(0, MAX_WHYS).map((why) => boundedText(why, 300)) : [];
  while (whys.length < 3) whys.push("");
  return {
    version: 1,
    workflowName: boundedText(raw.workflowName, 120),
    goal: boundedText(raw.goal, 300),
    steps,
    focusStepId: typeof raw.focusStepId === "string" && steps.some((s) => s.id === raw.focusStepId) ? raw.focusStepId : null,
    whys,
    outcome: boundedText(raw.outcome, 300),
  };
}

/** A worked example so nobody stares at an empty form. */
export const EXAMPLE_WORKFLOW: WorkflowMap = {
  version: 1,
  workflowName: "Weekly client update",
  goal: "Keep each client sure their project is on track without a meeting",
  steps: [
    { id: "ex1", text: "Pull this week's numbers from three spreadsheets", who: "I", frequency: "weekly", minutes: 45, snags: ["copying", "hunting"] },
    { id: "ex2", text: "Read the team's notes to see what got done", who: "I", frequency: "weekly", minutes: 30, snags: ["summarizing"] },
    { id: "ex3", text: "Write the update email for each client", who: "I", frequency: "weekly", minutes: 60, snags: ["writing", "checking"] },
    { id: "ex4", text: "Wait for my partner to approve the wording", who: "My partner", frequency: "weekly", minutes: 40, snags: ["waiting"] },
    { id: "ex5", text: "Send and file a copy", who: "I", frequency: "weekly", minutes: 10, snags: [] },
  ],
  focusStepId: "ex3",
  whys: [
    "Every email starts from a blank page",
    "There is no standard format, so I rebuild it from memory",
    "We never wrote down what a good update includes",
  ],
  outcome: "each client gets a clear update every Friday in under 15 minutes of my time",
};
