import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui";
import { WorkflowCatalog } from "@/components/workflow-catalog";
import { StarterPackInvitation } from "@/components/starter-pack-invitation";
import { BOT_USE_CASES } from "@/data/use-cases";
import { CREW_KITS } from "@/data/crew-kits";
import { workflowCategory } from "@/lib/workflow-catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Find a useful job for your Bot",
  description: "Browse practical jobs for home, business, writing and learning. See an example, copy a first task and choose how to set it up.",
  path: "/use-cases/",
  image: "/brand/social/bot-crews-v2-1200x630.jpg",
  imageAlt: "Bot Cabinet practical jobs and workflows",
});

const jpgImages = new Set(["new-venture-evaluation", "growth-experiment", "leadership-weekly-review", "product-technology-direction", "narrative-message-system"]);

export default function UseCasesPage() {
  const jobs = BOT_USE_CASES.map(job => ({
    slug: job.slug, title: job.title, audience: job.audience, outcome: job.outcome,
    category: workflowCategory(job), hasSample: !!job.sample,
    image: job.image?.src ?? `/use-cases/${job.slug}.${jpgImages.has(job.slug) ? "jpg" : "webp"}`,
  }));
  return <main id="main-content" className="page-main">
    <section className="inner-hero use-cases-hero">
      <div className="shell">
        <Eyebrow>Jobs to try</Eyebrow>
        <h1 className="inner-title">What would you like help with?</h1>
        <p className="inner-deck">Sort school messages, check an invoice, practise a conversation or prepare a piece of writing. Pick a job, see what a useful result looks like and try it with sample information.</p>
      </div>
    </section>
    <section className="content-section shell" aria-label="Browse practical jobs">
      <WorkflowCatalog jobs={jobs} />
    </section>
    <section className="content-section shell use-case-kit-intro">
      <div>
        <Eyebrow>For work with separate roles</Eyebrow>
        <h2 className="section-heading">Build a standing team for an ongoing function</h2>
        <p className="section-deck">Crew Kits help when a job needs different responsibilities or an independent check. Choose from {CREW_KITS.length} kits and review each kit&apos;s test status.</p>
      </div>
      {CREW_KITS.slice(0, 3).map(kit => <article key={kit.slug}>
        <span>{kit.roles.length} Bots · {kit.workflows.length} workflows</span>
        <h3>{kit.name}</h3><p>{kit.promise}</p>
        <Link href={`/crew-kits/${kit.slug}`} className="button button-secondary">Open the Crew Kit <ArrowRight size={15} /></Link>
      </article>)}
      <Link href="/crew-kits" className="text-link">Browse all Crew Kits <ArrowRight size={15} /></Link>
    </section>
    <StarterPackInvitation />
  </main>;
}
