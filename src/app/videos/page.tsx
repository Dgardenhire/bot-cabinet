import type { Metadata } from "next";
import { LegacyRoute } from "@/components/legacy-route";

export const metadata: Metadata = { title: "Field Manual", robots: { index: false } };

export default function VideosPage() {
  return <LegacyRoute eyebrow="Video page removed" title="The old video collection is no longer part of the site." copy="The Field Manual links official Hermes sources for selected guidance that depends on the Hermes version." href="/guides" action="Open the Field Manual" />;
}
