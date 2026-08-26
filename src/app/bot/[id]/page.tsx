import type { Metadata } from "next";
import { REGISTRY_ENTRIES, getRegistryEntry } from "@/data/registry";
import { LegacyRoute } from "@/components/legacy-route";

export const metadata: Metadata = { title: "Registry record moved", robots: { index: false } };

export function generateStaticParams() {
  return REGISTRY_ENTRIES.map((entry) => ({ id: entry.slug }));
}

export default async function LegacyBotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getRegistryEntry(id);
  return <LegacyRoute eyebrow="Community Registry project" title={entry ? `${entry.name} moved to the Community Registry.` : "This old listing is unavailable."} copy="The Community Registry page explains what the project does, links to its recorded source version, and reports automated source scan, human technical review, and Hermes Desktop test status." href={entry ? `/community/${entry.slug}` : "/community"} action={entry ? "Open the project page" : "Browse Community Registry projects"} />;
}
