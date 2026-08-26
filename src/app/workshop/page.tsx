import type { Metadata } from "next";
import Image from "next/image";

import { WorkshopBuilder } from "@/components/workshop-builder";

export const metadata: Metadata = {
  title: "Bot Lab · Build a custom Bot",
  description:
    "Plan a useful Bot with optional AI suggestions, a downloadable Blueprint, and role instructions for Hermes Desktop.",
};

export default function WorkshopPage() {
  return (
    <main id="main-content" className="workshop-page">
      <section className="workshop-hero" aria-labelledby="workshop-title">
        <div className="workshop-hero-copy">
          <p className="workshop-eyebrow">Build and plan a custom Bot</p>
          <h1 id="workshop-title">Bot Lab</h1>
          <p className="workshop-hero-deck">
            Start with a name and a clear job. You can ask AI to draft the remaining
            planning fields, use a basic template, or write every answer yourself. Bot Lab
            creates a designed Blueprint PDF, a matching Markdown file, role instructions,
            and a setup plan for Hermes Desktop.
          </p>
          <div className="workshop-label-row" aria-label="Bot Lab status">
            <span>Planning tool</span>
            <span>Saves in this browser</span>
            <span>Optional AI suggestions</span>
            <span>Apply in Hermes Desktop</span>
          </div>
          <figure className="workshop-video-card">
            <div className="workshop-video-header">
              <div>
                <span>30-second walkthrough</span>
                <strong>See Bot Lab in action</strong>
              </div>
              <span>PDF · Markdown · Role instructions</span>
            </div>
            <video
              controls
              playsInline
              preload="metadata"
              poster="/videos/bot-lab-explainer-poster.jpg"
              aria-label="A 30-second visual walkthrough of the Bot Lab builder"
              aria-describedby="bot-lab-video-summary"
            >
              <source src="/videos/bot-lab-explainer.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
            <figcaption id="bot-lab-video-summary">
              Name the job, draft the plan, review the live Blueprint, then download a
              designed PDF, an editable Markdown file, and Hermes role instructions.
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
          <div className="workshop-hero-plate" aria-label="Bot Lab method">
            <p className="workshop-plate-label">How it works</p>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>Define the job</strong>
                  <p>Give the Bot a name and describe the result you need.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Build the plan</strong>
                  <p>Draft the empty fields with AI, a basic template, or your own answers.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Review and test</strong>
                  <p>Edit every suggestion, then run a small test with sample material.</p>
                </div>
              </li>
            </ol>
          </div>
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
            and review, a Markdown copy you can edit, and role instructions you can
            paste into the Custom SOUL.md field.
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
