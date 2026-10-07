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
import {
  GROK_OPERATOR_SECTIONS,
  GROK_OPERATOR_SHORTCUTS,
  GROK_OPERATOR_SOURCES,
  GROK_OPERATOR_UPDATED,
} from "../../../data/grok-bot-operator-guide";
import { STARTER_BOTS } from "../../../data/starter-bots";
import { buildPageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Grok Bot Templates · Bot Cabinet",
  description:
    "Choose a Bot job, follow the Grok Bot setup instructions, and try its first task.",
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
            Choose a job and follow its Grok Bot setup instructions. Each brief
            includes the role, a first task, review checks, and proposed Skills and
            Routines. Hermes profiles are available separately.
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
            <strong>Manual setup · not yet tested</strong>
          </div>
          <p>
            Create the Bot in Grok Bot and copy the instructions from its brief.
            These downloads are not native template links. Bot Cabinet has not
            tested these setups in the app.
          </p>
        </div>
      </section>

      <section className="grok-platform-map shell" aria-labelledby="grok-current-heading">
        <div className="grok-platform-map-heading">
          <div>
            <Eyebrow>Source review · September 20, 2026 · Not runtime-tested</Eyebrow>
            <h2 id="grok-current-heading">Find an existing template</h2>
          </div>
          <p>
            Grok Bot now has an official marketplace and native template links.
            Browse for the job you need before creating a Bot yourself.
            Cabinet&apos;s downloads here remain manual build briefs, not native templates.
          </p>
        </div>
        <div className="grok-platform-map-grid">
          <article>
            <h3>Browse by the job</h3>
            <p>
              Read the creator&apos;s description and check the required accounts
              and connections. Try a small task before sharing private material.
            </p>
            <a href="https://x.ai/bot/marketplace">Browse the official Grok Bot marketplace</a>
          </article>
          <article>
            <h3>Inspect the setup before adding it</h3>
            <p>
              xAI&apos;s September 8 guide describes templates as reusable recipes.
              Review included context and integrations. Plugins may need setup;
              custom scripts and non-standard integrations may need separate transfer.
              Start with sample data and check the result before connecting sensitive accounts.
            </p>
            <a href="https://x.ai/bot/guides/templates-for-grok-bot">Read what native templates include and omit</a>
          </article>
        </div>
      </section>

      <section className="grok-platform-map shell" aria-labelledby="portable-map-heading">
        <div className="grok-platform-map-heading">
          <div>
            <Eyebrow>Use a Bot in another app</Eyebrow>
            <h2 id="portable-map-heading">Choose the setup for your app</h2>
          </div>
          <p>
            Each app needs its own setup. The instructions describe the job;
            you connect the tools and check the result.
          </p>
        </div>

        <div className="grok-platform-map-grid">
          <article>
            <FileCode size={26} weight="thin" aria-hidden="true" />
            <span>Bot instructions</span>
            <h3>The job and setup checklist</h3>
            <ul>
              <li>Job, scope, and intended result</li>
              <li>Role instructions, approval rules, and limits</li>
              <li>A first task and checks for the answer</li>
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

      <section className="grok-operator-section shell" aria-labelledby="grok-operator-heading">
        <div className="grok-operator-heading">
          <div>
            <Eyebrow>Operator guide · Checked {GROK_OPERATOR_UPDATED}</Eyebrow>
            <h2 id="grok-operator-heading">Set up, test, and manage Grok Bots</h2>
          </div>
          <div>
            <p>
              A practical reference for choosing a Bot, saving a Skill, adding a
              Routine, protecting account access and handing work between Bots.
            </p>
            <a
              className="button button-secondary"
              href="/downloads/guides/grok-bot-operator-guide.pdf"
              download
            >
              Download the PDF <DownloadSimple size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grok-operator-grid">
          {GROK_OPERATOR_SECTIONS.map((section) => (
            <article key={section.number}>
              <div><span>{section.number}</span><h3>{section.title}</h3></div>
              <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className="grok-operator-reference">
          <div>
            <Eyebrow>Useful shortcuts</Eyebrow>
            <dl>
              {GROK_OPERATOR_SHORTCUTS.map(([key, meaning]) => (
                <div key={key}><dt>{key}</dt><dd>{meaning}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <Eyebrow>Five-line handoff</Eyebrow>
            <p>Outcome · Sources · Constraints · Deliverable · Review point</p>
            <small>
              Bot Cabinet is independent and is not affiliated with xAI or Cursor.
              Product behavior can change. Check the current documentation before
              connecting sensitive accounts or allowing consequential actions.
            </small>
            <div className="grok-operator-sources">
              {GROK_OPERATOR_SOURCES.map((source) => (
                <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                  {source.label} <ArrowSquareOut size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section shell" id="bot-recipes">
        <div className="grok-template-heading">
          <div>
            <Eyebrow>{STARTER_BOTS.length} practical starting points</Eyebrow>
            <h2 className="section-heading">Choose a job</h2>
          </div>
          <p>
            Use these instructions to create a Bot manually in Grok Bot.
            App testing is still pending.
          </p>
        </div>

        <div className="portable-template-grid">
          {STARTER_BOTS.map((bot) => (
            <article className="portable-template-card" key={bot.slug}>
              <div className="portable-template-card-topline">
                <span>{bot.category}</span>
                <strong>Not yet tested in Grok Bot</strong>
              </div>
              <h3>{bot.name}</h3>
              <p className="portable-template-title">{bot.title}</p>
              <p>{bot.summary}</p>
              <div className="portable-template-actions">
                <Link className="text-link" href={`/start/grok/${bot.slug}`}>
                  Set up {bot.name} in Grok Bot <ArrowRight size={15} />
                </Link>
                <a
                  className="text-link"
                  href={`/downloads/grok-bot-templates/v2/${bot.slug}.md`}
                  download
                >
                  Download Grok instructions <DownloadSimple size={15} />
                </a>
                <a
                  className="text-link"
                  href={`/downloads/portable-bot-packs/${bot.slug}.md`}
                  download
                >
                  Download instructions for other apps <DownloadSimple size={15} />
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
