import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell">
          <p className="eyebrow">Page unavailable</p>
          <h1 className="inner-title">We could not find that page</h1>
          <p className="inner-deck">The link may be outdated, or the page may have moved.</p>
          <div className="button-row">
            <Link href="/" className="button button-primary">Return to the home page <ArrowRight size={16} /></Link>
            <Link href="/bots" className="button button-secondary">Open The Cabinet</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
