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
    title: "Build a Bot Crew",
    tag: "Crews & Kits",
    note: "Run one workflow or a standing team",
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
            <p className="hero-kicker">Bot Cabinet · starting with Hermes Agent</p>
            <h1 className="hero-title">Build and use AI specialists for real work</h1>
            <p className="hero-deck">
              Bot Cabinet helps you choose a job, create a Bot, and bring it into Hermes
              Desktop—with clear setup instructions, examples, and review information. Each
              Bot can keep its own continuing conversation, role, memory, tools, and history.
            </p>
            <div className="button-row">
              <Link href="/start" className="button button-primary" data-funnel-event="homepage_start_first_bot" data-funnel-surface="homepage">
                Start your first Bot <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="#bot-in-action" className="button button-secondary" data-funnel-event="homepage_watch_bot" data-funnel-surface="homepage">
                Watch a Bot work <BookOpenText size={16} aria-hidden="true" />
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

      <section className="home-cost-strip" aria-label="Cost information">
        <div className="shell">
          <strong>Bot Cabinet is free.</strong>
          <span>Hermes Agent is open source. You will need a supported AI provider, and provider costs vary.</span>
        </div>
      </section>

      <section className="home-section bot-proof-section shell" id="bot-in-action" aria-labelledby="bot-proof-title">
        <div className="bot-proof-heading">
          <div>
            <Eyebrow>See a Bot at work</Eyebrow>
            <h2 id="bot-proof-title" className="section-heading">Follow a Bot through a focused assignment</h2>
          </div>
          <p className="section-deck">
            This recorded Scout excerpt shows the intended path from a focused request to a concise
            research brief. The Proof Room separates the material we preserved from the checks that
            still need to be run.
          </p>
        </div>
        <div className="bot-proof-grid">
          <figure className="bot-proof-video-frame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/videos/bot-cabinet-scout-in-action-poster-v2.png"
              aria-label="Watch the recorded Scout excerpt"
            >
              <source src="/videos/bot-cabinet-scout-in-action.mp4" type="video/mp4" />
            </video>
            <figcaption>Recorded Scout excerpt. The complete raw run record was not preserved.</figcaption>
          </figure>
          <div className="bot-proof-steps">
            <article>
              <span>01</span>
              <div><h3>Give the Bot a clear job</h3><p>Prepare a concise brief explaining how Hermes profiles can be shared, imported, and updated.</p></div>
            </article>
            <article>
              <span>02</span>
              <div><h3>Watch the preserved excerpt</h3><p>The excerpt shows Scout organizing a bounded request into a short response.</p></div>
            </article>
            <article>
              <span>03</span>
              <div><h3>Inspect the evidence</h3><p>The Proof Room shows the excerpt, planned reproduction sources, and the records still required.</p></div>
            </article>
          </div>
        </div>
        <div className="bot-proof-room-link"><TextLink href="/proof">Inspect the Proof Room evidence</TextLink></div>
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
        <Link className="platform-slide" href="/platforms/grok-bot">
          <div>
            <span>New platform pathway</span>
            <h3>Grok Bot Templates</h3>
            <p>Use Bot Cabinet roles and Passports as portable recipes for Grok Bot’s new template system.</p>
          </div>
          <strong>Adapt a Bot <ArrowRight size={17} aria-hidden="true" /></strong>
        </Link>

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

      <section className="home-section ecosystem-proof-section">
        <div className="shell">
          <Eyebrow>Community Registry review</Eyebrow>
          <div className="ecosystem-proof-heading">
            <h2 className="section-heading">Check a public project before you install it</h2>
            <p className="section-deck">
              Community Registry pages explain the use, link to an exact source version, and
              report automated review, human technical review, and Hermes Desktop testing separately.
            </p>
          </div>
          <div className="ecosystem-proof-grid">
            <article><Package size={27} weight="thin" aria-hidden="true" /><h3>Setup method</h3><p>See whether the project imports as a profile, installs from Git, or uses its own setup process.</p></article>
            <article><GitBranch size={27} weight="thin" aria-hidden="true" /><h3>Included files</h3><p>See the exact source version and which files the project plans to install.</p></article>
            <article><IdentificationBadge size={27} weight="thin" aria-hidden="true" /><h3>Requested access</h3><p>Review the files, tools, connections, and accounts the project needs for its job.</p></article>
            <article><WarningDiamond size={27} weight="thin" aria-hidden="true" /><h3>Test status</h3><p>See which automated checks, human review, and Hermes Desktop tests have been completed.</p></article>
          </div>
          <div className="ecosystem-proof-foot">
            <p>Review status appears on every listed community project.</p>
            <TextLink href="/community">Browse community projects</TextLink>
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
              points, and first test. It creates an importable Hermes profile, a designed
              Blueprint PDF, an editable Markdown plan, role instructions, and a Bot Passport
              that records access and approval rules.
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
