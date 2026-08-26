import { describe, expect, it } from "vitest";

import { EMPTY_WORKSHOP_DRAFT, type WorkshopDraft } from "./workshop";
import {
  WorkshopAiError,
  applyWorkshopAiSuggestions,
  generateWorkshopAiSuggestions,
  getEmptyWorkshopAiSuggestionKeys,
  getBotBlueprintApiUrl,
  parseWorkshopAiResponse,
  type WorkshopAiResponse,
  type WorkshopAiSuggestions,
} from "./workshop-ai";

const suggestions: WorkshopAiSuggestions = {
  inputsContext: ["Approved source list", "Preferred briefing format"],
  outputsDeliverables: ["Five-item briefing", "Linked source list"],
  toolsIntegrations: ["Read-only access to approved documents"],
  approvalBoundaries: ["Ask before publishing", "Ask before contacting anyone"],
  cadenceTrigger: "When a person supplies the approved material.",
  firstRunTest: "Use three supplied articles to create one draft for review.",
  audienceSuccess: "The owner can review the result in five minutes.",
  accessSensitive: "Use sample material for the first test.",
  prohibitedUncertainty: "Ask a question when required information is missing.",
  continuityMemory: "Keep the approved format in the continuing conversation.",
  reviewCriteria: "Check every link and confirm each requested section is present.",
  profileTitle: "Prepares a morning briefing from approved sources",
  profileDescription: "Creates a concise, sourced briefing for review.",
  roleInstructions: "Prepare the requested briefing from approved material. Ask before taking any outside action.",
};

const validResponse: WorkshopAiResponse = {
  version: 1,
  source: "ai",
  suggestions,
};

describe("getBotBlueprintApiUrl", () => {
  it("accepts secure endpoints and local HTTP development endpoints", () => {
    expect(
      getBotBlueprintApiUrl(
        "https://project.supabase.co/functions/v1/bot-blueprint",
      ),
    ).toBe("https://project.supabase.co/functions/v1/bot-blueprint");
    expect(getBotBlueprintApiUrl("http://localhost:54321/functions/v1/bot-blueprint"))
      .toBe("http://localhost:54321/functions/v1/bot-blueprint");
  });

  it("rejects missing, credentialed, queried, and insecure remote endpoints", () => {
    expect(getBotBlueprintApiUrl("")).toBeNull();
    expect(getBotBlueprintApiUrl("http://example.com/function")).toBeNull();
    expect(getBotBlueprintApiUrl("https://user:pass@example.com/function")).toBeNull();
    expect(getBotBlueprintApiUrl("https://example.com/function?key=value")).toBeNull();
  });
});

describe("parseWorkshopAiResponse", () => {
  it("accepts the exact, bounded AI response contract", () => {
    expect(parseWorkshopAiResponse(validResponse)).toEqual(validResponse);
  });

  it("rejects extra keys and overlong values", () => {
    expect(() =>
      parseWorkshopAiResponse({ ...validResponse, provider: "example" }),
    ).toThrowError(WorkshopAiError);
    expect(() =>
      parseWorkshopAiResponse({
        ...validResponse,
        suggestions: {
          ...suggestions,
          profileTitle: "x".repeat(181),
        },
      }),
    ).toThrowError(WorkshopAiError);
  });
});

describe("generateWorkshopAiSuggestions", () => {
  it("never calls fetch when the endpoint is missing", async () => {
    let calls = 0;
    const fetchImpl: typeof fetch = async () => {
      calls += 1;
      return new Response();
    };

    await expect(
      generateWorkshopAiSuggestions(
        { botName: "Briefing Bot", jobOutcome: "Prepare a daily briefing." },
        { endpoint: null, fetchImpl },
      ),
    ).rejects.toMatchObject({ code: "unavailable" });
    expect(calls).toBe(0);
  });

  it("sends only the version, Bot name, and job description", async () => {
    let sentBody: unknown;
    const fetchImpl: typeof fetch = async (_input, init) => {
      sentBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify(validResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await generateWorkshopAiSuggestions(
      { botName: " Briefing Bot ", jobOutcome: " Prepare a daily briefing. " },
      {
        endpoint: "https://project.supabase.co/functions/v1/bot-blueprint",
        fetchImpl,
      },
    );

    expect(sentBody).toEqual({
      version: 1,
      botName: "Briefing Bot",
      jobOutcome: "Prepare a daily briefing.",
    });
    expect(result).toEqual(suggestions);
  });

  it("reports rate limiting without reading an error body", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response("provider details must stay hidden", { status: 429 });

    await expect(
      generateWorkshopAiSuggestions(
        { botName: "Briefing Bot", jobOutcome: "Prepare a daily briefing." },
        {
          endpoint: "https://project.supabase.co/functions/v1/bot-blueprint",
          fetchImpl,
        },
      ),
    ).rejects.toMatchObject({ code: "rate-limited" });
  });
});

describe("applyWorkshopAiSuggestions", () => {
  it("fills empty fields and keeps every existing entry", () => {
    const current: WorkshopDraft = {
      ...EMPTY_WORKSHOP_DRAFT,
      botName: "Briefing Bot",
      jobOutcome: "Prepare a daily briefing.",
      outputsDeliverables: "My existing output",
      reviewCriteria: "My existing review rule",
    };

    const result = applyWorkshopAiSuggestions(current, suggestions);

    expect(result.draft.inputsContext).toBe(
      "Approved source list\nPreferred briefing format",
    );
    expect(result.draft.outputsDeliverables).toBe("My existing output");
    expect(result.draft.reviewCriteria).toBe("My existing review rule");
    expect(result.draft.roleInstructions).toContain("Prepare the requested briefing");
    expect(result.filled).toHaveLength(12);
    expect(result.filled).not.toContain("outputsDeliverables");
    expect(result.filled).not.toContain("reviewCriteria");
  });

  it("reports which AI-covered fields still need suggestions", () => {
    const emptyDraft: WorkshopDraft = {
      ...EMPTY_WORKSHOP_DRAFT,
      botName: "Briefing Bot",
      jobOutcome: "Prepare a daily briefing.",
    };
    expect(getEmptyWorkshopAiSuggestionKeys(emptyDraft)).toHaveLength(14);

    const completedDraft = applyWorkshopAiSuggestions(emptyDraft, suggestions).draft;
    expect(getEmptyWorkshopAiSuggestionKeys(completedDraft)).toEqual([]);
  });
});
