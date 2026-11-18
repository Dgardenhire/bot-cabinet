import { describe, expect, it } from "vitest";

import { draftWorkflowMap, getWorkflowApiUrl } from "./workflow-ai";

const BLUEPRINT = "https://project.supabase.co/functions/v1/bot-blueprint";

describe("workflow AI endpoint", () => {
  it("derives the workflow-map URL from Bot Lab's URL when none is set", () => {
    expect(getWorkflowApiUrl(undefined, BLUEPRINT)).toBe("https://project.supabase.co/functions/v1/workflow-map");
    expect(getWorkflowApiUrl("", BLUEPRINT)).toBe("https://project.supabase.co/functions/v1/workflow-map");
  });

  it("never returns Bot Lab's own endpoint", () => {
    expect(getWorkflowApiUrl(undefined, undefined) ?? "").not.toMatch(/bot-blueprint/);
    expect(getWorkflowApiUrl(undefined, "https://example.com/other")).toBeNull();
  });

  it("prefers an explicitly configured URL", () => {
    expect(getWorkflowApiUrl("https://fn.example/workflow-map", BLUEPRINT)).toBe("https://fn.example/workflow-map");
  });

  it("posts the map task to the derived endpoint", async () => {
    let calledUrl = "";
    const fetchImpl = (async (url: RequestInfo | URL) => {
      calledUrl = String(url);
      return new Response(JSON.stringify({
        version: 1, source: "ai", task: "map",
        map: { workflowName: "W", goal: "G", steps: [{ text: "Do it", who: "I", frequency: "weekly", minutes: 10, snags: [] }] },
      }), { status: 200 });
    }) as typeof fetch;
    const result = await draftWorkflowMap("A long enough description", {
      endpoint: getWorkflowApiUrl(undefined, BLUEPRINT),
      fetchImpl,
    });
    expect(calledUrl).toMatch(/workflow-map$/);
    expect(result.steps).toHaveLength(1);
  });
});
