import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, DownloadSimple, ShieldCheck, UserFocus } from "@phosphor-icons/react/dist/ssr";

import { StarterBotCatalog } from "@/components/starter-bot-catalog";
import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Cabinet · Hermes Bots",
  description: "Purpose-built public Hermes Bot role templates with example tasks, intended outputs, setup guidance, and downloadable starter files.",
  path: "/bots/",
  image: "/brand/social/the-cabinet-1200x630.jpg",
  imageAlt: "The Cabinet — find a Hermes Bot for the job",
});

export default function BotsPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero registry-hero starter-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Hermes Bots</Eyebrow>
            <h1 className="inner-title">The Cabinet</h1>
            <p className="inner-deck">
              Start with a useful job. Choose a role, see the tasks it can handle, review the information it needs,
              and download a purpose-built public starter package. Each page explains the work in
              everyday language before it shows any technical details.
            </p>
          </div>
          <aside className="inner-aside starter-explainer">
            <UserFocus size={27} weight="thin" aria-hidden="true" />
            <strong>Sixteen practical Hermes Bots</strong>
            <p>Each page includes example requests, intended outputs, setup steps, role instructions, and a downloadable source package.</p>
          </aside>
        </div>
      </section>

      <section className="starter-status-strip">
        <div className="shell">
          <DownloadSimple size={20} weight="thin" aria-hidden="true" />
          <p><strong>Free starter files are available now.</strong> They have not received a human technical review or a test in Hermes Desktop. Review the files and begin with low-risk sample material.</p>
        </div>
      </section>

      <section className="content-section shell registry-section">
        <StarterBotCatalog />
      </section>

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
