import { buildPageMetadata } from "@/lib/metadata";
import { PackAccess } from "./pack-access";
export const metadata = buildPageMetadata({ title: "10 Useful Jobs for Your AI Assistant", description: "Copy-and-paste prompts, first steps, and safety tips for ten everyday jobs. Get the free Bot Cabinet starter pack with Open Source.", path: "/starter-pack/", image: "/brand/social/bot-crews-v2-1200x630.jpg", imageAlt: "Bot Cabinet: 10 Useful Jobs for Your AI Assistant" });
export default function StarterPackPage() { return <PackAccess />; }

