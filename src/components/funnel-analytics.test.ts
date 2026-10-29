import { describe, expect, it } from "vitest";
import { linchpinExitDestination } from "./funnel-analytics";

const page = "https://botcabinet.com/about/";

describe("LINCHPIN exit tracking", () => {
  it("names the LINCHPIN host and path a link leads to", () => {
    expect(linchpinExitDestination("https://linchpin.studio/", page)).toBe("linchpin.studio/");
    expect(linchpinExitDestination("https://linchpin.studio/ai-lab", page)).toBe("linchpin.studio/ai-lab");
    expect(linchpinExitDestination("https://ai-seminar.linchpin.studio/open-source?ref=x#top", page)).toBe("ai-seminar.linchpin.studio/open-source");
  });

  it("ignores email links, Bot Cabinet links and lookalike hosts", () => {
    expect(linchpinExitDestination("mailto:damon@linchpin.studio", page)).toBeNull();
    expect(linchpinExitDestination("/bots/", page)).toBeNull();
    expect(linchpinExitDestination("https://botcabinet.com/watch/", page)).toBeNull();
    expect(linchpinExitDestination("https://linchpin.studio.example.com/", page)).toBeNull();
    expect(linchpinExitDestination("https://notlinchpin.studio/", page)).toBeNull();
  });
});
