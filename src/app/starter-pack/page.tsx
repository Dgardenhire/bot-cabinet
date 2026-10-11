import { buildPageMetadata } from "@/lib/metadata";
import { PackAccess } from "./pack-access";
export const metadata = buildPageMetadata({ title: "10 Bots you can set up tonight · Starter pack", description: "Subscribe to Open Source for ten practical Bot setups, starter prompts and guardrails.", path: "/starter-pack/", image: "/brand/social/bot-crews-v2-1200x630.jpg", imageAlt: "Bot Cabinet starter pack" });
export default function StarterPackPage() { return <PackAccess />; }
