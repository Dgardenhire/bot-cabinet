import type { Metadata } from "next";

import { ThreeRunTrial } from "@/components/three-run-trial";
import { WorkbenchHub } from "@/components/workbench-hub";
import { Eyebrow } from "@/components/ui";
import { STARTER_BOTS } from "@/data/starter-bots";
import { starterBotToPortablePackV2 } from "@/lib/portable-bot-pack-v2";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "My Workbench",
  description: "Resume Bots you have started and compare any recurring agent job across three real uses without creating an account.",
  path: "/workbench/",
  image: "/brand/social/the-cabinet-1200x630.jpg",
  imageAlt: "My Workbench in Bot Cabinet",
});

const bots = STARTER_BOTS.map(bot => ({
  slug: bot.slug,
  name: bot.name,
  title: bot.title,
  packVersion: starterBotToPortablePackV2(bot).packVersion,
}));

export default function WorkbenchPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell">
          <Eyebrow>Your browser-private dashboard</Eyebrow>
          <h1 className="inner-title">My Workbench</h1>
          <p className="inner-deck">Resume the Bots you have started, see what remains before the next real run, and review your first three recorded outcomes.</p>
        </div>
      </section>
      <section className="content-section shell" aria-label="Your active Bot workbenches">
        <p className="section-deck">This page reads only Bot Cabinet progress stored in this browser. It does not contain your prompts, tasks, files or Bot outputs, and it does not sync between devices.</p>
        <WorkbenchHub bots={bots} />
      </section>
      <section id="three-run-trial" className="content-section shell" aria-labelledby="three-run-trial-title">
        <div className="section-heading-row">
          <div>
            <Eyebrow>Compare outcomes—not launch claims</Eyebrow>
            <h2 id="three-run-trial-title" className="section-title">Does this job keep working?</h2>
          </div>
          <p>Use the same bounded scorecard for a Cabinet Bot, Grok Bot, Muse, Instinct or another tool. One successful demo is not a dependable routine.</p>
        </div>
        <ThreeRunTrial />
      </section>
    </main>
  );
}
