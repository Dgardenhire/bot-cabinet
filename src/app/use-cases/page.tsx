import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, DownloadSimple, UsersThree } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { getStarterBot } from "@/data/starter-bots";
import { BOT_USE_CASES } from "@/data/use-cases";
import { CREW_KITS } from "@/data/crew-kits";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Bot Crews · Workflows",
  description: "Step-by-step Hermes Bot workflows for everyday research, writing, client work, planning, software, operations, and learning.",
  path: "/use-cases/",
  image: "/brand/social/bot-crews-1200x630.jpg",
  imageAlt: "Bot Crews — Bots that work together",
});

const USE_CASE_IMAGE_ALTS: Record<string, string> = {
  "morning-industry-briefing": "Three Bots compare source material around a studio worktable",
  "weekly-newsletter": "A mechanical typesetting machine organizes pages for a newsletter",
  "social-media-content-set": "A mechanical dispatcher sorts content into three output trays",
  "client-meeting-follow-up": "A small Bot organizes meeting notes at a wooden desk",
  "client-proposal": "Two Bots assemble a proposal at a drafting table",
  "grant-opportunity-review": "A mechanical instrument sorts grant files by eligibility and deadline",
  "website-content-update": "A Bot reviews page copy and a website layout at a compact workstation",
  "project-launch-plan": "Several Bots arrange milestones on a tabletop launch plan",
  "software-feature-build": "A programmable mechanical instrument processes code and test results",
  "operations-status-report": "An instrument cabinet records system checks and produces a status report",
  "study-and-certification-plan": "A tutor Bot studies a book and weekly plan at a library desk",
  "customer-request-response": "A correspondence Bot reviews a request and prepares a reply",
  "new-venture-evaluation": "Three friendly Bots evaluate a new venture around a workshop table",
  "growth-experiment": "A precision machine compares three growth signals",
  "leadership-weekly-review": "A small Bot arranges briefing cards on an executive desk",
  "product-technology-direction": "Two friendly Bots inspect a blueprint and prototype",
  "narrative-message-system": "A mechanical writing instrument organizes several message formats",
};

const JPG_USE_CASE_IMAGES = new Set([
  "new-venture-evaluation",
  "growth-experiment",
  "leadership-weekly-review",
  "product-technology-direction",
  "narrative-message-system",
]);

export default function UseCasesPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero use-cases-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Practical workflows for one Bot or a team</Eyebrow>
            <h1 className="inner-title">Bot Crews</h1>
            <p className="inner-deck">
              Choose a result and see how the Bots work together. Each workflow names the Bots, the order of work, the files or messages they
              produce, the decisions that remain with a person, and a small first test.
            </p>
          </div>
          <aside className="inner-aside use-case-guide">
            <UsersThree size={28} weight="thin" aria-hidden="true" />
            <strong>Every setup guide includes</strong>
            <ul>
              <li>The information you provide</li>
              <li>The handoff between each Bot</li>
              <li>A message you can copy</li>
              <li>A downloadable setup plan</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="content-section shell use-case-kit-intro">
        <div>
          <Eyebrow>New · Complete Crew Kits</Eyebrow>
          <h2 className="section-heading">Build a standing team for an ongoing function</h2>
          <p className="section-deck">Crew Kits combine several Bots, repeatable workflows, an operating rhythm, and shared access rules. {CREW_KITS.length} complete kits are ready to use.</p>
        </div>
        {CREW_KITS.slice(0, 3).map((kit) => (
          <article key={kit.slug}>
            <span>{kit.roles.length} Bots · {kit.workflows.length} workflows</span>
            <h3>{kit.name}</h3>
            <p>{kit.promise}</p>
            <Link href={`/crew-kits/${kit.slug}`} className="button button-primary">Open the Crew Kit <ArrowRight size={15} /></Link>
          </article>
        ))}
        <Link href="/crew-kits" className="text-link">Learn how Crew Kits differ from workflows <ArrowRight size={15} /></Link>
      </section>

      <section className="content-section shell use-case-library">
        <div className="use-case-library-heading">
          <div>
            <Eyebrow>{BOT_USE_CASES.length} practical starting points</Eyebrow>
            <h2 className="section-heading">Choose a single workflow by the job</h2>
          </div>
          <p>Start with manual handoffs. Add schedules or more access after the workflow produces consistent results.</p>
        </div>

        <div className="use-case-card-grid">
          {BOT_USE_CASES.map((useCase, index) => (
            <article className="use-case-card" key={useCase.slug}>
              <div className="use-case-card-image">
                <Image
                  src={`/use-cases/${useCase.slug}.${JPG_USE_CASE_IMAGES.has(useCase.slug) ? "jpg" : "webp"}`}
                  alt={USE_CASE_IMAGE_ALTS[useCase.slug] ?? ""}
                  width={1080}
                  height={720}
                  sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 1120px) 50vw, 33vw"
                />
              </div>
              <div className="use-case-card-body">
                <span className="use-case-number">{String(index + 1).padStart(2, "0")}</span>
                <h2>{useCase.title}</h2>
                <p className="use-case-audience">{useCase.audience}</p>
                <p>{useCase.outcome}</p>
                <div className="use-case-bot-row" aria-label="Bots in this workflow">
                  {useCase.botSlugs.map((slug, botIndex) => {
                    const bot = getStarterBot(slug);
                    if (!bot) return null;
                    return (
                      <span key={slug}>
                        {bot.name}
                        {botIndex < useCase.botSlugs.length - 1 && <ArrowRight size={13} aria-hidden="true" />}
                      </span>
                    );
                  })}
                </div>
                <div className="use-case-card-actions">
                  <Link href={`/use-cases/${useCase.slug}`} className="button button-secondary">Open workflow <ArrowRight size={15} /></Link>
                  <a href={`/downloads/use-cases/${useCase.slug}.md`} download className="use-case-download"><DownloadSimple size={15} /> Download setup plan (Markdown)</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section shell use-case-principle">
        <CheckCircle size={31} weight="thin" aria-hidden="true" />
        <div>
          <h2>Start with one Bot chat at a time</h2>
          <p>Give each Bot one clear job. Save the output from every step. Review the handoff before the next Bot begins. This makes errors easier to find and the workflow easier to improve.</p>
        </div>
        <Link href="/workshop" className="button button-primary">Plan a custom Bot in Bot Lab <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
