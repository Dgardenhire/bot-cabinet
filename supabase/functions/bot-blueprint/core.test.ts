import assert from "node:assert/strict";

import {
  BOT_BLUEPRINT_MAX_REQUEST_BYTES,
  buildAnthropicRequestBody,
  readBlueprintRequestBody,
} from "./core.ts";
import { createBotBlueprintHandler } from "./handler.ts";

const ORIGIN = "https://botcabinet.example";

const VALID_SUGGESTIONS = {
  inputsContext: ["Approved source material"],
  outputsDeliverables: ["A draft for review"],
  toolsIntegrations: ["No outside tools required for the first test"],
  approvalBoundaries: ["Ask before sending or publishing"],
  cadenceTrigger: "When a person supplies the approved material.",
  firstRunTest: "Use sample material to create one draft for review.",
  audienceSuccess: "The requester can use the result after checking it.",
  accessSensitive: "Use sample material for the first test.",
  prohibitedUncertainty: "Ask when required information is missing.",
  continuityMemory: "Keep the approved format in the continuing conversation.",
  reviewCriteria: "Check the result against the requested deliverables.",
  profileTitle: "Prepares a draft for review",
  profileDescription: "Creates the requested draft from approved material.",
  roleInstructions: "Complete the stated job and stop at every approval point.",
};

const ENV: Record<string, string> = {
  AI_ENABLED: "true",
  ANTHROPIC_API_KEY: "test-key",
  BOT_BLUEPRINT_ALLOWED_ORIGINS: ORIGIN,
  BOT_BLUEPRINT_RATE_SALT: "a-private-test-salt-that-is-long-enough",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_URL: "https://project.supabase.co",
};

function blueprintRequest(
  body: Record<string, unknown> = {
    version: 1,
    botName: "Briefing Bot",
    jobOutcome: "Prepare a briefing from approved sources.",
  },
): Request {
  return new Request("https://function.example/bot-blueprint", {
    method: "POST",
    headers: {
      "cf-connecting-ip": "203.0.113.10",
      "content-type": "application/json",
      origin: ORIGIN,
    },
    body: JSON.stringify(body),
  });
}

Deno.test("the request reader accepts valid Unicode and escaped text within the character limits", async () => {
  const unicodeBody = JSON.stringify({
    version: 1,
    botName: "机".repeat(100),
    jobOutcome: "界".repeat(2_000),
  });
  assert.ok(new TextEncoder().encode(unicodeBody).byteLength > 4_096);
  assert.ok(
    new TextEncoder().encode(unicodeBody).byteLength <
      BOT_BLUEPRINT_MAX_REQUEST_BYTES,
  );

  const unicodeResult = await readBlueprintRequestBody(
    new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: unicodeBody,
    }),
  );
  assert.equal(unicodeResult?.botName, "机".repeat(100));
  assert.equal(unicodeResult?.jobOutcome, "界".repeat(2_000));

  const escapedResult = await readBlueprintRequestBody(
    new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        version: 1,
        botName: "Quoted Bot",
        jobOutcome: '"'.repeat(2_000),
      }),
    }),
  );
  assert.equal(escapedResult?.jobOutcome, '"'.repeat(2_000));
});

Deno.test("the request reader rejects bodies above the 16 KB ceiling", async () => {
  const oversizedBody = JSON.stringify({
    version: 1,
    botName: "Oversized Bot",
    jobOutcome: "x".repeat(BOT_BLUEPRINT_MAX_REQUEST_BYTES),
  });
  assert.ok(
    new TextEncoder().encode(oversizedBody).byteLength >
      BOT_BLUEPRINT_MAX_REQUEST_BYTES,
  );

  const result = await readBlueprintRequestBody(
    new Request("https://example.test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: oversizedBody,
    }),
  );
  assert.equal(result, null);
});

Deno.test("the Anthropic request uses a strict structured-output schema", () => {
  const body = buildAnthropicRequestBody(
    {
      version: 1,
      botName: "Briefing Bot",
      jobOutcome: "Prepare a briefing.",
    },
    "claude-haiku-4-5-20251001",
  );

  assert.equal(body.output_config.format.type, "json_schema");
  assert.equal(body.output_config.format.schema.additionalProperties, false);
  assert.deepEqual(
    body.output_config.format.schema.required,
    Object.keys(VALID_SUGGESTIONS),
  );
});

