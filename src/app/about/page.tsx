import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code, Compass, Flask, GitBranch, Newspaper, Wrench } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Bot Cabinet",
  description: "Why Damon Gardenhire, LINCHPIN, and AI for the Real World built Bot Cabinet and its Hermes Bot Registry.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero about-hero">
        <div className="shell about-hero-grid">
          <div>
            <Eyebrow>About the project</Eyebrow>
            <h1 className="inner-title">About Bot Cabinet</h1>
            <p className="inner-deck">
              A practical starting point for people who want to use Hermes Bots. Bot Cabinet is an independent community project from LINCHPIN
              and AI for the Real World. Its first collection, the Hermes Bot Registry, provides
              starter roles, step-by-step use cases, setup guidance, and clear information about
              public Community Registry projects.
            </p>
          </div>
          <div className="about-hero-image">
            <Image src="/atelier/orrery.jpg" alt="A metal robot in a mechanical workshop" width={1800} height={1800} priority />
            <span>Independent community project</span>
          </div>
        </div>
      </section>

      <section className="content-section shell about-person-grid">
        <div className="about-headshot">
          <div className="portrait-thumbnail">
            <Image
              src="/damon-gardenhire-headshot.jpg"
              alt="Damon Gardenhire"
              width={320}
              height={320}
              sizes="(max-width: 620px) 96px, 128px"
              priority
            />
          </div>
          <span>Damon Gardenhire · Founder, LINCHPIN</span>
        </div>
        <div className="prose-column">
          <Eyebrow>The person behind Bot Cabinet</Eyebrow>
          <h2 className="section-heading">Strategy, writing, and practical AI</h2>
          <p>
            He is a strategist, writer, journalist, and builder with roughly
            three decades of experience helping organizations make sense of difficult choices.
            He founded <a href="https://linchpin.studio/" target="_blank" rel="noreferrer">LINCHPIN</a>,
            where the practice advises and the studio builds.
          </p>
          <p>
            He also created <a href="https://ai-seminar.linchpin.studio/" target="_blank" rel="noreferrer">AI for the Real World</a>,
            which helps nontechnical leaders apply AI to their work through seminars, workshops,
            examples, and practical tools.
          </p>
          <p>
            He publishes <a href="https://ai-seminar.linchpin.studio/open-source" target="_blank" rel="noreferrer">Open Source</a>,
            a five-minute Monday briefing on the handful of developments in AI that are most
            likely to change a decision someone will make next.
          </p>
          <p>
            Questions about Bot Cabinet, LINCHPIN, or AI for the Real World can be sent to{" "}
            <a href="mailto:damon@linchpin.studio">damon@linchpin.studio</a>.
          </p>
          <p>
            His Hermes profiles cover distinct working roles such as research, writing, editing,
            planning, software, learning, and operations. He created the Hermes Bot Registry so other people could
            begin with understandable role templates and see the setup, limits, and review status of public profiles.
          </p>
        </div>
      </section>

      <section className="content-section shell about-origin-story">
        <div>
          <Eyebrow>Why the Hermes Bot Registry began</Eyebrow>
          <h2 className="section-heading">A Grok Bot usage cap prompted the first question</h2>
        </div>
        <blockquote>
          “I reached the usage cap on my $300-a-month SuperGrok Heavy subscription quickly. I
          could wait three days to use Grok Bot again or pay more. I already used Hermes Agent,
          so I wondered whether anyone had created a systematic way to help people understand
          and use the new Hermes Bot feature. That question became the Registry.”
        </blockquote>
      </section>

      <section className="content-section shell">
        <Eyebrow>Related work</Eyebrow>
        <div className="content-grid-3 about-pillars">
          <article className="content-card">
            <Compass size={29} weight="thin" aria-hidden="true" />
            <h2>LINCHPIN</h2>
            <p>A strategy practice and product studio for communications, funding, policy, and practical digital tools.</p>
            <a href="https://linchpin.studio/" target="_blank" rel="noreferrer" className="text-link">Visit LINCHPIN <ArrowRight size={15} /></a>
          </article>
          <article className="content-card">
            <Newspaper size={29} weight="thin" aria-hidden="true" />
            <h2>AI for the Real World</h2>
            <p>Practical AI education, workshops, examples, and tools for nontechnical leaders.</p>
            <a href="https://ai-seminar.linchpin.studio/" target="_blank" rel="noreferrer" className="text-link">Visit the seminar <ArrowRight size={15} /></a>
            <a href="https://ai-seminar.linchpin.studio/open-source" target="_blank" rel="noreferrer" className="text-link about-secondary-link">Read Open Source <ArrowRight size={15} /></a>
          </article>
          <article className="content-card">
            <Wrench size={29} weight="thin" aria-hidden="true" />
            <h2>Bot Cabinet</h2>
            <p>A free home for The Cabinet’s Hermes Bot starters, Bot Lab, Bot Crews workflows, Field Manual guides, and selected Community Registry projects.</p>
            <TextLink href="/bots">Open The Cabinet</TextLink>
          </article>
        </div>
      </section>

      <section className="content-section shell about-build-story">
        <div>
          <Eyebrow>How Bot Cabinet was built</Eyebrow>
          <h2 className="section-heading">Several AI tools helped build Bot Cabinet</h2>
          <p className="section-deck">
            He began the prototype in Hermes Agent with DeepSeek and other models. He later
            moved the project to Codex for additional research, design, engineering, and testing.
          </p>
        </div>
        <blockquote>
          <p>
            “I built the first prototype inside Hermes Agent, working across DeepSeek and
            several other models. Those models did an excellent job building robust
            scaffolding. When it was time to turn that prototype into a finished public
            product, I brought it into Codex—one of the cleanest and most elegant coding
            environments I have used.”
          </p>
          <p>
            “I use the tools that best fit the work. I lean toward open source because it gives
            people more choices and lets them understand how a system works. Hermes made the
            first prototype possible quickly. Codex helped me continue the research, design,
            engineering, and testing.”
          </p>
          <cite>— Damon Gardenhire</cite>
        </blockquote>
        <div className="about-build-ledger">
          <div><GitBranch size={23} weight="thin" /><span>Initial prototype</span><strong>Hermes Agent + DeepSeek and other models</strong></div>
          <div><Code size={23} weight="thin" /><span>Current site</span><strong>Codex research, design, engineering, and testing</strong></div>
        </div>
      </section>

      <section className="content-section shell linchpin-doorways">
        <div>
          <Eyebrow>More from LINCHPIN</Eyebrow>
          <h2 className="section-heading">Explore LINCHPIN’s strategy, AI, and product work</h2>
          <p className="section-deck">These links lead to LINCHPIN’s main site, AI work, product studio, and practical workshop for leaders.</p>
        </div>
        <div className="linchpin-link-grid">
          <a href="https://linchpin.studio/" target="_blank" rel="noreferrer"><Compass size={25} weight="thin" /><span>LINCHPIN</span><strong>Strategy practice and product studio</strong><ArrowUpRight size={15} /></a>
          <a href="https://linchpin.studio/ai-lab" target="_blank" rel="noreferrer"><Flask size={25} weight="thin" /><span>AI Innovation Lab</span><strong>Applied AI research, briefings, and advisory work</strong><ArrowUpRight size={15} /></a>
          <a href="https://linchpin.studio/studio" target="_blank" rel="noreferrer"><Wrench size={25} weight="thin" /><span>The Studio</span><strong>Products and public tools built with AI</strong><ArrowUpRight size={15} /></a>
          <a href="https://ai-seminar.linchpin.studio/" target="_blank" rel="noreferrer"><Newspaper size={25} weight="thin" /><span>AI for the Real World</span><strong>Practical AI seminars for nontechnical leaders</strong><ArrowUpRight size={15} /></a>
          <a href="https://linchpin.studio/workshop" target="_blank" rel="noreferrer"><Wrench size={25} weight="thin" /><span>LINCHPIN Workshop</span><strong>Workshops built around real organizational needs</strong><ArrowUpRight size={15} /></a>
        </div>
      </section>

      <section className="content-section shell about-manifesto">
        <div>
          <Eyebrow>Why Bot Cabinet exists</Eyebrow>
          <h2 className="section-heading">Practical help for building and using Hermes Bots</h2>
        </div>
        <div className="about-manifesto-copy">
          <p>
            Hermes makes it straightforward to create named Bots with continuing conversations,
            distinct roles, memory, tools, and histories. People still need clear examples that
            connect those capabilities to everyday work.
          </p>
          <p>
            The Hermes Bot Registry organizes starter roles, step-by-step workflows, setup guidance,
            and selected outside projects. Each listing explains the job, the required access, and
            the current review and test status.
          </p>
          <div className="button-row">
            <Link href="/bots" className="button button-primary">Open The Cabinet <ArrowRight size={16} /></Link>
            <Link href="/workshop" className="button button-secondary">Plan a custom Bot in Bot Lab</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
