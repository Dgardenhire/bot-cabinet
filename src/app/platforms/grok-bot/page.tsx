import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, DownloadSimple, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { STARTER_BOTS } from "@/data/starter-bots";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Grok Bot Templates · Bot Cabinet",
  description: "Adapt Bot Cabinet roles into inspectable Grok Bot template briefs.",
  path: "/platforms/grok-bot/",
  image: "/brand/social/grok-bot-templates-1200x630.jpg",
  imageAlt: "Bot Cabinet — portable Bot recipes for Grok Bot",
});

export default function GrokBotTemplatesPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="page-hero shell compact-page-hero">
        <Eyebrow>Portable Bot recipes</Eyebrow>
        <h1>Adapt Bot Cabinet roles for Grok Bot</h1>
        <p className="section-deck">
          Grok Bot templates make reusable Bot configurations easier to share. Each Bot Cabinet adaptation brief gives you the role, inputs, intended output, first test, and Bot Passport to build and review your own version.
        </p>
        <div className="notice-box">
          <ShieldCheck size={23} weight="thin" aria-hidden="true" />
          <p>These are portable build briefs, not one-click Grok imports. Review every instruction, memory, skill, plugin, routine, and connection inside Grok Bot before publishing a template.</p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-intro">
          <Eyebrow>Choose a role</Eyebrow>
          <h2 className="section-heading">Start with the job, then build the Bot on your platform</h2>
        </div>
        <div className="content-grid-3 portable-template-grid">
          {STARTER_BOTS.map((bot) => (
            <article className="content-card" key={bot.slug}>
              <h3>{bot.name}</h3>
              <p>{bot.title}</p>
              <a className="text-link" href={`/downloads/grok-bot-templates/${bot.slug}.md`} download>
                Download the Grok Bot brief <DownloadSimple size={15} />
              </a>
              <Link className="text-link" href={`/bots/${bot.slug}`}>
                Review the complete Bot <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
