import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";
import { AgentComparison } from "./agent-comparison";
import { agents } from "./agents";
import styles from "./compare.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare personal AI agents",
  description: "A plain-English, dated comparison of ChatGPT Dots, Grok Bot, Muse, Instinct, Gemini Tasks (formerly Spark), Poke, OpenClaw, and Hermes Agent.",
  path: "/compare/",
  image: "/brand/social/compare-personal-agents-v1-1200x630.jpg",
  imageAlt: "Compare the main ways to use a personal AI agent",
});

export default function ComparePage() {
  return (
    <main id="main-content" className={`page-main compare-page ${styles.page}`}>
      <div className="shell compare-wrap">
        <header className="compare-hero">
          <Eyebrow>A field guide · updated October 27, 2026</Eyebrow>
          <h1>Which agent fits your job?</h1>
          <p>Compare eight AI assistants. Choose based on the apps you use, the job you need done, and how much setup you want.</p>
        </header>
        <AgentComparison agents={agents} />
        <p className={styles.next}>Chosen an app? <Link href="/fit">Find a Bot for your task <ArrowRight size={16} aria-hidden="true" /></Link></p>
        <p className={styles.note}>Based on the linked provider information, checked September 29, 2026. The Grok Bot, Muse, Instinct and Gemini Tasks rows were updated October 27, 2026. Bot Cabinet has not tested all eight products. Check current prices and access before signing up.</p>
        <p className="compare-credit">This comparison builds on our AI for the Real World newsletter graphic and <a href="https://every.to/vibe-check/vibe-check-dots-always-on-agents-in-chatgpt" target="_blank" rel="noopener noreferrer">Every&apos;s September 29 Dots field report</a>.</p>
      </div>
    </main>
  );
}
