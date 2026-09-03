import type { Metadata } from "next";

import { BotFitTest } from "@/components/bot-fit-test";
import { TextLink } from "@/components/ui";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Bot Fit Test · Choose the right setup",
  description:
    "Describe the work and find out whether it needs an Assignment, Skill, Routine, Bot, or Crew.",
  path: "/fit/",
  image: "/brand/social/bot-fit-test-1200x630.jpg",
  imageAlt: "Bot Cabinet Fit Test — choose the right setup for the work",
});

export default function BotFitTestPage() {
  return (
    <main id="main-content" className="fit-test-page">
      <section className="fit-test-page-hero shell">
        <div>
          <p className="fit-test-kicker">Choose before you build</p>
          <h1>Should this work be a Bot?</h1>
        </div>
        <div>
          <p>
            Some work needs one good assignment. Other work needs a reusable method,
            a scheduled routine, a continuing Bot, or several Bots working together.
            The Fit Test helps you choose before you spend time setting anything up.
          </p>
          <TextLink href="/start/">I already know I want a Bot</TextLink>
        </div>
      </section>
      <BotFitTest />
    </main>
  );
}
