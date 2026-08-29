import type { Metadata } from "next";
import Image from "next/image";

import { WorkshopBuilder } from "@/components/workshop-builder";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Bot Lab · Build a custom Bot",
  description:
    "Plan a useful Bot with optional AI suggestions, then download an importable Hermes profile, a designed Blueprint, and editable role instructions.",
  path: "/workshop/",
  image: "/brand/social/bot-lab-1200x630.jpg",
  imageAlt: "Bot Lab — turn a useful idea into a Bot plan",
});

export default function WorkshopPage() {
  return (
    <main id="main-content" className="workshop-page">
      <section className="workshop-hero" aria-labelledby="workshop-title">
        <div className="workshop-hero-copy">
          <p className="workshop-eyebrow">Build and plan a custom Bot</p>
          <h1 id="workshop-title">Bot Lab</h1>
          <p className="workshop-hero-deck">
            Name the Bot and describe the job. Bot Lab can draft the rest, and you can
            edit every line. When the plan is ready, download an importable Hermes profile,
            a designed Blueprint PDF, an editable Markdown plan, and a Bot Passport.
          </p>
          <a className="button button-primary workshop-start-button" href="#workshop-builder-heading">
            Start with the Bot&apos;s name
          </a>
          <div className="workshop-label-row" aria-label="Bot Lab status">
            <span>AI is optional</span>
            <span>Your draft saves here</span>
            <span>Four downloads when finished</span>
          </div>
          <figure className="workshop-demo-video">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/videos/bot-cabinet-bot-lab-walkthrough-poster.jpg"
              aria-label="Watch how Bot Lab turns an idea into a downloadable Bot plan"
            >
              <source src="/videos/bot-cabinet-bot-lab-walkthrough.mp4" type="video/mp4" />
            </video>
            <figcaption>
              See how to name the job, build the plan, and download the files you need for
              Hermes Desktop.
            </figcaption>
          </figure>
        </div>

        <div className="workshop-hero-side">
          <figure className="workshop-hero-art">
            <Image
              src="/atelier/bot-lab-drafting-room-v1.jpg"
              alt="A refined drafting laboratory with blueprints, brass instruments, and an unfinished machine on a rear workbench"
              width={1536}
              height={1024}
              priority
            />
            <figcaption>Plan the job, access, limits, and first test before setup.</figcaption>
          </figure>
        </div>

        <div className="workshop-hero-plate" aria-label="Bot Lab method">
          <p className="workshop-plate-label">Three steps</p>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Name the job</strong>
                <p>Enter a Bot name and describe the result you need.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Complete the plan</strong>
                <p>Use AI, a basic template, or your own answers.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Download and test</strong>
                <p>Import the profile into Hermes and run a small first test.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <WorkshopBuilder />

      <section className="workshop-explainer" aria-labelledby="workshop-explainer-title">
        <div>
          <p className="workshop-eyebrow">What you will get</p>
          <h2 id="workshop-explainer-title">A Bot Blueprint you can use, share, and revise</h2>
        </div>
        <div className="workshop-explainer-copy">
          <p>
            Bot Lab records the Bot’s job, inputs, expected outputs, tools,
            approval points, and first test. It creates a designed PDF for planning
            and review, a Markdown copy you can edit, and an importable Hermes profile
            with the Bot&apos;s role instructions.
          </p>
          <p>
            You choose the model, tools, connections, and schedule when you create the Bot in
            Hermes Desktop. The optional refinement questions help you decide what should carry
            forward in the Bot’s continuing conversation and memory.
          </p>
        </div>
      </section>
    </main>
  );
}
