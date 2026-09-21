import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { WorkbenchHub } from "./workbench-hub";

describe("WorkbenchHub", () => {
  it("renders a browser-local loading state without leaking task fields", () => {
    const html = renderToStaticMarkup(<WorkbenchHub bots={[{ slug: "scout", name: "Scout", title: "Topic finder", packVersion: "2.0.0" }]} />);
    expect(html).toContain("Loading this browser’s Bot workbench");
    expect(html).not.toContain("textarea");
    expect(html).not.toContain('type="text"');
  });
});
