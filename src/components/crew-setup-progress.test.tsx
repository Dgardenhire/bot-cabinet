import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CrewSetupProgress } from "./crew-setup-progress";

it("starts every checkpoint unchecked and distinguishes user records from verification", () => {
  const html = renderToStaticMarkup(<CrewSetupProgress members={[{ slug: "writer", name: "Writer" }]} steps={["Review files", "Import"]} />);
  expect(html).toContain("0 of 5 checkpoints recorded");
  expect(html).not.toContain('checked=""');
  expect(html).toContain("not automated verification");
  expect(html).toContain("Schedules remain inactive");
});
