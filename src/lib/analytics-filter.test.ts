import { describe, expect, it } from "vitest";
import { filterAnalyticsEvent, isInternalBrowser, redactPackToken, rescuedPackLink } from "./analytics-filter";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe("analytics filter", () => {
  it("redacts Starter Pack tokens whether the # arrives plain or encoded", () => {
    expect(redactPackToken("https://botcabinet.com/starter-pack/#access=abc.DEF-123")).toBe("https://botcabinet.com/starter-pack/#access=redacted");
    expect(redactPackToken("https://botcabinet.com/starter-pack/%23access=abc.DEF-123/")).toBe("https://botcabinet.com/starter-pack/%23access=redacted/");
    expect(redactPackToken("https://botcabinet.com/starter-pack/%2523access%3Dabc/")).toBe("https://botcabinet.com/starter-pack/%2523access%3Dredacted/");
    expect(redactPackToken("https://botcabinet.com/guides/x/#access-rules")).toBe("https://botcabinet.com/guides/x/#access-rules");
  });

  it("finds the token in a 404 path and builds the working pack link", () => {
    expect(rescuedPackLink("/starter-pack/%23access=abc.DEF-123/")).toBe("/starter-pack/#access=abc.DEF-123");
    expect(rescuedPackLink("/starter-pack/%23access%3Dabc")).toBe("/starter-pack/#access=abc");
    expect(rescuedPackLink("/starter-pack/%2523access=abc/")).toBe("/starter-pack/#access=abc");
    expect(rescuedPackLink("/bots/missing/")).toBeNull();
  });

  it("drops every event from a browser flagged internal until the flag is cleared", () => {
    const storage = memoryStorage();
    expect(isInternalBrowser("https://botcabinet.com/", storage)).toBe(false);
    expect(filterAnalyticsEvent({ type: "pageview", url: "https://botcabinet.com/?bc_internal=1" }, storage)).toBeNull();
    expect(filterAnalyticsEvent({ type: "event", url: "https://botcabinet.com/bots/" }, storage)).toBeNull();
    expect(filterAnalyticsEvent({ type: "pageview", url: "https://botcabinet.com/?bc_internal=0" }, storage)).not.toBeNull();
    expect(filterAnalyticsEvent({ type: "pageview", url: "https://botcabinet.com/bots/" }, storage)).toEqual({ type: "pageview", url: "https://botcabinet.com/bots/" });
  });

  it("still drops a flagged page when storage is unavailable", () => {
    expect(filterAnalyticsEvent({ type: "pageview", url: "https://botcabinet.com/?bc_internal=1" }, undefined)).toBeNull();
    expect(filterAnalyticsEvent({ type: "pageview", url: "https://botcabinet.com/" }, undefined)).not.toBeNull();
  });
});
