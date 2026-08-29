import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, UsersThree } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { CREW_KITS } from "@/data/crew-kits";

export const metadata: Metadata = {
  title: "Crew Kits · Standing Bot teams",
  description: "Complete Hermes Bot teams designed to manage an ongoing function through several repeatable workflows.",
  alternates: { canonical: "/crew-kits/" },
  openGraph: {
    title: "Crew Kits — Standing Bot teams",
    description: "Assemble several AI specialists into a standing team with defined roles, workflows, approval rules, and a complete implementation plan.",
    url: "https://botcabinet.com/crew-kits/",
    siteName: "Bot Cabinet",
    type: "website",
    images: [{
      url: "/brand/crew-kits-og-v2-1200x630.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "Bot Cabinet Crew Kits — standing teams of AI specialists",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crew Kits — Standing Bot teams",
    description: "Build a standing team of AI specialists with roles, workflows, approval rules, and a complete implementation plan.",
    images: ["/brand/crew-kits-og-v2-1200x630.jpg"],
  },
};

export default function CrewKitsPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero crew-kits-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Standing teams for ongoing work</Eyebrow>
            <h1 className="inner-title">Crew Kits</h1>
            <p className="inner-deck">
              A Bot Crew completes one defined workflow. A Crew Kit gives several Bots
              a continuing function, a shared operating rhythm, approval rules, and a
              collection of workflows they can run again.
            </p>
          </div>
          <aside className="inner-aside">
            <UsersThree size={28} weight="thin" aria-hidden="true" />
            <strong>Every complete kit includes</strong>
            <ul>
              <li>Named roles and responsibilities</li>
              <li>Several repeatable workflows</li>
              <li>An operating rhythm and checkpoints</li>
              <li>A shared access and approval Passport</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="content-section shell crew-kit-library">
        {CREW_KITS.map((kit) => (
          <article className="crew-kit-card" key={kit.slug}>
            <div className="crew-kit-card-image">
              <Image src={kit.image.src} alt={kit.image.alt} width={1080} height={720} sizes="(max-width: 780px) 100vw, 45vw" />
            </div>
            <div className="crew-kit-card-copy">
              <Eyebrow>{kit.eyebrow}</Eyebrow>
              <h2>{kit.name}</h2>
              <p className="crew-kit-promise">{kit.promise}</p>
              <p>{kit.description}</p>
              <ul className="crew-kit-card-facts">
                <li><CheckCircle size={17} /> {kit.roles.length} specialist Bots</li>
                <li><CheckCircle size={17} /> {kit.workflows.length} operating workflows</li>
                <li><CheckCircle size={17} /> Shared Crew Passport</li>
              </ul>
              <Link href={`/crew-kits/${kit.slug}`} className="button button-primary">Open the complete kit <ArrowRight size={16} /></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-section shell crew-kit-explainer">
        <div><Eyebrow>How the pieces fit</Eyebrow><h2>One specialist, one workflow, or a standing team</h2></div>
        <div className="crew-level-grid">
          <article><span>01</span><h3>Bot</h3><p>One named specialist with its own role, conversation, tools, and history.</p></article>
          <article><span>02</span><h3>Bot Crew</h3><p>Several Bots complete one job through a defined sequence of handoffs.</p></article>
          <article><span>03</span><h3>Crew Kit</h3><p>A persistent mini-workforce runs several related workflows for an ongoing function.</p></article>
        </div>
      </section>
    </main>
  );
}
