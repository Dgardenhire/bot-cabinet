import type { Metadata } from "next";
import { LegacyRoute } from "@/components/legacy-route";

export const metadata: Metadata = { title: "Field Manual", robots: { index: false } };

export default function DocsPage() {
  return <LegacyRoute eyebrow="Field Manual" title="The practical guides moved to the Field Manual." copy="The Field Manual links to official Hermes information and explains Bot Cabinet guidance separately." href="/guides" action="Open the Field Manual" />;
}
