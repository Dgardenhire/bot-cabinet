import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getStarterBot, STARTER_BOTS } from "@/data/starter-bots";
import { starterBotToPortablePackV2 } from "@/lib/portable-bot-pack-v2";
import { workspaceAgentBuilderText, workspaceAgentFirstTest } from "@/lib/chatgpt-workspace-setup";
import StartPage from "./page";
import HermesStartPage from "./hermes/page";
import ChatGPTStartPage, { generateStaticParams } from "./chatgpt/[slug]/page";

describe("first-use paths", () => {
  it("lets visitors choose Hermes or ChatGPT before a long setup guide", () => {
    const html = renderToStaticMarkup(<StartPage />);
    expect(html).toContain("Get one useful result from a Bot");
    expect(html).toContain('href="/start/hermes"');
    expect(html).toContain('href="/start/chatgpt/chief-of-staff"');
    expect(html).not.toContain("Follow the checkpoints");
    expect(renderToStaticMarkup(<HermesStartPage />)).toContain("Put Scout to work");
  });

  it("builds an honest, first-testable ChatGPT route for every starter Bot", async () => {
    expect(generateStaticParams()).toHaveLength(STARTER_BOTS.length);
    const html = renderToStaticMarkup(await ChatGPTStartPage({ params: Promise.resolve({ slug: "chief-of-staff" }) }));
    expect(html).toContain("Use Chief of Staff in ChatGPT");
    expect(html).toContain("does not import a Hermes archive");
    expect(html).toContain("Workspace Agent");
    expect(html).toContain("Copy agent instructions");
    expect(html).toContain("Use only these fictional updates");
    expect(html).toContain("not yet verified by Bot Cabinet");
  });

  it("keeps the role, boundaries, and sample test tied to the selected Bot", () => {
    const bot = getStarterBot("chief-of-staff");
    expect(bot).toBeDefined();
    const pack = starterBotToPortablePackV2(bot!);
    const instructions = workspaceAgentBuilderText(pack);
    expect(instructions).toContain(pack.job.outcome);
    expect(instructions).toContain(pack.instructions.durableRoleAndBoundaries);
    expect(instructions).toContain("Do not share or schedule");
    expect(workspaceAgentFirstTest(pack)).toContain("Do not assign work");
  });
});
