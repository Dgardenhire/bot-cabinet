import {
  errorResponse,
  extractProviderText,
  parseAllowedOrigins,
  responseHeaders,
} from "../bot-blueprint/core.ts";
import { consumeRateLimit } from "../bot-blueprint/handler.ts";
import {
  buildWorkflowRequestBody,
  extractJsonObject,
  parseDiagnoseResult,
  parseMapResult,
  readWorkflowRequestBody,
  type WorkflowInput,
} from "./core.ts";

const PROVIDER_TIMEOUT_MS = 35_000;
// Same model Bot Lab already runs in production unless overridden.
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

type HandlerDependencies = {
  envGet?: (name: string) => string | undefined;
  fetchImpl?: typeof fetch;
  now?: () => Date;
};

async function requestDraft(
  input: WorkflowInput,
  apiKey: string,
  model: string,
  fetchImpl: typeof fetch,
): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildWorkflowRequestBody(input, model)),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error(`workflow-map provider returned status ${response.status}`);
      return null;
    }
    const text = extractProviderText(await response.json());
    if (!text) return null;
    const json = extractJsonObject(text);
    if (input.task === "map") {
      const map = parseMapResult(json);
      return map ? { map } : null;
    }
    const diagnosis = parseDiagnoseResult(json);
    return diagnosis ? { diagnosis } : null;
  } catch {
    console.error("workflow-map provider request failed");
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function createWorkflowMapHandler(
  dependencies: HandlerDependencies = {},
): (request: Request) => Promise<Response> {
  const envGet = dependencies.envGet ?? ((name) => Deno.env.get(name));
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const now = dependencies.now ?? (() => new Date());

  return async (request: Request): Promise<Response> => {
    const requestOrigin = request.headers.get("origin");
    // Same allow-list as Bot Lab: both tools live on the same site.
    const allowed = parseAllowedOrigins(envGet("BOT_BLUEPRINT_ALLOWED_ORIGINS"));
    const origin = requestOrigin && allowed.has(requestOrigin) ? requestOrigin : null;

    if (!origin) return errorResponse(403, null);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }
    if (request.method !== "POST") return errorResponse(405, origin);
    if (envGet("AI_ENABLED") === "false") return errorResponse(503, origin);

    const apiKey = envGet("ANTHROPIC_API_KEY")?.trim();
    const model = envGet("WORKFLOW_MAP_MODEL")?.trim() || envGet("BOT_BLUEPRINT_MODEL")?.trim() || DEFAULT_MODEL;
    if (!apiKey || !/^[a-zA-Z0-9._:-]{1,100}$/.test(model)) {
      return errorResponse(503, origin);
    }

    let input: WorkflowInput | null;
    try {
      input = await readWorkflowRequestBody(request);
    } catch {
      input = null;
    }
    if (!input) return errorResponse(400, origin);

    // Shares Bot Lab's per-visitor and site-wide daily AI budget.
    const rate = await consumeRateLimit(request, envGet, fetchImpl, now);
    if (rate === "unavailable") return errorResponse(503, origin);
    if (rate === "limited") return errorResponse(429, origin);

    const draft = await requestDraft(input, apiKey, model, fetchImpl);
    if (!draft) return errorResponse(502, origin);

    return new Response(
      JSON.stringify({ version: 1, source: "ai", task: input.task, ...draft }),
      { status: 200, headers: responseHeaders(origin) },
    );
  };
}
