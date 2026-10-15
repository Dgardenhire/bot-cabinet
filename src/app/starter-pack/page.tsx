import { buildPageMetadata } from "@/lib/metadata";
import { PackAccess } from "./pack-access";

const image = "https://ai-seminar.linchpin.studio/images/bot-cabinet-starter-pack.jpg";
const imageAlt = "Bot Cabinet Starter Pack: 10 practical AI workflows to try, with a dark teal field guide and ivory workflow cards.";
const pageMetadata = buildPageMetadata({
  title: "10 Useful Jobs for Your AI Assistant",
  description: "Copy-and-paste prompts, first steps, and safety tips for ten everyday jobs. Get the free Bot Cabinet starter pack with Open Source.",
  path: "/starter-pack/",
  image,
  imageAlt,
});

export const metadata = {
  ...pageMetadata,
  openGraph: {
    ...pageMetadata.openGraph,
    images: [{ url: image, width: 1440, height: 810, alt: imageAlt }],
  },
};

export default function StarterPackPage() { return <PackAccess />; }
