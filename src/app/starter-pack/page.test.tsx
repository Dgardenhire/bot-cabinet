import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StarterPackPage from "./page";
describe("starter pack landing page", () => {
 const html = renderToStaticMarkup(createElement(StarterPackPage));
 it("requires signup without embedding pack content", () => {
  expect(html).toContain("<form"); expect(html).toContain("Subscribe and get the starter pack");
  expect(html).not.toContain("<article"); expect(html).not.toContain("<pre"); expect(html).not.toContain("Copy prompt");
 });
 it("explains the existing weekly newsletter and subscriber gifts", () => {
  expect(html).toContain("One email on Mondays"); expect(html).toContain("Already subscribed?"); expect(html).toContain("https://ai-seminar.linchpin.studio/open-source");
 });
});
