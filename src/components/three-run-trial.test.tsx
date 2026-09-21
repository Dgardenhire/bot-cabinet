import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThreeRunTrial } from "./three-run-trial";

describe("ThreeRunTrial", () => {
  it("starts with an honest browser-local loading state", () => {
    const html = renderToStaticMarkup(<ThreeRunTrial />);
    expect(html).toContain("Loading this browser’s three-run trial");
    expect(html).not.toContain("independent verification or a reliability guarantee");
  });
});
