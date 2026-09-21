import { describe, expect, it } from "vitest";

import { AGENT_WATCH_RSS_URL } from "@/lib/agent-watch-live";
import { GET } from "./route";

describe("Agent Watch feed route", () => {
  it("sends feed readers to the human-reviewed live RSS feed", async () => {
    const response = GET();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(AGENT_WATCH_RSS_URL);
    expect(response.headers.get("cache-control")).toContain("max-age=300");
  });
});
