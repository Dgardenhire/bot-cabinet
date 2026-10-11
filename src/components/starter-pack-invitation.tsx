import Link from "next/link";
import { Eyebrow } from "@/components/ui";
export function StarterPackInvitation() {
  return <section className="content-section shell"><Eyebrow>Free with Open Source</Eyebrow><h2 className="section-heading">Start with one useful Bot</h2><p className="section-deck">Subscribe to Damon Gardenhire&apos;s weekly Open Source newsletter and get the starter pack: ten Bot setups with copyable prompts, first tasks, and guardrails. One email on Mondays. Unsubscribe anytime.</p><Link className="button button-primary" href="/starter-pack/">Get the starter pack</Link></section>;
}
