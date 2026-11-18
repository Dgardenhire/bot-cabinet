import assert from "node:assert/strict";

import {
  extractJsonObject,
  parseDiagnoseResult,
  parseMapResult,
  parseWorkflowRequestBody,
} from "./core.ts";
import { createWorkflowMapHandler } from "./handler.ts";

const ORIGIN = "https://botcabinet.example";
const ENV: Record<string, string> = {
  ANTHROPIC_API_KEY: "test-key",
  BOT_BLUEPRINT_ALLOWED_ORIGINS: ORIGIN,
  BOT_BLUEPRINT_RATE_SALT: "a-private-test-salt-that-is-long-enough",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_URL: "https://project.supabase.co",
};

const MAP_REPLY = {
  workflowName: "Weekly client update",
  goal: "Keep clients informed without a meeting.",
  steps: [
    { text: "Pull numbers from spreadsheets", who: "I", frequency: "weekly", minutes: 45, snags: ["copying", "hunting"] },
    { text: "Send the email", who: "I", frequency: "weekly", minutes: 10, snags: [] },
  ],
};

function request(body: unknown, origin = ORIGIN): Request {
  return new Request("https://fn.example/workflow-map", {
    method: "POST",
    headers: { "content-type": "application/json", origin, "cf-connecting-ip": "203.0.113.9" },
    body: JSON.stringify(body),
  });
}

function fakeFetch(providerText: string): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/rest/v1/rpc/")) return new Response("true", { status: 200 });
    return new Response(
      JSON.stringify({ stop_reason: "end_turn", content: [{ type: "text", text: providerText }] }),
      { status: 200 },
    );
  }) as typeof fetch;
}

Deno.test("accepts only the two task shapes", () => {
  assert.ok(parseWorkflowRequestBody({ version: 1, task: "map", description: "I send a weekly update to clients." }));
  assert.equal(parseWorkflowRequestBody({ version: 1, task: "map", description: "short" }), null);
  assert.equal(parseWorkflowRequestBody({ version: 1, task: "map", description: "long enough text", extra: 1 }), null);
  assert.equal(parseWorkflowRequestBody({ version: 1, task: "other" }), null);
  assert.ok(parseWorkflowRequestBody({
    version: 1, task: "diagnose", workflowName: "", goal: "",
    step: MAP_REPLY.steps[0],
  }));
  assert.equal(parseWorkflowRequestBody({
    version: 1, task: "diagnose", workflowName: "", goal: "",
    step: { ...MAP_REPLY.steps[0], snags: ["bogus"] },
  }), null);
});

Deno.test("parses JSON from a plain-text reply, fences tolerated", () => {
  assert.deepEqual(extractJsonObject("```json\n{\"a\":1}\n```"), { a: 1 });
  assert.equal(extractJsonObject("no json here"), null);
  assert.ok(parseMapResult(MAP_REPLY));
  assert.equal(parseMapResult({ ...MAP_REPLY, steps: [] }), null);
  assert.ok(parseDiagnoseResult({ whys: ["a", "b", "c"], outcome: "Done in 15 minutes." }));
  assert.equal(parseDiagnoseResult({ whys: [], outcome: "x" }), null);
});

Deno.test("handler returns a bounded map draft", async () => {
  const handler = createWorkflowMapHandler({
    envGet: (name) => ENV[name],
    fetchImpl: fakeFetch("Here you go:\n" + JSON.stringify(MAP_REPLY)),
  });
  const response = await handler(request({ version: 1, task: "map", description: "I send a weekly update to each client." }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.task, "map");
  assert.equal(body.map.steps.length, 2);
});

Deno.test("handler refuses unknown origins and bad model output", async () => {
  const handler = createWorkflowMapHandler({ envGet: (name) => ENV[name], fetchImpl: fakeFetch("not json") });
  assert.equal((await handler(request({ version: 1, task: "map", description: "x".repeat(20) }, "https://evil.example"))).status, 403);
  assert.equal((await handler(request({ version: 1, task: "map", description: "x".repeat(20) }))).status, 502);
});

Deno.test("AI_ENABLED=false is a kill switch", async () => {
  const handler = createWorkflowMapHandler({
    envGet: (name) => (name === "AI_ENABLED" ? "false" : ENV[name]),
    fetchImpl: fakeFetch("{}"),
  });
  assert.equal((await handler(request({ version: 1, task: "map", description: "x".repeat(20) }))).status, 503);
});
