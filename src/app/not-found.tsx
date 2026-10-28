import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ENCODED_PACK_TOKEN_IN_PATH } from "@/lib/analytics-filter";

// Some email link tracking encodes the "#" in /starter-pack/#access=<token>, which lands here. Send those visitors on
// to the working link before anything else loads.
const packLinkRescue = `(function(){var m=location.pathname.match(${ENCODED_PACK_TOKEN_IN_PATH});if(m)location.replace("/starter-pack/#access="+m[1]);})();`;

export default function NotFound() {
  return (
    <main id="main-content" className="page-main">
      <script dangerouslySetInnerHTML={{ __html: packLinkRescue }} />
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
