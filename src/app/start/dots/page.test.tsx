import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StartPage from "../page";
import AgentWatchPage from "../../watch/page";
import sitemap from "../../sitemap";
import DotsStartPage, { metadata } from "./page";

describe("ChatGPT Dots first-use guide", () => {
  it("is discoverable without presenting Dots as a Bot import", () => {
    const start = renderToStaticMarkup(<StartPage />);
    const watch = renderToStaticMarkup(<AgentWatchPage />);

    expect(start).toContain('href="/start/dots"');
    expect(watch).toContain('href="/start/dots"');
    expect(watch).toContain("Specialist Dots are still limited to enterprise pilots");
    expect(sitemap()).toContainEqual(expect.objectContaining({
      url: "https://botcabinet.com/start/dots/",
      lastModified: new Date("2026-09-29"),
    }));
  });

  it("offers a bounded first task and states what has not been tested", () => {
    const html = renderToStaticMarkup(<DotsStartPage />);

    expect(metadata).toHaveProperty("title");
    expect(html).toContain("Give your Dot one clear job");
    expect(html).toContain("made-up commitments");
    expect(html).toContain("Do not connect apps, send messages");
    expect(html).toContain("has not task-tested this Dot workflow");
    expect(html).toContain("does not import a Cabinet Bot");
    expect(html).toContain("https://help.openai.com/en/articles/20001530-getting-started-with-your-dot");
  });
});
