import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare personal AI agents",
  description: "A plain-English, dated comparison of ChatGPT Dots, Grok Bot, Muse, Instinct, Gemini Spark, Poke, OpenClaw, and Hermes Agent.",
  path: "/compare/",
  image: "/brand/social/first-bot-1200x630.jpg",
  imageAlt: "Compare the main ways to use a personal AI agent",
});

const agents = [
  { name: "ChatGPT Dots", maker: "OpenAI", job: "Keep one personal work assistant close to your ChatGPT projects.", shape: "One personal Dot at launch", runs: "OpenAI cloud; your computer only if you connect it", entry: "Rolling out to Pro and Business Premium; Enterprise beta", caution: "General users cannot import a Cabinet Bot as a separate specialist Dot.", source: "OpenAI help", sourceUrl: "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot", path: "/start/dots" },
  { name: "Grok Bot", maker: "SpaceXAI / Cursor", job: "Give different work roles their own Bot and let them hand off tasks.", shape: "Multiple Bots and group chats", runs: "Shared cloud computer for Bots", entry: "Beta for eligible Grok and Cursor paid plans", caution: "Separate Bots are not separate security containers.", source: "Grok Bot guides", sourceUrl: "https://x.ai/bot/guides", path: "/start/grok" },
  { name: "Muse", maker: "Meta", job: "Handle everyday tasks and longer personal goals by message.", shape: "One personal agent", runs: "Dedicated cloud VM; Muse app or WhatsApp", entry: "US rollout; free use with paid options", caution: "Check which connections and actions your account actually has.", source: "Meta launch", sourceUrl: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/", path: "https://muse.ai/" },
  { name: "Instinct", maker: "Instinct", job: "Delegate personal follow-ups through text or a call.", shape: "One personal assistant", runs: "Its own phone and computer, per its site", entry: "Public text-to-start link; price not verified", caution: "Confirm access, privacy, and supported services before connecting them.", source: "Instinct site", sourceUrl: "https://instinct.com/", path: "https://instinct.com/" },
  { name: "Gemini Spark", maker: "Google", job: "Work across Google services, connected apps, and permitted Mac files.", shape: "One assistant", runs: "Gemini app; Mac access in beta", entry: "Mac beta started with US Google AI Ultra users", caution: "Desktop and connected-app features are rolling out separately.", source: "Google update", sourceUrl: "https://blog.google/innovation-and-ai/products/gemini-app/gemini-spark-updates-june-2026/", path: "https://gemini.google/overview/agent/spark/" },
  { name: "Poke", maker: "Interaction / Cognition", job: "Get lightweight help through messages, email, and connected apps.", shape: "One assistant", runs: "Managed service", entry: "Free tier; Pro listed at $19/month", caution: "Background automation and higher limits are in paid plans.", source: "Poke plans", sourceUrl: "https://poke.com/", path: "https://poke.com/" },
  { name: "OpenClaw", maker: "OpenClaw Foundation", job: "Build a persistent assistant with control over models, channels, and hosting.", shape: "One or more agents you configure", runs: "Your machine or a host you manage", entry: "Free open-source software; model and hosting costs vary", caution: "More control means more setup and security responsibility.", source: "OpenClaw site", sourceUrl: "https://openclaw.ai/", path: "https://openclaw.ai/" },
  { name: "Hermes Agent", maker: "Nous Research", job: "Run customizable Bots and skills with a setup you control.", shape: "Bots and profiles you create", runs: "Local computer or a cloud instance you arrange", entry: "Open-source software; model and hosting costs vary", caution: "Importing a Bot is not the same as testing its real work.", source: "Hermes Bot Mode", sourceUrl: "https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode", path: "/start/hermes" },
] as const;

export default function ComparePage() {
  return (
    <main id="main-content" className="page-main compare-page">
      <div className="shell compare-wrap">
        <header className="compare-hero">
          <Eyebrow>A field guide · checked September 29, 2026</Eyebrow>
          <h1>Which agent fits the job you actually have?</h1>
          <p>The names are multiplying. Here are eight different ways to hand work to an AI assistant, from a personal Dot to a self-run Hermes or OpenClaw setup. Start with where the work lives and how much setup you want.</p>
          <div className="compare-flow" aria-label="A simple way to start"><span>Give it a job</span><span>Set its limits</span><span>Check the result</span></div>
        </header>

        <section className="compare-picks" aria-labelledby="compare-picks-title">
          <div className="compare-section-head"><div><Eyebrow>At a glance</Eyebrow><h2 id="compare-picks-title">Four ways in</h2></div><p>Begin with the kind of help you want. You can inspect all eight products in the chart below.</p></div>
          <div className="compare-pick-grid">
            <article><span>Personal work</span><h3>ChatGPT Dots</h3><p>Keep one assistant near your projects and ask it to follow through on a clear job.</p><Link href="/start/dots" className="text-link">Try a first job <ArrowRight size={16} aria-hidden="true" /></Link></article>
            <article><span>Everyday life</span><h3>Muse or Instinct</h3><p>Ask for help with plans, errands, and follow-ups through an app, message, or call.</p><a href="https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/" className="text-link" target="_blank" rel="noopener noreferrer">See how Muse works <ArrowUpRight size={16} aria-hidden="true" /></a></article>
            <article><span>Several work roles</span><h3>Grok Bot</h3><p>Give different Bots different jobs, and bring them together when a handoff helps.</p><Link href="/start/grok" className="text-link">Try a Grok Bot <ArrowRight size={16} aria-hidden="true" /></Link></article>
            <article><span>Your own setup</span><h3>Hermes or OpenClaw</h3><p>Choose your tools and hosting. Expect more setup—and more control.</p><Link href="/start/hermes" className="text-link">Try Hermes <ArrowRight size={16} aria-hidden="true" /></Link></article>
          </div>
        </section>

        <section className="compare-table-section" aria-labelledby="compare-title">
          <div className="compare-section-head"><div><Eyebrow>Look closer</Eyebrow><h2 id="compare-title">Eight agents, different starting points</h2></div><p>These are provider descriptions and Bot Cabinet&apos;s reading of them—not eight products we personally tested. Prices and access can change. Open the source before you sign up.</p></div>
          <div className="compare-table-scroll" role="region" aria-label="Agent comparison table" tabIndex={0}>
            <table className="compare-table">
              <caption className="sr-only">Compare each agent by useful job, number of agents, where it runs, entry requirements, and a caution.</caption>
              <thead><tr><th scope="col">Product</th><th scope="col">A good first job</th><th scope="col">Agent setup</th><th scope="col">Where it works</th><th scope="col">How to get in</th><th scope="col">Check before using</th></tr></thead>
              <tbody>{agents.map((agent) => <tr key={agent.name}>
                <th scope="row"><strong>{agent.name}</strong><small>{agent.maker}</small><a href={agent.sourceUrl} target="_blank" rel="noopener noreferrer">{agent.source} <ArrowUpRight size={13} aria-hidden="true" /></a></th>
                <td>{agent.job}</td><td>{agent.shape}</td><td>{agent.runs}</td><td>{agent.entry}</td><td>{agent.caution}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <p className="compare-scroll-hint">On a narrow screen, swipe the table sideways. Every row links to its source.</p>
        </section>

        <section className="compare-choice" aria-labelledby="compare-choice-title">
          <div><Eyebrow>Pick a first step</Eyebrow><h2 id="compare-choice-title">Don&apos;t start with a fleet of agents</h2><p>Choose one useful outcome and the tool you already have. Add more Bots, app access, or a schedule only when the first result gives you a reason.</p></div>
          <div className="compare-choice-links"><Link href="/start/dots" className="text-link">Try a Chief of Staff job with Dots <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/start/grok" className="text-link">Try a Bot in Grok Bot <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/start/hermes" className="text-link">Try a Bot in Hermes <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </section>
        <p className="compare-credit">The four-way overview grows out of our earlier AI for the Real World newsletter graphic. <a href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt" target="_blank" rel="noopener noreferrer">Every&apos;s September 29 Dots field report</a> helped prompt this wider update. This is Bot Cabinet&apos;s own job-first comparison, not a copy of Every&apos;s chart or a claim that we tested all eight products.</p>
      </div>
    </main>
  );
}
