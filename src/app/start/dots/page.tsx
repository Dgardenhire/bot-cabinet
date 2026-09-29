import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Try a Bot Cabinet job with your ChatGPT Dot",
  description: "Use a simple Chief of Staff task with your first Dot, check the result, and add access or a schedule only if you need them.",
  path: "/start/dots/",
  image: "/brand/social/first-bot-1200x630.jpg",
  imageAlt: "Try one useful Bot Cabinet job with a ChatGPT Dot",
});

const firstTask = `Help me sort these three made-up commitments for this week:
- Send a draft agenda to my team by Tuesday afternoon.
- Review a six-page proposal by Thursday.
- Decide whether Friday's project meeting needs to happen.

Make a one-page brief with the order you would tackle them, one next step for each, and any information you would need to ask me for. Use only what I wrote here. Do not connect apps, send messages, change a calendar, set a reminder, or keep working after the brief. Stop so I can check it.`;

export default function DotsStartPage() {
  return (
    <main id="main-content" className="page-main workspace-start-page">
      <div className="shell workspace-start-wrap">
        <Link href="/start" className="text-link"><ArrowLeft size={16} aria-hidden="true" /> Choose another way to start</Link>
        <header className="workspace-start-header">
          <Eyebrow>ChatGPT Dots · first task</Eyebrow>
          <h1>Give your Dot one clear job</h1>
          <p>Dots can keep working between conversations. Start smaller: ask your first Dot for one Chief of Staff brief, check the result, then decide whether it needs more access or an ongoing job.</p>
          <div className="workspace-start-status">Launch-day guide · Bot Cabinet has not task-tested this Dot workflow</div>
        </header>

        <ol className="workspace-start-steps">
          <li>
            <span className="workspace-start-step-number">1</span>
            <div>
              <h2>Check whether you have access</h2>
              <p>OpenAI began rolling out Dots on September 29. Access depends on your plan, region, and sometimes your workspace admin. You create your first Dot on desktop web or in the ChatGPT desktop app; the rollout may take several days to reach your account.</p>
              <a href="https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" className="text-link" target="_blank" rel="noopener noreferrer">Check OpenAI&apos;s current setup guide <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">2</span>
            <div>
              <h2>Try a private practice task</h2>
              <p>Create your Dot through ChatGPT&apos;s setup, then paste this task into its conversation. It uses made-up commitments and needs no connected accounts.</p>
              <div className="workspace-start-copy"><CopyTextButton text={firstTask} label="Copy the first task" analyticsEvent="dots_first_task_copy" analyticsSurface="dots_start" /><pre>{firstTask}</pre></div>
              <p><strong>Check the brief:</strong> Did it put the deadlines in a sensible order, give you usable next steps, and ask rather than invent missing facts?</p>
            </div>
          </li>
          <li>
            <span className="workspace-start-step-number">3</span>
            <div>
              <h2>Give it real work only after that</h2>
              <p>If the practice brief helps, try one real but low-risk task. Connect an app or schedule a recurring check only when the job truly needs it. Review the permissions and keep sending, spending, publishing, and deleting behind your approval.</p>
              <p className="workspace-start-small">This uses the Chief of Staff job as a task pattern. It does not import a Cabinet Bot or turn your personal Dot into a separate specialist. OpenAI says specialist Dots are currently in focused enterprise pilots.</p>
            </div>
          </li>
        </ol>

        <footer className="workspace-start-footer">
          <h2>Want to go further?</h2>
          <p>Read the full Chief of Staff role, or compare the ways to start in other apps. We will update this guide as Dots becomes more widely available and we can test a real run.</p>
          <div className="button-row"><Link href="/bots/chief-of-staff" className="button button-primary">Meet Chief of Staff <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/start" className="button button-secondary">Other ways to start</Link></div>
          <p className="workspace-start-small"><a href="https://openai.com/index/introducing-dots/" target="_blank" rel="noopener noreferrer">OpenAI&apos;s launch announcement</a> · <a href="https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" target="_blank" rel="noopener noreferrer">Current help guide</a></p>
        </footer>
      </div>
    </main>
  );
}
