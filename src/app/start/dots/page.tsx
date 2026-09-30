import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "What ChatGPT Dots can do—and a useful first job",
  description: "See early hands-on results and limits, compare Dots with other agents, then try a clear first job without granting account access.",
  path: "/start/dots/",
  image: "/brand/social/first-bot-1200x630.jpg",
  imageAlt: "A practical first job for a ChatGPT Dot",
});

const practiceTask = `Help me sort these three made-up commitments for this week:
- Send a draft agenda to my team by Tuesday afternoon.
- Review a six-page proposal by Thursday.
- Decide whether Friday's project meeting needs to happen.

Make a one-page brief. For each commitment, show the next action, owner if known, due date, and which line above supports it. Mark anything missing as a question; do not fill gaps with guesses. Then tell me what you finished and what you could not determine. Use only this message. Do not connect apps, send messages, change a calendar, set a reminder, or keep working after the brief. Stop for my review.`;

const realTask = `I am going to paste notes from one meeting. Find every promise, decision, and open question in those notes. Make a short table with: item, owner, due date, next action, and the exact line of my notes that supports it. Write "not stated" when a field is missing. Put the three most urgent follow-ups first. Do not send a message, edit a document, create a task, or schedule anything. End with two lists: "finished" and "needs my decision." Wait for my review before taking another step.

Meeting notes:
[Paste notes here. Remove private or sensitive details you do not want to share.]`;

const observations = [
  { kind: "It noticed a conflict", title: "A missed scheduling detail", detail: "Dan Shipper says his Dot connected a Slack discussion with travel plans and flagged a conflict before he booked a flight.", source: "Every · Dan Shipper", href: "https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt#what-works", result: "Worked in his account" },
  { kind: "It found money at stake", title: "A sponsorship follow-up", detail: "Peter Yang reports that his Dot found a five-figure sponsorship issue he had overlooked while reviewing his business work.", source: "Video · Peter Yang", href: "https://www.youtube.com/watch?v=z5X1eMU6isI&t=625s", result: "Reported by tester" },
  { kind: "It lost the thread", title: "A failed writing task", detail: "Yang says a transcript-to-newsletter task failed, and the failure was hard to find in a busy conversation.", source: "Video · Peter Yang", href: "https://www.youtube.com/watch?v=z5X1eMU6isI&t=809s", result: "Failed in his test" },
  { kind: "Access got in the way", title: "Disconnected computer access", detail: "Shipper reports missed replies, awkward site logins, and local-computer permission dropping during his early test.", source: "Every · Dan Shipper", href: "https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt#what-needs-work", result: "Failed or stalled in his test" },
  { kind: "A remote handoff", title: "A website task in Codex", detail: "Chase AI showed his Dot starting a Codex task and passing instructions to it while he continued using the Dot. He later opened the resulting local page.", source: "Video · Chase AI", href: "https://www.youtube.com/watch?v=D2L22EbGa7s&t=480s", result: "Shown in his early-access test" },
  { kind: "The handoff got messy", title: "Started, but hard to track", detail: "In the same test, the task first hit a startup error, appeared outside the project he named, and the Dot did not clearly report that the preview was ready.", source: "Video · Chase AI", href: "https://www.youtube.com/watch?v=D2L22EbGa7s&t=619s", result: "Friction shown by tester" },
];

