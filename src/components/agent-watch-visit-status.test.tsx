import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AgentWatchVisitStatus } from "./agent-watch-visit-status";

describe("AgentWatchVisitStatus", () => {
  it("renders a truthful loading state before browser-private data is available", () => {
    const html = renderToStaticMarkup(<AgentWatchVisitStatus slugs={["one-note"]} />);
    expect(html).toContain("Checking this browser for new Agent Watch notes");
    expect(html).not.toContain("new field note since");
  });
});
