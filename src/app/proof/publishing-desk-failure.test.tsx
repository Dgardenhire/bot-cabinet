import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProofRoomDetailPage from "./[slug]/page";
import ProofRoomPage from "./page";

describe("Publishing Desk Proof Room failure", () => {
  it("shows the failed acceptance state in the Proof Room library", () => {
    const markup = renderToStaticMarkup(<ProofRoomPage />);
    expect(markup).toContain("Runtime passed once");
    expect(markup).toContain("one fixture passed; independent reproduction pending");
    expect(markup).toContain("Five roles reach a source-checked draft and the required human-review hold");
  });

  it("does not present the failed handoff as a reproduced Bot result", async () => {
    const page = await ProofRoomDetailPage({
      params: Promise.resolve({ slug: "publishing-desk-failed-handoff" }),
    });
    const markup = renderToStaticMarkup(page);
    expect(markup).toContain("Open the Crew Kit");
    expect(markup).toContain("Download the Crew Kit");
    expect(markup).toContain("Editor caught three unsupported directions");
    expect(markup).toContain("Inspect the latest simplified-Writer result");
    expect(markup).toContain("human-review hold");
    expect(markup).toContain("independent second run is required");
    expect(markup).not.toContain("exact package passed twice");
  });
});
