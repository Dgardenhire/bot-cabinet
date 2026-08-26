import type { Metadata } from "next";
import { LegacyRoute } from "@/components/legacy-route";

export const metadata: Metadata = { title: "Use cases", robots: { index: false } };

export default function TeamsPage() {
  return <LegacyRoute eyebrow="Multi-Bot use cases" title="The practical use cases moved to a new page." copy="The current page includes twelve ordinary work scenarios, the Bots used at each step, messages to copy, expected results, and downloadable setup plans." href="/use-cases" action="Explore use cases" />;
}
