import { getBotBlueprintApiUrl } from "./workshop-ai";
import {
  FREQUENCIES,
  makeId,
  SNAGS,
  type Frequency,
  type Snag,
  type WorkflowStep,
} from "./workflow-fixer";

/**
 * Optional AI drafts for Workflow Fixer. The page works fully without them.
 * The endpoint is the workflow-map Supabase function. When no URL is set for
 * it, it is derived from Bot Lab's configured function URL on the same project.
 */

export type WorkflowAiErrorCode = "unavailable" | "invalid-input" | "rate-limited" | "network" | "invalid-response";

export class WorkflowAiError extends Error {
  readonly code: WorkflowAiErrorCode;
  constructor(code: WorkflowAiErrorCode) {
    super("Workflow Fixer AI request could not be completed.");
    this.name = "WorkflowAiError";
    this.code = code;
  }
}

export const WORKFLOW_AI_ERROR_MESSAGES: Record<WorkflowAiErrorCode, string> = {
  unavailable: "The AI draft is not switched on right now. Everything else on this page still works.",
  "invalid-input": "Add a little more detail first, then try again.",
  "rate-limited": "Today's free AI drafts are used up. Fill it in by hand, or come back tomorrow.",
  network: "The AI draft did not come back. Check your connection and try again.",
  "invalid-response": "The AI draft came back in a shape this page could not use. Try once more.",
};

const REQUEST_TIMEOUT_MS = 40_000;

export function getWorkflowApiUrl(
  configured: string | undefined = process.env.NEXT_PUBLIC_WORKFLOW_MAP_API_URL,
  blueprint: string | undefined = process.env.NEXT_PUBLIC_BOT_BLUEPRINT_API_URL,
): string | null {
  // getBotBlueprintApiUrl falls back to Bot Lab's own URL when given
  // undefined, so only call it with a value that was actually set.
  const direct = configured?.trim() ? getBotBlueprintApiUrl(configured) : null;
  if (direct) return direct;
  const base = blueprint?.trim() ? getBotBlueprintApiUrl(blueprint) : null;
  if (!base) return null;
  const url = new URL(base);
  if (!/\/bot-blueprint\/?$/.test(url.pathname)) return null;
  url.pathname = url.pathname.replace(/bot-blueprint\/?$/, "workflow-map");
  return url.toString();
}

async function post(body: unknown, endpoint: string | null, fetchImpl: typeof fetch): Promise<Record<string, unknown>> {
  if (!endpoint) throw new WorkflowAiError("unavailable");
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new WorkflowAiError(
        response.status === 429 ? "rate-limited" : response.status === 503 ? "unavailable" : response.status === 400 ? "invalid-input" : "network",
      );
    }
    const json = (await response.json().catch(() => null)) as unknown;
    if (!json || typeof json !== "object" || Array.isArray(json)) throw new WorkflowAiError("invalid-response");
    return json as Record<string, unknown>;
  } catch (error) {
    if (error instanceof WorkflowAiError) throw error;
    throw new WorkflowAiError("network");
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

const FREQ = new Set<string>(FREQUENCIES.map((f) => f.id));
const SNAG = new Set<string>(SNAGS.map((s) => s.id));

function text(value: unknown, max: number): string | null {
  return typeof value === "string" && value.trim() && value.length <= max ? value.trim() : null;
}

function toStep(value: unknown): WorkflowStep | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const stepText = text(v.text, 200);
  if (!stepText || !FREQ.has(v.frequency as string) || typeof v.minutes !== "number" || !Array.isArray(v.snags)) return null;
  return {
    id: makeId(),
    text: stepText,
    who: typeof v.who === "string" ? v.who.slice(0, 80) : "",
    frequency: v.frequency as Frequency,
    minutes: Math.min(600, Math.max(0, Math.round(v.minutes))),
    snags: v.snags.filter((s): s is Snag => SNAG.has(s as string)),
  };
}

export async function draftWorkflowMap(
  description: string,
  options: { endpoint?: string | null; fetchImpl?: typeof fetch } = {},
): Promise<{ workflowName: string; goal: string; steps: WorkflowStep[] }> {
  const trimmed = description.trim();
  if (trimmed.length < 10 || trimmed.length > 3000) throw new WorkflowAiError("invalid-input");
  const body = await post(
    { version: 1, task: "map", description: trimmed },
    options.endpoint === undefined ? getWorkflowApiUrl() : options.endpoint,
    options.fetchImpl ?? fetch,
  );
  const map = body.map as Record<string, unknown> | undefined;
  const steps = Array.isArray(map?.steps) ? map.steps.map(toStep) : [];
  const workflowName = text(map?.workflowName, 120);
  const goal = text(map?.goal, 300);
  if (!workflowName || !goal || steps.length < 1 || steps.some((s) => !s)) throw new WorkflowAiError("invalid-response");
  return { workflowName, goal, steps: steps as WorkflowStep[] };
}

export async function draftDiagnosis(
  input: { workflowName: string; goal: string; step: WorkflowStep },
  options: { endpoint?: string | null; fetchImpl?: typeof fetch } = {},
): Promise<{ whys: string[]; outcome: string }> {
  const { step } = input;
  if (!step.text.trim()) throw new WorkflowAiError("invalid-input");
  const body = await post(
    {
      version: 1,
      task: "diagnose",
      workflowName: input.workflowName.trim().slice(0, 120),
      goal: input.goal.trim().slice(0, 300),
      step: { text: step.text.trim(), who: step.who.trim(), frequency: step.frequency, minutes: step.minutes, snags: step.snags },
    },
    options.endpoint === undefined ? getWorkflowApiUrl() : options.endpoint,
    options.fetchImpl ?? fetch,
  );
  const diagnosis = body.diagnosis as Record<string, unknown> | undefined;
  const whys = Array.isArray(diagnosis?.whys) ? diagnosis.whys.map((w) => text(w, 300)) : [];
  const outcome = text(diagnosis?.outcome, 300);
  if (whys.length < 1 || whys.some((w) => !w) || !outcome) throw new WorkflowAiError("invalid-response");
  return { whys: whys as string[], outcome };
}
