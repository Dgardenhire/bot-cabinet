import Link from "next/link";
import { Eyebrow } from "@/components/ui";
export function StarterPackInvitation() {
  return <section className="content-section shell"><Eyebrow>Free with Open Source</Eyebrow><h2 className="section-heading">10 Useful Jobs for Your AI Assistant</h2><p className="section-deck">Copy-and-paste prompts, first steps, and safety tips. Get the free starter pack when you subscribe to Damon Gardenhire&apos;s weekly Open Source newsletter. One email on Mondays. Unsubscribe anytime.</p><Link className="button button-primary" href="/starter-pack/">Get the starter pack</Link></section>;
}