export default function DotsStartPage() {
  return (
    <main id="main-content" className="page-main dots-page">
      <div className="shell dots-wrap">
        <Link href="/start" className="text-link dots-back"><ArrowLeft size={16} aria-hidden="true" /> Choose another way to start</Link>

        <header className="dots-hero">
          <div className="dots-hero-copy">
            <Eyebrow>ChatGPT Dots · September 29, 2026</Eyebrow>
            <h1>An assistant that keeps going after the chat ends</h1>
            <p>A Dot is one personal agent inside ChatGPT. It can use its own cloud computer, work with apps you choose to connect, and bring back work for review. The promise is useful. Early tests also show rough edges.</p>
            <div className="button-row"><a href="#try-a-job" className="button button-primary">Try one useful job <ArrowRight size={16} aria-hidden="true" /></a><Link href="/compare" className="button button-secondary">Compare the alternatives</Link></div>
            <p className="dots-hero-note">Bot Cabinet has not task-tested this Dot workflow. The results below belong to the people who ran them.</p>
          </div>
          <aside className="dots-at-glance" aria-label="Dots at a glance">
            <span className="dots-panel-label">What you get at launch</span>
            <dl>
              <div><dt>One</dt><dd>personal Dot to start</dd></div>
              <div><dt>Own computer</dt><dd>in the cloud; your laptop is optional</dd></div>
              <div><dt>Your choice</dt><dd>which apps it may use</dd></div>
              <div><dt>Not yet</dt><dd>a one-click import for Cabinet Bots</dd></div>
            </dl>
            <a href="https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" target="_blank" rel="noopener noreferrer" className="text-link">Check OpenAI&apos;s current setup guide <ArrowUpRight size={16} aria-hidden="true" /></a>
          </aside>
        </header>

        <section className="dots-field-section" aria-labelledby="dots-field-title">
          <div className="dots-section-heading"><div><Eyebrow>Early hands-on reports</Eyebrow><h2 id="dots-field-title">What happened when people tried it</h2></div><p>These are specific accounts, not a reliability score. They show both why Dots is interesting and what to check before trusting an ongoing job.</p></div>
          <div className="dots-field-grid">
            {observations.map((item) => <article key={item.title} className="dots-field-card"><span className="dots-card-kicker">{item.kind}</span><h3>{item.title}</h3><p>{item.detail}</p><div className="dots-field-card-footer"><span>{item.result}</span><a href={item.href} target="_blank" rel="noopener noreferrer">{item.source} <ArrowUpRight size={15} aria-hidden="true" /></a></div></article>)}
          </div>
          <div className="dots-video-row">
            <div className="dots-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/z5X1eMU6isI?start=10" title="Peter Yang tests ChatGPT Dots against real work" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
            <div><span className="dots-panel-label">Watch the test</span><h3>Ten jobs, including the ones that failed</h3><p>Peter Yang walks through research, app-launch work, sponsorships, and tasks Dots could not finish. His comparison with Grok Bot and Muse is his judgment, not a Bot Cabinet benchmark.</p><a href="https://www.youtube.com/watch?v=z5X1eMU6isI&t=10s" target="_blank" rel="noopener noreferrer" className="text-link">Open the video on YouTube <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          </div>
        </section>

        <section id="try-a-job" className="dots-task-section" aria-labelledby="dots-task-title">
          <div className="dots-section-heading"><div><Eyebrow>Your first result</Eyebrow><h2 id="dots-task-title">Find the follow-up that got lost</h2></div><p>Begin with words you paste, not access to your inbox. This tests whether your Dot can turn messy notes into work you can actually act on.</p></div>
          <div className="dots-task-path">
            <article><span>01</span><h3>Check access</h3><p>OpenAI is rolling Dots out gradually. Create your first Dot on desktop web or in the ChatGPT desktop app. If you do not see it yet, check the current help page.</p></article>
            <article><span>02</span><h3>Run one bounded task</h3><p>Copy the practice prompt below, or paste notes from one real meeting. No connected accounts are needed.</p></article>
            <article><span>03</span><h3>Inspect the answer</h3><p>Check each claim against your notes. Make sure missing owners or dates are marked unknown, and that the Dot says what failed.</p></article>
          </div>
          <div className="dots-prompt-grid">
            <article className="dots-prompt-card"><div><span className="dots-panel-label">Practice · no private data</span><h3>Try it with made-up commitments</h3><p>See the shape of the answer before sharing your own notes.</p></div><CopyTextButton text={practiceTask} label="Copy the practice task" analyticsEvent="dots_first_task_copy" analyticsSurface="dots_start" /><details><summary>Read the full practice task</summary><pre>{practiceTask}</pre></details></article>
            <article className="dots-prompt-card"><div><span className="dots-panel-label">Your work · one meeting</span><h3>Use your own notes</h3><p>Remove details you do not want to share. Keep the Dot from sending or changing anything yet.</p></div><CopyTextButton text={realTask} label="Copy the meeting-notes task" analyticsEvent="dots_meeting_task_copy" analyticsSurface="dots_start" /><details><summary>Read the full meeting-notes task</summary><pre>{realTask}</pre></details></article>
          </div>
        </section>

        <section className="dots-next-section" aria-labelledby="dots-next-title">
          <div><Eyebrow>Only after it helps</Eyebrow><h2 id="dots-next-title">Let it take on more—one permission at a time</h2></div>
          <ol><li><strong>Start with a pasted example.</strong><span>Learn how it handles a small job before you connect an account.</span></li><li><strong>Connect one relevant app.</strong><span>Review what it can read and change. Access to your own computer starts off.</span></li><li><strong>Set one ongoing check.</strong><span>Ask for a clear report: done, blocked, and decisions for you. Review Scheduled and Activity in the Dot profile.</span></li></ol>
          <p>OpenAI says a personal Dot can do ongoing work, while dedicated specialist Dots are still in focused enterprise pilots. This guide adapts a Chief of Staff job; it does not import a Cabinet Bot or create a separate specialist. Keep spending, sending, publishing, and deletion behind your approval.</p>
        </section>

        <footer className="dots-footer"><div><h2>Which kind of agent fits your job?</h2><p>Dots is one route. Grok Bot, Muse, Hermes, and other tools make different trade-offs. Our comparison starts with the job you want done.</p></div><Link href="/compare" className="button button-primary">Compare the options <ArrowRight size={16} aria-hidden="true" /></Link><p className="dots-sources">Sources: <a href="https://openai.com/index/introducing-dots/" target="_blank" rel="noopener noreferrer">OpenAI launch</a> · <a href="https://help.openai.com/en/articles/20001530-getting-started-with-your-dot" target="_blank" rel="noopener noreferrer">OpenAI help</a> · <a href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt" target="_blank" rel="noopener noreferrer">Dan Shipper&apos;s review</a> · <a href="https://www.youtube.com/watch?v=z5X1eMU6isI&t=10s" target="_blank" rel="noopener noreferrer">Peter Yang&apos;s review</a> · <a href="https://www.youtube.com/watch?v=D2L22EbGa7s" target="_blank" rel="noopener noreferrer">Chase AI&apos;s walkthrough</a>. Checked September 29, 2026.</p></footer>
      </div>
    </main>
  );
}
