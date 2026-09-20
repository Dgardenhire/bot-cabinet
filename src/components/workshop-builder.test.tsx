import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// Resolve the app's aliases locally without changing the repository test config.
vi.mock("@/lib/workshop", () => import("../lib/workshop"));
vi.mock("@/lib/workshop-ai", () => import("../lib/workshop-ai"));
vi.mock("@/data/starter-bots", () => import("../data/starter-bots"));
vi.mock("@/data/workshop-job-starters", () => import("../data/workshop-job-starters"));
vi.mock("@/lib/bot-passport", () => import("../lib/bot-passport"));
vi.mock("@/lib/hermes-profile", () => import("../lib/hermes-profile"));
vi.mock("@/lib/browser-download", () => import("../lib/browser-download"));
vi.mock("@/components/workshop-live-drawing", () => ({ WorkshopLiveDrawing: () => null }));
vi.mock("@/components/bot-passport-panel", () => ({ BotPassportPanel: () => null }));

import { WorkshopBuilder } from "./workshop-builder";

describe("WorkshopBuilder download readiness", () => {
  it("offers an explicitly incomplete draft without unlocking setup exports", () => {
    const markup = renderToStaticMarkup(<WorkshopBuilder />);
    const buttons = markup.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
    const draftButtons = buttons.filter((button) => button.includes("Save incomplete Markdown draft"));
    expect(draftButtons).toHaveLength(2);
    expect(draftButtons.every((button) => !button.includes('disabled=""'))).toBe(true);
    const setupButtons = buttons.filter((button) => /data-funnel-event="bot_lab_(?:profile|pdf|passport)_download"/.test(button));
    expect(setupButtons).toHaveLength(6);
    expect(setupButtons.every((button) => button.includes('disabled=""'))).toBe(true);
    expect(markup).toContain("This draft is not ready for setup");
    expect(markup).not.toContain("Your Bot package is ready");
  });
});
