import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CheckCircle,
  FileMagnifyingGlass,
  Flask,
  GitBranch,
  HardDrives,
  IdentificationBadge,
  MagnifyingGlass,
  Notebook,
  Package,
  ShieldCheck,
  WarningDiamond,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow, FeatureLine, SectionRule, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  description: "Find useful Hermes Bots in The Cabinet, plan a custom Bot in Bot Lab, follow Bot Crews workflows, and learn from the Field Manual.",
};

const pathways = [
  {
    title: "Choose a Hermes Bot",
    tag: "The Cabinet",
    note: "See jobs, examples, and setup",
    href: "/bots",
    image: "/atelier/scout.jpg",
    green: true,
  },
  {
    title: "Bots that work together",
    tag: "Bot Crews",
    note: "Follow a step-by-step workflow",
    href: "/use-cases",
    image: "/atelier/mechanic.jpg",
    green: false,
  },
  {
    title: "Plan your own Bot",
    tag: "Bot Lab",
    note: "Create a setup plan",
    href: "/workshop",
    image: "/atelier/navigator.jpg",
    green: true,
  },
  {
    title: "Browse community projects",
    tag: "Community Registry",
    note: "Check source and review status",
    href: "/community",
    image: "/atelier/nautilus.jpg",
    green: false,
  },
] as const;

