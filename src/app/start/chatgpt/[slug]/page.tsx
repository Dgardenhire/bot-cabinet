import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { ChatGPTFirstTestPrompt } from "@/components/chatgpt-first-test-prompt";
import { Eyebrow } from "@/components/ui";
import { STARTER_BOTS, getStarterBot } from "@/data/starter-bots";
import { workspaceAgentBuilderText, workspaceAgentFirstTest } from "@/lib/chatgpt-workspace-setup";
import { buildPageMetadata } from "@/lib/metadata";
import { portableBotPackV2ArtifactPaths, starterBotToPortablePackV2 } from "@/lib/portable-bot-pack-v2";

export function generateStaticParams() {
  return STARTER_BOTS.map((bot) => ({ slug: bot.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  if (!bot) return {};
  return buildPageMetadata({
    title: `Use ${bot.name} in ChatGPT`,
    description: `Set up ${bot.name} as a private ChatGPT Workspace Agent and try one real task before sharing it.`,
    path: `/start/chatgpt/${slug}/`,
    image: "/brand/social/first-bot-1200x630.jpg",
    imageAlt: `Use ${bot.name} in a ChatGPT workspace`,
  });
}

export default async function ChatGPTStartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  if (!bot) notFound();
  const pack = starterBotToPortablePackV2(bot);
  const paths = portableBotPackV2ArtifactPaths(slug);
  const builderText = workspaceAgentBuilderText(pack);
  const firstTest = workspaceAgentFirstTest(pack);

  return (
    <main id="main-content" className="page-main workspace-start-page">
      <div className="shell workspace-start-wrap">
        <Link href="/start" className="text-link"><ArrowLeft size={16} aria-hidden="true" /> Choose another way to start</Link>
        <header className="workspace-start-header">
          <Eyebrow>ChatGPT Workspace Agent · guided setup</Eyebrow>
          <h1>Use {bot.name} in ChatGPT</h1>
          <p>{bot.summary} This path helps you build and test the role in your own workspace. It does not import a Hermes archive.</p>
          <div className="workspace-start-status">Prepared instructions · ChatGPT setup and task run not yet verified by Bot Cabinet</div>
        </header>

        <ol className="workspace-start-steps">
          <li>
            <span className="workspace-start-step-number">1</span>
            <div>
              <h2>Check access</h2>
              <p>Workspace Agents are in research preview for Business, Enterprise, and Edu. Your admin must enable them and give you permission to create one. If you do not see the builder, ask your admin. You can still use the <Link href={`/bots/${slug}`}>Bot&apos;s readable plan</Link> in another tool.</p>
              <a href="https://developers.openai.com/cookbook/articles/chatgpt-agents-sales-meeting-prep" className="text-link" target="_blank" rel="noopener noreferrer">Read OpenAI&apos;s Workspace Agent guide <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">2</span>
            <div>
              <h2>Create a private agent</h2>
              <p>Open the agent builder and paste this job description. Check every instruction before saving it. Do not connect apps or give it access to work files yet.</p>
              <div className="workspace-start-copy"><CopyTextButton text={builderText} label="Copy agent instructions" analyticsEvent="chatgpt_agent_instructions_copy" analyticsSurface="chatgpt_start" /><details><summary>Read the full instructions</summary><pre>{builderText}</pre></details></div>
              <a href="https://chatgpt.com/agents/studio/new" className="text-link" target="_blank" rel="noopener noreferrer">Open the ChatGPT agent builder <ArrowRight size={16} aria-hidden="true" /></a>
              <p className="workspace-start-small">Optional: <a href={paths.portableSkillUrl} download>download {bot.name}&apos;s Skill file <DownloadSimple size={15} aria-hidden="true" /></a>. If your workspace supports Skills, review the file before adding it. The text above is enough for the first test.</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">3</span>
            <div>
              <h2>Try one small task</h2>
              <p>Use Preview privately. For the first try, use fictional or public information. Paste this task and inspect the answer yourself.</p>
              <div className="workspace-start-copy"><CopyTextButton text={firstTest} label="Copy first test" analyticsEvent="chatgpt_agent_first_test_copy" analyticsSurface="chatgpt_start" /><pre>{firstTest}</pre></div>
              <p><strong>Look for:</strong> {pack.job.checkpoint} If it misses that mark, change the instructions and try again.</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">4</span>
            <div>
              <h2>Add access only when needed</h2>
              <p>Review each file and app connection with your workspace&apos;s rules. Keep actions that send, edit, publish, or delete on “ask first.” Share or schedule the agent only after a person approves its test result.</p>
              <p className="workspace-start-small">Bot Cabinet has prepared this adaptation; we have not tested it in your ChatGPT workspace or confirmed that it works like the Hermes profile.</p>
            </div>
          </li>
        </ol>

        <ChatGPTFirstTestPrompt bot={slug} />

        <footer className="workspace-start-footer">
          <h2>Want a different job?</h2>
          <p>Every Cabinet starter Bot has its own version of this setup path.</p>
          <Link href="/bots" className="button button-secondary">Browse the Bots <ArrowRight size={16} aria-hidden="true" /></Link>
        </footer>
      </div>
    </main>
  );
}
