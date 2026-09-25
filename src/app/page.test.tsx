import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";
import WorkbenchPage from "./workbench/page";

describe("homepage returning-use path", () => {
  it("links a current user directly to the bounded Three-Run Trial", () => {
    const home = renderToStaticMarkup(<Home />);
    const workbench = renderToStaticMarkup(<WorkbenchPage />);

    expect(home).toContain("Already using an agent? Compare three real runs");
    expect(home).toContain('href="/workbench#three-run-trial"');
    expect(home).toContain('data-funnel-event="homepage_three_run_trial"');
    expect(workbench).toContain('id="three-run-trial"');
    expect(workbench).toContain("Does this job keep working?");
  });
});
