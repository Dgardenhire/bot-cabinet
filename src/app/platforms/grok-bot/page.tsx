import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowSquareOut,
  ArrowsLeftRight,
  Desktop,
  DownloadSimple,
  FileCode,
  Package,
  ShareNetwork,
  ShieldCheck,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "../../../components/ui";
import { STARTER_BOTS } from "../../../data/starter-bots";
import { buildPageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Grok Bot Templates · Bot Cabinet",
  description:
    "Start with a Bot Cabinet job recipe, then use the prepared build brief to create and test the role in Grok Bot.",
  path: "/platforms/grok-bot/",
  image: "/brand/social/grok-bot-templates-1200x630.jpg",
  imageAlt: "Bot Cabinet — portable Bot recipes for Grok Bot",
});

const OFFICIAL_GROK_BOT_DOCS = {
  bots: "https://docs.x.ai/grok-bot/bots",
  skills: "https://docs.x.ai/grok-bot/skills-routines-and-automations",
  safety: "https://docs.x.ai/grok-bot/approvals-security-and-privacy",
};

export default function GrokBotTemplatesPage() {
  return (
    <main id="main-content" className="page-main grok-platform-page">
      <section className="grok-platform-hero shell">
        <div className="grok-platform-hero-copy">
          <Eyebrow>Hermes profiles · Grok Bot build briefs</Eyebrow>
          <h1>One Bot job. Two ways to build it</h1>
          <p className="section-deck">
            Bot Cabinet keeps the job, boundaries, first task, checkpoint, Skill
            recipe, and Routine recipe in one portable pack. You can download a
            prepared profile for Hermes Agent or use a separate brief to build and
            test the same job in Grok Bot.
          </p>
          <div className="grok-platform-hero-actions">
            <a className="button button-primary" href="#bot-recipes">
              Choose a Bot <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a
              className="button button-secondary"
              href={OFFICIAL_GROK_BOT_DOCS.bots}
              target="_blank"
              rel="noreferrer"
            >
              Read the official Grok Bot guide
              <ArrowSquareOut size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grok-platform-status-panel" aria-label="Current platform status">
          <div>
            <Package size={25} weight="thin" aria-hidden="true" />
            <span>Hermes Agent</span>
            <strong>Downloadable profile</strong>
          </div>
          <div>
            <Wrench size={25} weight="thin" aria-hidden="true" />
            <span>Grok Bot</span>
            <strong>Prepared build brief · test pending</strong>
          </div>
          <p>
            Bot Cabinet&apos;s Grok path is a manual build brief. Current official
            documentation describes in-app creation and public share links. The
            briefs are prepared, with runtime testing still outstanding.
          </p>
        </div>
      </section>

      <section className="grok-platform-map shell" aria-labelledby="portable-map-heading">
        <div className="grok-platform-map-heading">
          <div>
            <Eyebrow>What stays portable</Eyebrow>
            <h2 id="portable-map-heading">Keep the job. Change the setup path</h2>
          </div>
          <p>
            The portable pack is the readable source for the work itself. Platform
            adapters give concrete steps for the format each product supports.
          </p>
        </div>

        <div className="grok-platform-map-grid">
          <article>
            <FileCode size={26} weight="thin" aria-hidden="true" />
            <span>Portable core</span>
            <h3>Job recipe and Bot Passport</h3>
            <ul>
              <li>Job, scope, and intended result</li>
              <li>Durable role instructions, approval gates, and operating limits</li>
              <li>First task and human review checkpoint</li>
              <li>Skill and Routine recipes</li>
            </ul>
          </article>
          <div className="grok-platform-map-connector" aria-hidden="true">
            <ArrowsLeftRight size={28} weight="thin" />
          </div>
          <article>
            <Desktop size={26} weight="thin" aria-hidden="true" />
            <span>Platform setup</span>
            <h3>Use the format the platform supports</h3>
            <ul>
              <li>Hermes: download and inspect the prepared profile</li>
              <li>Grok Bot: create the Bot from the build brief</li>
              <li>Connect only the tools the job needs</li>
              <li>Test before adding a Skill, Routine, or public link</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="content-section shell" id="bot-recipes">
        <div className="grok-template-heading">
          <div>
            <Eyebrow>16 practical starting points</Eyebrow>
            <h2 className="section-heading">Choose the job you want a Bot to own</h2>
          </div>
          <p>
            Every Grok Bot brief is prepared from the same portable recipe as its
            Hermes profile. Grok runtime testing is still pending and is shown on
            every card.
          </p>
        </div>

        <div className="portable-template-grid">
          {STARTER_BOTS.map((bot) => (
            <article className="portable-template-card" key={bot.slug}>
              <div className="portable-template-card-topline">
                <span>{bot.category}</span>
                <strong>Prepared · test pending</strong>
              </div>
              <h3>{bot.name}</h3>
              <p className="portable-template-title">{bot.title}</p>
              <p>{bot.summary}</p>
              <div className="portable-template-actions">
                <a
                  className="text-link"
                  href={`/downloads/grok-bot-templates/${bot.slug}.md`}
                  download
                >
                  Download the Grok build brief <DownloadSimple size={15} />
                </a>
                <a
                  className="text-link"
                  href={`/downloads/portable-bot-packs/${bot.slug}.md`}
                  download
                >
                  Download the portable pack <DownloadSimple size={15} />
                </a>
                <Link className="text-link" href={`/bots/${bot.slug}`}>
                  View the complete Bot <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grok-sharing-section">
        <div className="shell grok-sharing-grid">
          <div>
            <Eyebrow>Before you share</Eyebrow>
            <h2>What a Grok Bot public link includes</h2>
            <p>
              Grok Bot can publish a preview link after you build and test a Bot.
              Another person can inspect that page and add a copy to their own
              account.
            </p>
          </div>

          <div className="grok-sharing-facts">
            <article>
              <ShareNetwork size={24} weight="thin" aria-hidden="true" />
              <h3>The shared configuration</h3>
              <p>
                The public preview can include the Bot&apos;s identity, description,
                Skills, and Routines. Remove secrets, customer information, and
                internal links before sharing.
              </p>
            </article>
            <article>
              <ShieldCheck size={24} weight="thin" aria-hidden="true" />
              <h3>The recipient gets a copy</h3>
              <p>
                Your computer access, logins, and conversation history stay with
                your account.
              </p>
            </article>
            <article>
              <Desktop size={24} weight="thin" aria-hidden="true" />
              <h3>Your Bots share one computer</h3>
              <p>
                Bots on the same Grok account share its cloud computer, files,
                browser sessions, and sign-ins. Treat that access as available to
                every Bot in your roster.
              </p>
            </article>
          </div>

          <div className="grok-official-links" aria-label="Official Grok Bot documentation">
            <a href={OFFICIAL_GROK_BOT_DOCS.bots} target="_blank" rel="noreferrer">
              Create and share Bots <ArrowSquareOut size={15} />
            </a>
            <a href={OFFICIAL_GROK_BOT_DOCS.skills} target="_blank" rel="noreferrer">
              Skills and Routines <ArrowSquareOut size={15} />
            </a>
            <a href={OFFICIAL_GROK_BOT_DOCS.safety} target="_blank" rel="noreferrer">
              Approvals, security, and privacy <ArrowSquareOut size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
