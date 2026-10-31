import Link from "next/link";

import { SPONSORS, openSlots, sponsorsOfTier, type Sponsor, type SponsorPage } from "@/data/sponsors";

function SponsorLink({ sponsor, surface, children }: { sponsor: Sponsor; surface: string; children: React.ReactNode }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="sponsored noopener"
      data-funnel-event="sponsor_click"
      data-funnel-surface={surface}
      data-funnel-destination={sponsor.slug}
    >
      {children}
    </a>
  );
}

/**
 * The labeled band at the foot of a sponsored page: Features (name and two lines) first, then one-line entries for
 * Founding Card sponsors and Line sponsors. Clicks are counted by FunnelAnalytics through the data-funnel attributes.
 */
export function SponsorStrip({ page, sponsors = SPONSORS }: { page: SponsorPage; sponsors?: readonly Sponsor[] }) {
  const features = sponsorsOfTier("feature", sponsors);
  const lines = [...sponsorsOfTier("card", sponsors), ...sponsorsOfTier("line", sponsors)];
  const open = openSlots("card", sponsors);
  const surface = `${page === "" ? "home" : page.replace("start/", "start-")}-foot`;
  const sold = features.length + lines.length > 0;

  return (
    <aside className="sponsor-strip" aria-label={sold ? "Advertisement" : "Sponsor Bot Cabinet"}>
      <div className="shell sponsor-strip-inner">
        {sold && <p className="sponsor-strip-label">Advertisement</p>}
        {features.length > 0 && (
          <ul className="sponsor-features">
            {features.map((sponsor) => (
              <li key={sponsor.slug} className="sponsor-line-feature">
                <SponsorLink sponsor={sponsor} surface={surface}>
                  <strong>{sponsor.name}</strong>
                  <span>{sponsor.line}</span>
                </SponsorLink>
              </li>
            ))}
          </ul>
        )}
        {lines.length > 0 && (
          <ul>
            {lines.map((sponsor) => (
              <li key={sponsor.slug} className={`sponsor-line-${sponsor.tier}`}>
                <SponsorLink sponsor={sponsor} surface={surface}>
                  <strong>{sponsor.name}</strong> {sponsor.line}
                </SponsorLink>
              </li>
            ))}
          </ul>
        )}
        <Link href="/sponsor" className="sponsor-strip-open">
          {open > 0 ? `Sponsor Bot Cabinet: ${open} founding ${open === 1 ? "slot" : "slots"} open` : "Sponsor Bot Cabinet"}
        </Link>
      </div>
    </aside>
  );
}
