import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { StarterBotCatalog } from "@/components/starter-bot-catalog";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "All Bots: AI bot templates by job",
  description: "Browse AI bot templates by job. Each has setup steps for ChatGPT, Claude, Grok Bot or Hermes Agent and shows how far it has been tested.",
  path: "/bots/",
  image: "/brand/social/bot-pack-2-0-1200x630.jpg",
  imageAlt: "Bot Pack 2.0 — one useful job in four usable formats",
});

export default function BotsPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero registry-hero starter-catalog-hero">
        <div className="shell">
          <Eyebrow>Find a useful job</Eyebrow>
          <h1 className="inner-title">The Cabinet</h1>
          <p className="inner-deck">
            Choose a useful kind of help, then find the role that fits. These are selected templates, not a directory of every Bot. Open one to see its first task and choose where to use it.
          </p>
        </div>
      </section>

      <section className="content-section shell registry-section">
        <StarterBotCatalog />
      </section>

      <details className="shell starter-catalog-review">
        <summary>What has been tested?</summary>
        <p>All 38 standalone roles have a reviewed pass on one supplied-material task through the Hermes SDK. This does not prove Desktop installation, connected-account work or reliability on other tasks. Workflow examples have their own status and do not inherit a role&apos;s test result. <Link href="/proof/#website-trials-title">Read the test records and limits.</Link></p>
      </details>

      <section className="content-section shell starter-community-cta">
        <ShieldCheck size={32} weight="thin" aria-hidden="true" />
        <div>
          <Eyebrow>Community Registry</Eyebrow>
          <h2>Browse independently published Hermes profiles</h2>
          <p>Community Registry projects have a different review and test status from these starter templates. The registry links to one exact source version, names the license information found there, and reports automated source scan, human technical review, and Hermes Desktop test status separately.</p>
        </div>
        <Link href="/community" className="button button-secondary">Open the Community Registry <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
