import {
  type BlueprintInput,
  buildAnthropicRequestBody,
  errorResponse,
  extractProviderText,
  getClientIp,
  parseAllowedOrigins,
  parsePositiveInteger,
  parseSuggestions,
  readBlueprintRequestBody,
  responseHeaders,
  sha256Hex,
  type Suggestions,
} from "./core.ts";

const PROVIDER_TIMEOUT_MS = 15_000;
const RATE_LIMIT_TIMEOUT_MS = 5_000;

type RateLimitResult = "allowed" | "limited" | "unavailable";

type HandlerDependencies = {
  envGet?: (name: string) => string | undefined;
  fetchImpl?: typeof fetch;
  now?: () => Date;
};

async function consumeRateLimit(
  request: Request,
  envGet: (name: string) => string | undefined,
  fetchImpl: typeof fetch,
  now: () => Date,
): Promise<RateLimitResult> {
  const supabaseUrl = envGet("SUPABASE_URL")?.trim();
  const serviceRoleKey = envGet("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  // Supabase supplies the service-role key to Edge Functions. It is already a
  // private, high-entropy value, so it is a safe fallback for hashing the
  // requester IP. Deployments may still set a separate salt if desired.
  const salt = envGet("BOT_BLUEPRINT_RATE_SALT")?.trim() ?? serviceRoleKey;
  const clientIp = getClientIp(request);
  const requesterLimit = parsePositiveInteger(
    envGet("BOT_BLUEPRINT_DAILY_LIMIT"),
    10,
    100,
  );
  const globalLimit = parsePositiveInteger(
    envGet("BOT_BLUEPRINT_GLOBAL_DAILY_LIMIT"),
    50,
    10_000,
  );
  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !salt ||
    salt.length < 32 ||
    salt.length > 256 ||
    !clientIp ||
    requesterLimit === null ||
    globalLimit === null
  ) {
    return "unavailable";
  }

  const rateDate = now().toISOString().slice(0, 10);
  const requesterHash = await sha256Hex(`${salt}:${rateDate}:${clientIp}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RATE_LIMIT_TIMEOUT_MS);

  try {
    const url = new URL(
      "/rest/v1/rpc/consume_bot_blueprint_rate_limit",
      supabaseUrl,
    );
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_requester_hash: requesterHash,
        p_requester_daily_limit: requesterLimit,
        p_global_daily_limit: globalLimit,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return "unavailable";
    return (await response.json()) === true ? "allowed" : "limited";
  } catch {
    return "unavailable";
  } finally {
    clearTimeout(timeout);
  }
}

async function requestSuggestions(
  input: BlueprintInput,
  apiKey: string,
  model: string,
  fetchImpl: typeof fetch,
): Promise<Suggestions | null> {
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
      body: JSON.stringify(buildAnthropicRequestBody(input, model)),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const providerText = extractProviderText(await response.json());
    if (!providerText) return null;
    try {
      return parseSuggestions(JSON.parse(providerText));
    } catch {
      return null;
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function createBotBlueprintHandler(
  dependencies: HandlerDependencies = {},
): (request: Request) => Promise<Response> {
  const envGet = dependencies.envGet ?? ((name) => Deno.env.get(name));
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const now = dependencies.now ?? (() => new Date());

  return async (request: Request): Promise<Response> => {
    const requestOrigin = request.headers.get("origin");
    const allowedOrigins = parseAllowedOrigins(
      envGet("BOT_BLUEPRINT_ALLOWED_ORIGINS"),
    );
    const origin = requestOrigin && allowedOrigins.has(requestOrigin)
      ? requestOrigin
      : null;

    if (!origin) return errorResponse(403, null);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: responseHeaders(origin),
      });
    }
    if (request.method !== "POST") return errorResponse(405, origin);
    // The provider key enables AI by default. AI_ENABLED=false remains an
    // immediate kill switch without making the initial setup harder.
    if (envGet("AI_ENABLED") === "false") return errorResponse(503, origin);

    const apiKey = envGet("ANTHROPIC_API_KEY")?.trim();
    const model = envGet("BOT_BLUEPRINT_MODEL")?.trim() ??
      "claude-haiku-4-5-20251001";
    if (!apiKey || !/^[a-zA-Z0-9._:-]{1,100}$/.test(model)) {
      return errorResponse(503, origin);
    }

    let input: BlueprintInput | null;
    try {
      input = await readBlueprintRequestBody(request);
    } catch {
      input = null;
    }
    if (!input) return errorResponse(400, origin);

    const rateLimit = await consumeRateLimit(request, envGet, fetchImpl, now);
    if (rateLimit === "unavailable") return errorResponse(503, origin);
    if (rateLimit === "limited") return errorResponse(429, origin);

    const suggestions = await requestSuggestions(
      input,
      apiKey,
      model,
      fetchImpl,
    );
    if (!suggestions) return errorResponse(502, origin);

    return new Response(
      JSON.stringify({ version: 1, source: "ai", suggestions }),
      { status: 200, headers: responseHeaders(origin) },
    );
  };
}
