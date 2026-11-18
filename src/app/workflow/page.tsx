import type { Metadata } from "next";

import { TextLink } from "@/components/ui";
import { WorkflowFixer } from "@/components/workflow-fixer";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Workflow Fixer · Find where AI can help",
  description:
    "Map how a piece of work really runs, find the slow steps, get to the root cause, and leave with a prompt or Bot you can use today. Free, no sign-up.",
  path: "/workflow/",
  image: "/brand/social/workflow-fixer-v2-1200x630.jpg",
  imageAlt: "Bot Cabinet Workflow Fixer: the Mechanic robot beside the words Find the slow step in your work",
});

export default function WorkflowFixerPage() {
  return (
    <main id="main-content" className="fit-test-page">
      <section className="fit-test-page-hero shell">
        <div>
          <p className="fit-test-kicker">Workflow Fixer</p>
          <h1>Fix the work before you add the AI</h1>
        </div>
        <div>
          <p>
            Most AI projects stall because nobody wrote down what the problem actually was.
            Map one workflow the way it really runs, mark where it gets stuck, and ask why
            until you reach the cause. You leave with a clear problem statement, the right-sized
            fix, and a prompt you can paste into any AI assistant today.
          </p>
          <p>Free, no sign-up, about ten minutes.</p>
          <TextLink href="/fit/">Already know the job? Take the Bot Fit Test</TextLink>
        </div>
      </section>
      <WorkflowFixer />
    </main>
  );
}
