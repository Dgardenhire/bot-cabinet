import { StarterPackInvitation } from "@/components/starter-pack-invitation";
import { HomeFeatureCarousel } from "@/components/home-feature-carousel";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow, SectionRule, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  description: "Discover useful AI Bots, see what people are building, and find a practical way to try the ideas yourself. Browse guides, downloads, and honest test results.",
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
    title: "Find a job to try",
    tag: "Practical jobs",
    note: "See an example and copy a first task",
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
        <HomeFeatureCarousel />
      </section>

      <section className="home-cost-strip" aria-label="Cost information">
        <div className="shell">
          <strong>Bot Cabinet is free.</strong>
          <span>Hermes Agent is open source. You will need a supported AI provider, and provider costs vary.</span>
        </div>
      </section>

      <section className="home-fit-section shell" aria-labelledby="home-fit-title">
        <div className="home-fit-copy">
          <Eyebrow>Bot Fit Test</Eyebrow>
          <h2 id="home-fit-title" className="section-heading">
            Find the simplest setup that can do the job
          </h2>
          <p className="section-deck">
            Describe the work and answer a few short questions. Bot Cabinet will tell
            you whether to use a one-time Assignment, reusable Skill, scheduled Routine,
            continuing Bot, or coordinated Crew.
          </p>
          <Link
            href="/fit/"
            className="button button-primary"
            data-funnel-event="homepage_bot_fit_test"
            data-funnel-surface="homepage"
          >
            Take the Bot Fit Test <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/workbench/#three-run-trial"
            className="home-repeat-use-link"
            data-funnel-event="homepage_three_run_trial"
            data-funnel-surface="homepage"
          >
            Already using an agent? Compare three real runs <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-fit-scale" aria-label="Five possible work formats">
          {[
            ["01", "Assignment", "One result", "Ask for one piece of work without setting up a continuing specialist. Example: summarize one meeting or compare two documents.", "/use-cases", "Find a task to try"],
            ["02", "Skill", "Reusable method", "Save the steps for a job you do often, then ask your agent to use them again. Example: turn meeting notes into the same kind of recap each time.", "/guides/run-bots-reliably", "Learn about reusable instructions"],
            ["03", "Routine", "Runs on a schedule or event", "Arrange for an approved task to start at a set time or after an event. Example: prepare a daily brief. Test it manually before switching on a schedule.", "/guides/routines-with-control", "Learn about routines"],
            ["04", "Bot", "Keeps its role and history", "Give a continuing assistant a defined job and clear limits. Example: keep a return-and-refund case organized as new messages arrive.", "/bots", "Browse the Bots"],
            ["05", "Crew", "Shares a job across Bots", "Use several specialists when the job benefits from separate responsibilities or checks. Example: have one Bot draft an article and another check its sources.", "/crew-kits", "Explore Crew Kits"],
          ].map(([number, label, note, explanation, href, action]) => (
            <details key={label}>
              <summary>
              <span>{number}</span>
              <strong>{label}</strong>
              <small>{note}</small>
              </summary>
              <div><p>{explanation}</p><Link href={href} className="text-link">{action} <ArrowRight size={14} aria-hidden="true" /></Link></div>
            </details>
          ))}
        </div>
      </section>

      <section className="home-section bot-proof-section shell" id="bot-in-action" aria-labelledby="bot-proof-title">
        <div className="bot-proof-heading">
          <div>
            <Eyebrow>See a Bot at work</Eyebrow>
            <h2 id="bot-proof-title" className="section-heading">See Scout’s research brief</h2>
          </div>
          <p className="section-deck">
            Watch a recorded excerpt of Scout’s answer. The test record
            explains what this excerpt shows and what it does not.
          </p>
        </div>
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
          <figcaption>Recorded Scout excerpt.</figcaption>
        </figure>
        <div className="bot-proof-room-link"><TextLink href="/proof">Inspect the test record</TextLink></div>
      </section>

      <section className="pathway-section shell" aria-labelledby="starting-points">
        <SectionRule>Choose what you need</SectionRule>
        <h2 id="starting-points" className="sr-only">Choose what you need</h2>
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
        <Link
          className="platform-slide cabinet-home-slide"
          href="/hermes"
          data-funnel-event="homepage_cabinet_plugin"
          data-funnel-surface="homepage"
        >
          <div className="cabinet-home-slide-copy">
            <Image
              src="/hermes-cabinet/cabinet-art.jpg"
              alt=""
              width={620}
              height={600}
              sizes="(max-width: 720px) 90vw, 168px"
            />
            <div>
              <span>Use Bot Cabinet inside Hermes</span>
              <h3>Bot Cabinet in Hermes</h3>
              <p>Add the Cabinet plugin to Hermes Desktop. Take the Fit Test, add Bots and Crew Kits as Hermes bots, and take back anything you haven&apos;t changed.</p>
            </div>
          </div>
          <strong>Get the plugin <ArrowRight size={17} aria-hidden="true" /></strong>
        </Link>
        <Link className="platform-slide" href="/watch">
          <div>
            <span>New Bots and agent updates</span>
            <h3>Agent Watch</h3>
            <p>Find new Bots, useful examples, and updates to the apps you use.</p>
          </div>
          <strong>See the latest updates <ArrowRight size={17} aria-hidden="true" /></strong>
        </Link>
        <Link className="platform-slide" href="/platforms/grok-bot">
          <div>
            <span>Use a Bot in Grok</span>
            <h3>Build briefs for Grok Bot</h3>
            <p>Choose a job, copy the instructions, and follow the Grok Bot setup guide.</p>
          </div>
          <strong>Set up a Grok Bot <ArrowRight size={17} aria-hidden="true" /></strong>
        </Link>
        <Link
          className="platform-slide portrait-home-slide"
          href="/portraits"
          data-funnel-event="homepage_portrait_studio"
          data-funnel-surface="homepage"
        >
          <div className="portrait-home-slide-copy">
            <Image
              src="/bot-portraits/previews/navigator.webp"
              alt=""
              width={560}
              height={560}
              sizes="(max-width: 720px) 72px, 88px"
            />
            <div>
              <span>Bot Portrait Studio</span>
              <h3>Give your Bot a face</h3>
              <p>Choose a friendly portrait, download it for Hermes Desktop, or write a prompt for your own portrait.</p>
            </div>
          </div>
          <strong>Choose a portrait <ArrowRight size={17} aria-hidden="true" /></strong>
        </Link>

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

    <StarterPackInvitation />
      </main>
  );
}
