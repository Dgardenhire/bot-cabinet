import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CabinetManualPage from "./page";

describe("Cabinet manual page", () => {
  const html = renderToStaticMarkup(<CabinetManualPage />);
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  it("puts the Install in Hermes button first and the terminal line after it", () => {
    const button = html.indexOf('href="hermes://plugin/install?repo=Dgardenhire/hermes-cabinet&amp;enable=1"');
    expect(button).toBeGreaterThan(-1);
    expect(button).toBeLessThan(html.indexOf("Prefer the terminal?"));
    expect(text).toContain("hermes plugins install Dgardenhire/hermes-cabinet --enable");
    expect(text).toContain("Hermes marks Cabinet as Unverified because it comes straight from GitHub.");
  });

  it("carries every section of the manual", () => {
    for (const heading of ["What it's for", "Getting it running", "Your first look", "Bot or no Bot", "Adding a Bot", "Build your own", "Bots that team up", "Changing your mind", "How the Bots tested", "Working with Hermes Bots", "Questions", "Credits", "Keep exploring"]) {
      expect(text).toContain(heading.replace("'", "&#x27;"));
    }
    expect(text).toContain("Cabinet is an independent plugin developed by Damon Gardenhire. It is not an official plugin for Hermes made by Nous Research.");
    expect(text).toContain("Karen X. Cheng");
    expect(html).toContain('href="https://hermesatlas.com/"');
  });

  it("uses screenshots that exist and headlines without periods or numbers", () => {
    const shots = [...new Set([...html.replaceAll("%2F", "/").matchAll(/(\/hermes-cabinet\/manual\/[a-z-]+\.jpg)/g)].map((match) => match[1]))];
    expect(shots.length).toBe(16);
    for (const shot of shots) expect(existsSync(`public${shot}`)).toBe(true);
    for (const heading of html.matchAll(/<h[123][^>]*>(.*?)<\/h[123]>/g)) {
      expect(heading[1]).not.toMatch(/\.\s*$/);
      expect(heading[1]).not.toMatch(/^\s*0\d/);
    }
    expect(text).not.toMatch(/this page|seamless|powerful|unlock|leverage/i);
  });
});