export default function Home() {
  return (
    <main id="main-content" className="page-main">
      <section className="home-hero">
        <div className="cabinet-reveal" aria-hidden="true">
          <div className="cabinet-reveal-panel cabinet-reveal-left">
            <Image
              src="/atelier/cabinet-doors-v1.png"
              alt=""
              width={1672}
              height={941}
              priority
            />
          </div>
          <div className="cabinet-reveal-panel cabinet-reveal-right">
            <Image
              src="/atelier/cabinet-doors-v1.png"
              alt=""
              width={1672}
              height={941}
              priority
            />
          </div>
        </div>
        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="hero-kicker">Learn · use · build · deploy Hermes Bots</p>
            <h1 className="hero-title">A working cabinet of Hermes Bots</h1>
            <p className="hero-deck">
              Browse practical Hermes Bots by the job you need done. Each listing explains what
              the Bot does, what it needs, how to set it up in Hermes Desktop, and its current
              review and test status. Each Bot keeps its own continuing conversation, role,
              memory, tools, and history. You can also plan your own Bot and follow step-by-step
              workflows that use several Bots together.
            </p>
            <div className="button-row">
              <Link href="/bots" className="button button-primary">
                Find a Bot by job <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/guides/what-is-a-hermes-bot" className="button button-secondary">
                Learn how Bots work <BookOpenText size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-evidence" aria-label="What the site provides">
              <span>
                <GitBranch size={17} weight="thin" aria-hidden="true" /> Practical starter roles
              </span>
              <span>
                <FileMagnifyingGlass size={17} weight="thin" aria-hidden="true" /> Step-by-step setup guides
              </span>
              <span>
                <ShieldCheck size={17} weight="thin" aria-hidden="true" /> Source and test status shown
              </span>
            </div>
            <TextLink href="/use-cases">See Bot Crews workflows</TextLink>
          </div>
          <div className="hero-visual" aria-label="A cream and burgundy workshop robot">
            <Image
              src="/atelier/archivist.jpg"
              alt="A photorealistic cream and burgundy robot in a mechanical workshop"
              width={1200}
              height={1800}
              priority
            />
            <span className="hero-image-note">Illustration</span>
          </div>
        </div>
      </section>

      <section className="pathway-section shell" aria-labelledby="starting-points">
        <SectionRule>Choose your Bot Cabinet starting point</SectionRule>
        <h2 id="starting-points" className="sr-only">Choose your Bot Cabinet starting point</h2>
        <div className="pathway-grid">
          {pathways.map((pathway) => (
            <Link className="pathway-card" href={pathway.href} key={pathway.title}>
              <Image src={pathway.image} alt="" width={1200} height={1800} />
              <h3 className="pathway-title">{pathway.title}</h3>
              <span className="pathway-tag">{pathway.tag}</span>
              <span className="pathway-footer">
                <span className={`pathway-dot ${pathway.green ? "green" : ""}`} aria-hidden="true" />
                {pathway.note}
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <div className="learning-strip">
          <div className="learning-intro">
            <h2>New to Hermes Bots? Start with the Field Manual</h2>
            <p>Learn the basics, choose a role, and test it with sample material.</p>
          </div>
          <Link href="/guides/what-is-a-hermes-bot" className="learning-step">
            <span className="learning-number">1</span>
            <BookOpenText size={39} weight="thin" aria-hidden="true" />
            <span>
              <h3>Understand what a Bot is</h3>
              <p>Learn how a Hermes profile gives a Bot its own continuing conversation, role, settings, memory, and history.</p>
            </span>
          </Link>
          <Link href="/guides/inspect-before-you-install" className="learning-step">
            <span className="learning-number">2</span>
            <MagnifyingGlass size={39} weight="thin" aria-hidden="true" />
            <span>
              <h3>Learn how to inspect a public Bot package</h3>
              <p>Review its source, requested access, setup, and test status.</p>
            </span>
          </Link>
          <Link href="/guides/first-run-checklist" className="learning-step">
            <span className="learning-number">3</span>
            <ShieldCheck size={39} weight="thin" aria-hidden="true" />
            <span>
              <h3>Read the first-test checklist</h3>
              <p>Learn how to test with low-risk sample material before adding access.</p>
            </span>
          </Link>
        </div>
      </section>

      <section className="home-section ecosystem-proof-section">
        <div className="shell">
          <Eyebrow>Why the Community Registry exists</Eyebrow>
          <div className="ecosystem-proof-heading">
            <h2 className="section-heading">Public Hermes profiles are difficult to compare</h2>
            <p className="section-deck">
              The Community Registry lists selected public projects with exact source versions,
              plain-English uses, and separate review and test status. Their setup methods,
              documentation, and requested access vary.
            </p>
          </div>
          <div className="ecosystem-proof-grid">
            <article>
              <Package size={27} weight="thin" aria-hidden="true" />
              <h3>Different setup methods</h3>
              <p>Some projects install as Hermes profiles. Others are collections, examples, or tools with their own setup process.</p>
            </article>
            <article>
              <GitBranch size={27} weight="thin" aria-hidden="true" />
              <h3>Unexpected files</h3>
              <p>A profile package can copy more files than a user expects when its file list is missing or too broad.</p>
            </article>
            <article>
              <IdentificationBadge size={27} weight="thin" aria-hidden="true" />
              <h3>Private material</h3>
              <p>Before using a public package, check its current files and Git history for memories, sessions, local files, credentials, and client material.</p>
            </article>
            <article>
              <WarningDiamond size={27} weight="thin" aria-hidden="true" />
              <h3>Incomplete testing</h3>
              <p>A public repository shows what the publisher shared. Installation and Desktop testing require separate checks.</p>
            </article>
          </div>
          <div className="ecosystem-proof-foot">
            <p>The Community Registry lists only a small set of projects with a clear purpose and current source information.</p>
            <TextLink href="/community">Browse community projects</TextLink>
          </div>
        </div>
      </section>

      <section className="home-section shell">
        <div className="promise-grid">
          <div className="promise-copy">
            <Eyebrow>Inside every Bot Cabinet listing</Eyebrow>
            <h2 className="section-heading">Know what a Bot does before you set it up</h2>
            <p className="section-deck">
              Each listing explains the job, gives example requests, describes the expected
              result, lists setup requirements, and states the current review status.
            </p>
            <TextLink href="/trust">Understand the review and test labels</TextLink>
          </div>
          <div className="feature-stack">
            <FeatureLine icon={GitBranch} title="Original files">
              Hermes Bots include downloadable public files. Community Registry listings link to the publisher’s repository and a recorded version.
            </FeatureLine>
            <FeatureLine icon={CheckCircle} title="Specific review status">
              Community Registry pages identify one exact source version and report automated source scan, human technical review, and Hermes Desktop test status separately. Starter pages state their own review and test status.
            </FeatureLine>
            <FeatureLine icon={HardDrives} title="Clear access decisions">
              Bot pages list the information you provide, the tools or outside services involved, and the decisions that stay with a person.
            </FeatureLine>
          </div>
        </div>
      </section>

      <section className="home-section shell">
        <div className="founder-panel">
          <div className="founder-thumbnail-wrap">
            <div className="portrait-thumbnail">
              <Image
                src="/damon-gardenhire-headshot.jpg"
                alt="Damon Gardenhire"
                width={320}
                height={320}
                sizes="(max-width: 620px) 96px, 124px"
              />
            </div>
          </div>
          <div className="founder-copy">
            <Eyebrow>Why Bot Cabinet exists</Eyebrow>
            <blockquote>
              “I wanted to help people understand what a Bot can do and give them a practical place to begin.”
            </blockquote>
            <p>
              Damon Gardenhire built Bot Cabinet through LINCHPIN and AI for the Real World:
              a practical project for nontechnical people who want useful examples, clear setup
              guidance, and a better understanding of what Hermes Bots can do.
            </p>
            <TextLink href="/about">Meet the founder and learn why Bot Cabinet exists</TextLink>
            <div className="founder-external-links">
              <a href="https://linchpin.studio/" target="_blank" rel="noreferrer">LINCHPIN <ArrowUpRight size={13} /></a>
              <a href="https://linchpin.studio/ai-lab" target="_blank" rel="noreferrer">AI Innovation Lab <ArrowUpRight size={13} /></a>
              <a href="https://ai-seminar.linchpin.studio/" target="_blank" rel="noreferrer">AI for the Real World <ArrowUpRight size={13} /></a>
              <a href="https://ai-seminar.linchpin.studio/open-source" target="_blank" rel="noreferrer">Open Source newsletter <ArrowUpRight size={13} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section shell">
        <div className="promise-grid">
          <div>
            <Eyebrow>Inside Bot Lab</Eyebrow>
            <h2 className="section-heading">Describe the job in eight practical fields</h2>
          </div>
          <div>
            <p className="section-deck">
              Bot Lab records the job, inputs, deliverables, tools, schedule, approval
              points, and first test. It gives you role instructions and a downloadable plan for Hermes Desktop.
            </p>
            <div className="button-row home-workshop-actions">
              <Link href="/workshop" className="button button-primary">
                Open Bot Lab <Flask size={17} aria-hidden="true" />
              </Link>
              <Link href="/guides" className="button button-secondary">
                Browse the Field Manual <Notebook size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
