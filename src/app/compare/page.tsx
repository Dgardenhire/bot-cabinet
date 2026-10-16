import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";
import styles from "./compare.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare personal AI agents",
  description: "A plain-English, dated comparison of ChatGPT Dots, Grok Bot, Muse, Instinct, Gemini Spark, Poke, OpenClaw, and Hermes Agent.",
  path: "/compare/",
  image: "/brand/social/compare-personal-agents-v1-1200x630.jpg",
  imageAlt: "Compare the main ways to use a personal AI agent",
});

const agents = [
  { name: "ChatGPT Dots", maker: "OpenAI", job: "Keep one personal work assistant close to your ChatGPT projects.", shape: "One personal Dot at launch", runs: "OpenAI cloud; your computer only if you connect it", entry: "Rolling out to Pro outside the EEA, Switzerland, and UK; Business Premium in supported regions; admin-enabled Enterprise beta", caution: "Access may take several days. General users cannot import a Cabinet Bot as a separate specialist Dot.", source: "OpenAI help", sourceUrl: "https://help.openai.com/en/articles/20001530-getting-started-with-your-dot", path: "/start/dots" },
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
    <main id="main-content" className={`page-main compare-page ${styles.page}`}>
      <div className="shell compare-wrap">
        <header className="compare-hero">
          <Eyebrow>A field guide · checked September 29, 2026</Eyebrow>
          <h1>Which agent fits your job?</h1>
          <p>Compare eight AI assistants. Choose based on the apps you use, the job you need done, and how much setup you want.</p>
        </header>

        <section className="compare-table-section" aria-labelledby="compare-title">
          <div className="compare-section-head"><div><h2 id="compare-title">Compare the options</h2></div><p>Based on the linked provider information. Bot Cabinet has not tested all eight products. Check current prices and access before signing up.</p></div>
          <div className="compare-table-scroll" role="region" aria-label="Agent comparison table" tabIndex={0}>
            <table className="compare-table">
              <caption className="sr-only">Compare each agent by useful job, number of agents, where it runs, entry requirements, and a caution.</caption>
              <thead><tr><th scope="col">Product</th><th scope="col">A good first job</th><th scope="col">Agent setup</th><th scope="col">Where it works</th><th scope="col">How to get in</th><th scope="col">Check before using</th></tr></thead>
              <tbody>{agents.map((agent) => <tr key={agent.name}>
                <th scope="row"><strong>{agent.name}</strong><small>{agent.maker}</small><a href={agent.sourceUrl} target="_blank" rel="noopener noreferrer">{agent.source} <ArrowUpRight size={13} aria-hidden="true" /></a><Link href={agent.path} className={styles.tryLink}>Try it <ArrowRight size={13} aria-hidden="true" /></Link></th>
                <td data-label="A good first job">{agent.job}</td><td data-label="Agent setup">{agent.shape}</td><td data-label="Where it works">{agent.runs}</td><td data-label="How to get in">{agent.entry}</td><td data-label="Check before using">{agent.caution}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>

        <p className={styles.next}>Chosen an app? <Link href="/fit">Find a Bot for your task <ArrowRight size={16} aria-hidden="true" /></Link></p>
        <p className="compare-credit">This comparison builds on our AI for the Real World newsletter graphic and <a href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt" target="_blank" rel="noopener noreferrer">Every&apos;s September 29 Dots field report</a>.</p>
      </div>
    </main>
  );
}
