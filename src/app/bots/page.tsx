import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { StarterBotCatalog } from "@/components/starter-bot-catalog";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Cabinet · Hermes Bots",
  description: "Purpose-built public Hermes Bot role templates with example tasks, intended outputs, setup guidance, and downloadable starter files.",
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
            Search by what you need done. Open a Bot to see its first task, then choose where to use it.
          </p>
        </div>
      </section>

      <section className="content-section shell registry-section">
        <StarterBotCatalog />
      </section>

      <details className="shell starter-catalog-review">
        <summary>What has been tested?</summary>
        <p>The original 16 Hermes archives passed isolated profile-import tests. Curator, Reentry, and Receipt are newer prepared profiles whose import tests remain pending. Import success does not prove work quality; human technical review and real-job testing are still in progress. Each Bot page shows its own current status.</p>
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
