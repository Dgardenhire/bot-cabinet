import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import WorkbenchPage, { metadata } from "./page";

describe("My Workbench page", () => {
  it("explains the local-only scope and does not claim an account or sync", () => {
    const html = renderToStaticMarkup(<WorkbenchPage />);
    expect(html).toContain("My Workbench");
    expect(html).toContain("stored in this browser");
    expect(html).toContain("does not sync between devices");
    expect(html).toContain("Loading this browser’s Bot workbench");
    expect(html).toContain("Does this job keep working?");
    expect(html).toContain("Loading this browser’s three-run trial");
    expect(html).toContain("Grok Bot, Muse, Instinct or another tool");
    expect(metadata).toBeTruthy();
  });
});