Deno.test("the handler rejects an unapproved origin before using external services", async () => {
  let fetchCalls = 0;
  const handler = createBotBlueprintHandler({
    envGet: (name) => ENV[name],
    fetchImpl: async () => {
      fetchCalls += 1;
      return new Response();
    },
  });
  const request = blueprintRequest();
  request.headers.set("origin", "https://attacker.example");

  const response = await handler(request);
  assert.equal(response.status, 403);
  assert.equal(fetchCalls, 0);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

Deno.test("the handler rejects extra request fields before rate limiting", async () => {
  let fetchCalls = 0;
  const handler = createBotBlueprintHandler({
    envGet: (name) => ENV[name],
    fetchImpl: async () => {
      fetchCalls += 1;
      return new Response();
    },
  });

  const response = await handler(blueprintRequest({
    version: 1,
    botName: "Briefing Bot",
    jobOutcome: "Prepare a briefing.",
    hiddenInstruction: "extra",
  }));
  assert.equal(response.status, 400);
  assert.equal(fetchCalls, 0);
});

Deno.test("the handler stops at the daily limit without calling Anthropic", async () => {
  const requestedUrls: string[] = [];
  const handler = createBotBlueprintHandler({
    envGet: (name) => ENV[name],
    fetchImpl: async (input) => {
      requestedUrls.push(String(input));
      return new Response("false", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  const response = await handler(blueprintRequest());
  assert.equal(response.status, 429);
  assert.equal(requestedUrls.length, 1);
  assert.match(requestedUrls[0], /consume_bot_blueprint_rate_limit/);
});

Deno.test("the handler returns validated AI suggestions and sends only the approved user fields", async () => {
  const calls: Array<{ url: string; body: unknown }> = [];
  const handler = createBotBlueprintHandler({
    envGet: (name) => ENV[name],
    fetchImpl: async (input, init) => {
      const url = String(input);
      calls.push({
        url,
        body: typeof init?.body === "string" ? JSON.parse(init.body) : null,
      });
      if (url.includes("consume_bot_blueprint_rate_limit")) {
        return new Response("true", {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({
          content: [{ type: "text", text: JSON.stringify(VALID_SUGGESTIONS) }],
          stop_reason: "end_turn",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    },
    now: () => new Date("2026-08-25T12:00:00.000Z"),
  });

  const response = await handler(blueprintRequest());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), ORIGIN);
  assert.equal(calls.length, 2);

  const rateLimitBody = calls[0].body as Record<string, unknown>;
  assert.equal(rateLimitBody.p_global_daily_limit, 50);

  const providerBody = calls[1].body as Record<string, unknown>;
  assert.deepEqual(providerBody.messages, [{
    role: "user",
    content:
      "User-provided Bot name and job description follow as JSON data:\n" +
      JSON.stringify({
        version: 1,
        botName: "Briefing Bot",
        jobOutcome: "Prepare a briefing from approved sources.",
      }),
  }]);
  assert.equal(
    ((providerBody.output_config as Record<string, unknown>).format as Record<
      string,
      unknown
    >).type,
    "json_schema",
  );

  const responseBody = await response.json();
  assert.deepEqual(responseBody, {
    version: 1,
    source: "ai",
    suggestions: VALID_SUGGESTIONS,
  });
});

Deno.test("the handler rejects malformed provider output", async () => {
  let call = 0;
  const handler = createBotBlueprintHandler({
    envGet: (name) => ENV[name],
    fetchImpl: async () => {
      call += 1;
      if (call === 1) return new Response("true", { status: 200 });
      return new Response(
        JSON.stringify({
          content: [{ type: "text", text: "not json" }],
          stop_reason: "end_turn",
        }),
        { status: 200 },
      );
    },
  });

  const response = await handler(blueprintRequest());
  assert.equal(response.status, 502);
});
