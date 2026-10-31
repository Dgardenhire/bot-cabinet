import Link from "next/link";

import { SPONSORS, openFoundingSlots, orderedSponsors, type Sponsor, type SponsorPage } from "@/data/sponsors";

/**
 * The labeled sponsor band at the foot of an allowed page, founding sponsors before directories. Sponsor links are first-party HTML with
 * rel="sponsored"; clicks are counted by FunnelAnalytics through the data-funnel attributes.
 */
export function SponsorStrip({ page, sponsors = SPONSORS }: { page: SponsorPage; sponsors?: readonly Sponsor[] }) {
  const open = openFoundingSlots(sponsors);
  const lines = orderedSponsors(sponsors);
  const surface = page === "" ? "home" : page;

  return (
    <aside className="sponsor-strip" aria-label={lines.length ? "Advertisement" : "Sponsor Bot Cabinet"}>
      <div className="shell sponsor-strip-inner">
        {lines.length > 0 && (
          <>
            <p className="sponsor-strip-label">Advertisement</p>
            <ul>
              {lines.map((sponsor) => (
                <li key={sponsor.slug} className={`sponsor-line-${sponsor.tier}`}>
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="sponsored noopener"
                    data-funnel-event="sponsor_click"
                    data-funnel-surface={surface}
                    data-funnel-destination={sponsor.slug}
                  >
                    <strong>{sponsor.name}</strong> {sponsor.line}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        <Link href="/sponsor" className="sponsor-strip-open">
          {open > 0
            ? `Sponsor Bot Cabinet: ${open} founding ${open === 1 ? "slot" : "slots"} open`
            : "Sponsor Bot Cabinet"}
        </Link>
      </div>
    </aside>
  );
}
