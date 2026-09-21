import { describe, expect, it } from "vitest";

import { AGENT_WATCH_ITEMS } from "@/data/agent-watch";
import { GET } from "./route";

describe("Agent Watch feed route", () => {
  it("serves static RSS with every current note", async () => {
    const response = GET();
    const body = await response.text();
    expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600");
    expect(body.match(/<item>/g)).toHaveLength(AGENT_WATCH_ITEMS.length);
    expect(body).toContain("What remains unproven:");
  });
});
