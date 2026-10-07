import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Start with Grok Bot · Try Scout",
  description: "Build Scout manually in Grok Bot and try one small, source-based task before adding a Skill or Routine.",
  path: "/start/grok/",
  image: "/brand/social/grok-bot-templates-1200x630.jpg",
  imageAlt: "Try Scout in Grok Bot with a manual first-use guide",
});

const role = `Name: Scout
Job: Find useful developments and ideas in subjects I choose.
Description: Search only the subjects and sources I approve. Return a short ranked list with a working link and a plain explanation for each item. Mark missing or uncertain information. Ask before contacting anyone, changing a schedule, or connecting an account. Do not publish.`;

const firstTask = `Practice task: Read only these three public pages:
https://docs.x.ai/grok-bot/bots
https://docs.x.ai/grok-bot/skills-routines-and-automations
https://docs.x.ai/grok-bot/approvals-security-and-privacy

Find three practical ideas that would help someone set up a reliable first Grok Bot. For each idea, give the exact source link and one sentence explaining why it matters. If a page cannot be opened, say so; do not guess. Do not create a Skill or Routine, connect an account, send a message, or change a file. Stop after the brief so I can review it.`;

export default function GrokStartPage() {
  return (
    <main id="main-content" className="page-main workspace-start-page">
      <div className="shell workspace-start-wrap">
        <Link href="/start" className="text-link"><ArrowLeft size={16} aria-hidden="true" /> Choose another way to start</Link>
        <header className="workspace-start-header">
          <Eyebrow>Grok Bot · manual setup</Eyebrow>
          <h1>Try Scout in Grok Bot</h1>
          <p>Scout looks through sources you choose and returns a short, linked brief. Build it in Grok Bot, try one public-source task, and judge the result yourself.</p>
          <div className="workspace-start-status">Not yet tested in Grok Bot</div>
        </header>

        <ol className="workspace-start-steps">
          <li>
            <span className="workspace-start-step-number">1</span>
            <div>
              <h2>Check access</h2>
              <p>You need Grok Bot and an eligible plan. If you do not have the app yet, follow its official setup guide before continuing.</p>
              <a href="https://x.ai/bot/guides/grok-bot-101" className="text-link" target="_blank" rel="noopener noreferrer">Open Grok Bot 101 <ArrowRight size={16} aria-hidden="true" /></a>
              <p className="workspace-start-small">xAI also has <a href="https://x.ai/bot/guides">work examples and template guides</a>. Native Grok Bot templates can open in the app; Scout&apos;s Cabinet brief below is not one of those installable links.</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">2</span>
            <div>
              <h2>Create Scout</h2>
              <p>In Grok Bot, choose New, then Create new Bot. Name it Scout and use this description as a starting point. Review it before saving. No app connections are needed for the practice task.</p>
              <div className="workspace-start-copy"><CopyTextButton text={role} label="Copy Scout's job" analyticsEvent="grok_scout_role_copy" analyticsSurface="grok_start" /><pre>{role}</pre></div>
              <p className="workspace-start-small">Want the full instructions? <a href="/downloads/grok-bot-templates/scout.md" download>Download Scout&apos;s Grok build brief <DownloadSimple size={15} aria-hidden="true" /></a>. Use it for manual setup; it cannot be imported.</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">3</span>
            <div>
              <h2>Try one small task</h2>
              <p>Paste this public-source practice task into Scout. Keep it to one run; do not add a schedule or outside accounts yet.</p>
              <div className="workspace-start-copy"><CopyTextButton text={firstTask} label="Copy first task" analyticsEvent="grok_scout_first_test_copy" analyticsSurface="grok_start" /><pre>{firstTask}</pre></div>
              <p><strong>Check the result:</strong> Can you open each link? Does the linked page support the idea? Did Scout flag anything it could not verify? If not, correct the job description and try again.</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">4</span>
            <div>
              <h2>Keep what works</h2>
              <p>Use Scout on your own approved sources only after the practice result is useful. Save a Skill or create a Routine later, once repeated manual runs work. Keep sending, publishing, account changes, and other outside actions behind your approval.</p>
              <p className="workspace-start-small">This walkthrough is prepared from Cabinet&apos;s Scout recipe and the official Grok Bot guide. Bot Cabinet has not installed or task-tested Scout in Grok Bot.</p>
            </div>
          </li>
        </ol>

        <footer className="workspace-start-footer">
          <h2>Want a different job?</h2>
          <p>Browse other Grok build briefs, or read Scout&apos;s job and setup requirements.</p>
          <div className="button-row"><Link href="/platforms/grok-bot" className="button button-primary">See Grok build briefs <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/bots/scout" className="button button-secondary">Meet Scout</Link></div>
        </footer>
      </div>
    </main>
  );
}
