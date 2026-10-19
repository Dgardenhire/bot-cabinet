import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CabinetForHermesPage from "./page";

describe("Bot Cabinet in Hermes page", () => {
  const html = renderToStaticMarkup(<CabinetForHermesPage />);
  const text = html.replace(/<[^>]+>/g, " ");

  it("installs from inside Hermes Desktop first, keeps the terminal line as a fallback, and links the manual on botcabinet.com", () => {
    expect(html).toContain('href="hermes://plugin/install?catalog=bot-cabinet-v2"');
    expect(text).toContain("Find Cabinet in the plugin catalog");
    expect(text).toContain("Install in Hermes");
    expect(text).toContain("Open Cabinet in the sidebar");
    expect(text).toContain("Prefer the terminal?");
    expect(text.replace(/\s+/g, " ")).toContain("hermes plugins install Dgardenhire/hermes-cabinet --enable");
    expect(text).toContain("On Windows, open PowerShell. On a Mac or Linux, open Terminal.");
    expect(html.indexOf("hermes://plugin/install")).toBeLessThan(html.indexOf("Prefer the terminal?"));
    expect(html).toContain('href="https://github.com/Dgardenhire/hermes-cabinet"');
    expect(html).toMatch(/href="\/hermes\/manual\/?"/);
    expect(html).not.toContain("linchpin.studio/hermes/cabinet");
  });

  it("says plainly that it is independent and sits beside the Hermes Bots catalog", () => {
    expect(text).toContain("Cabinet is an independent plugin developed by Damon Gardenhire. It is not an official plugin for Hermes made by Nous Research.");
    expect(text).toContain("When Hermes carries a Bot in its own Bots catalog, Cabinet sends you there to add it, so you never get two copies.");
  });

  it("reports the recorded task runs without overstating testing", () => {
    expect(text).toContain("Today 4 of the 21 Bots have a recorded task run.");
  });

  it("uses local art and real screenshots, and keeps headlines free of periods and section numbers", () => {
    const decoded = decodeURIComponent(html);
    const images = ["/hermes-cabinet/cabinet-art.jpg", "/hermes-cabinet/card.jpg", "/hermes-cabinet/start.jpg", "/hermes-cabinet/fit-answer-crew.jpg", "/hermes-cabinet/add-review.jpg"];
    for (const image of images) {
      expect(decoded).toContain(image);
      expect(existsSync(`public${image}`)).toBe(true);
    }
    for (const heading of html.matchAll(/<h[123][^>]*>(.*?)<\/h[123]>/g)) {
      expect(heading[1]).not.toMatch(/\.\s*$/);
      expect(heading[1]).not.toMatch(/^\s*0\d/);
    }
    expect(text).not.toMatch(/this page|seamless|powerful|unlock|leverage/i);
  });
});
