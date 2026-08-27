import type { Metadata } from "next";
import { Suspense } from "react";
import { GitBranch, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

import { RegistryCatalog } from "@/components/registry-catalog";
import { Eyebrow } from "@/components/ui";
import { REGISTRY_ENTRIES } from "@/data/registry";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Community Registry · Hermes projects",
  description: "Independent public Hermes profile projects with source links and clearly stated review status.",
  path: "/community/",
  image: "/brand/social/community-registry-1200x630.jpg",
  imageAlt: "Community Registry — explore public Hermes projects",
});

export default function CommunityPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero registry-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Independent Hermes projects</Eyebrow>
            <h1 className="inner-title">Community Registry</h1>
            <p className="inner-deck">
              See what other Hermes users have published. These profiles come from independent public repositories. Each listing explains
              the job in plain language, links to one exact source version, and shows its current
              review and test status.
            </p>
          </div>
          <aside className="registry-scan-card">
            <MagnifyingGlass size={28} weight="thin" aria-hidden="true" />
            <strong>Public Hermes profiles</strong>
            <span><b>{REGISTRY_ENTRIES.length}</b> profiles with exact source versions</span>
            <p>More profiles will be added after their source and purpose can be clearly documented.</p>
          </aside>
        </div>
      </section>

      <section className="registry-disclosure">
        <div className="shell">
          <GitBranch size={20} weight="thin" aria-hidden="true" />
          <p>Every project here has a public Hermes package file and a recorded source version. Automated source scan: not run. Human technical review: unavailable. Hermes Desktop test: not run.</p>
        </div>
      </section>

      <section className="content-section shell registry-section">
        <Suspense fallback={<div className="registry-loading">Loading Community Registry profiles…</div>}>
          <RegistryCatalog />
        </Suspense>
      </section>
    </main>
  );
}
