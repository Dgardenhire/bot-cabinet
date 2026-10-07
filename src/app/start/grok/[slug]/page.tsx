import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { STARTER_BOTS, getStarterBot } from "@/data/starter-bots";
import { starterBotToPortablePackV2 } from "@/lib/portable-bot-pack-v2";
import { buildPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return STARTER_BOTS.map((bot) => ({ slug: bot.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  if (!bot) return {};
  return buildPageMetadata({
    title: `Build ${bot.name} in Grok Bot · Bot Cabinet`,
    description: `Set up ${bot.name} in Grok Bot, copy its job description, and try a first task. Manual setup; Grok runtime test pending.`,
    path: `/start/grok/${slug}/`,
    image: "/brand/social/grok-bot-templates-1200x630.jpg",
    imageAlt: `Bot Cabinet guide to building ${bot.name} in Grok Bot`,
  });
}

export default async function GrokBotSetupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bot = getStarterBot(slug);
  if (!bot) notFound();

  const pack = starterBotToPortablePackV2(bot);
  const job = pack.instructions.durableRoleAndBoundaries;
  const firstTask = `${pack.job.firstMission}\n\nUse only the material I give you or sources I approve. If required input is missing, ask me before starting. Return ${pack.job.outputs.join(", ").toLowerCase()}. Stop after the result and let me review it. Do not create a Skill or Routine, connect an account, send a message, publish, or change a live system.`;

  return (
    <main id="main-content" className="page-main workspace-start-page">
      <div className="shell workspace-start-wrap">
        <Link href={`/bots/${slug}`} className="text-link"><ArrowLeft size={16} aria-hidden="true" /> Back to {bot.name}</Link>
        <header className="workspace-start-header">
          <Eyebrow>Grok Bot · guided setup</Eyebrow>
          <h1>Build {bot.name} in Grok Bot</h1>
          <p>Give it one clear job, try one small task, and judge the result before you add tools or a schedule.</p>
          <div className="workspace-start-status">Not yet tested in Grok Bot</div>
        </header>

        <ol className="workspace-start-steps">
          <li>
            <span className="workspace-start-step-number">1</span>
            <div>
              <h2>Open Grok Bot</h2>
              <p>You need access to Grok Bot. In the app, choose <strong>New → Create new Bot</strong>, then open Edit Profile. Bot Cabinet cannot install this Bot in your account for you.</p>
              <a href="https://x.ai/bot" className="text-link" target="_blank" rel="noopener noreferrer">Open Grok Bot <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">2</span>
            <div>
              <h2>Add the instructions</h2>
              <p>Set its name to <strong>{bot.name}</strong>. Copy this into its description, review the limits, and save the profile. You can refine it after the first result.</p>
              <div className="workspace-start-copy"><CopyTextButton text={job} label="Copy job description" analyticsEvent="grok_role_copy" analyticsSurface={`grok_setup_${slug}`} /><pre>{job}</pre></div>
              <p className="workspace-start-small">Keep private data, passwords, and account access out of the description. <a href="https://docs.x.ai/grok-bot/bots" target="_blank" rel="noopener noreferrer">Official profile instructions</a></p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">3</span>
            <div>
              <h2>Try one task</h2>
              <p>Provide the input it needs, then paste this message into {bot.name}. For the first run, use sample or public material whenever possible.</p>
              <ul className="grok-setup-inputs">{pack.job.inputs.map((input) => <li key={input}>{input}</li>)}</ul>
              <div className="workspace-start-copy"><CopyTextButton text={firstTask} label="Copy first task" analyticsEvent="grok_first_task_copy" analyticsSurface={`grok_setup_${slug}`} /><pre>{firstTask}</pre></div>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">4</span>
            <div>
              <h2>Decide if it helped</h2>
              <p>Check whether you got a useful result, whether claims can be checked, and whether it stayed within the job you gave it. {pack.job.checkpoint} If it misses, correct the job or supply the missing input and try again.</p>
              <p>Only after repeated manual runs work should you consider a Skill, Routine, or outside connection. Review access and approvals first.</p>
            </div>
          </li>
        </ol>

        <footer className="workspace-start-footer">
          <h2>Download the full instructions</h2>
          <p>The brief includes Skill instructions, a proposed Routine, and access limits. Set these up manually in Grok Bot. Downloading it does not activate a Routine. It is not an import file, and this setup has not been tested in the app.</p>
          <div className="button-row"><a href={pack.platforms.grokBot.briefUrl} download className="button button-secondary">Download the full brief <DownloadSimple size={16} aria-hidden="true" /></a><Link href={`/bots/${slug}`} className="button button-secondary">Review {bot.name} in the Cabinet</Link></div>
        </footer>
      </div>
    </main>
  );
}
