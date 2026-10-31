import Image from "next/image";

import { SETUP_GUIDES, SPONSORS, setupSponsorFor, sponsorsOfTier, type Sponsor, type SponsorPage } from "@/data/sponsors";

function surfaceFor(page: SponsorPage) {
  return page === "" ? "home" : page.replace("start/", "start-");
}

function SponsorCardLink({ sponsor, surface }: { sponsor: Sponsor; surface: string }) {
  return (
    <a
      className="sponsor-card"
      href={sponsor.url}
      target="_blank"
      rel="sponsored noopener"
      data-funnel-event="sponsor_click"
      data-funnel-surface={surface}
      data-funnel-destination={sponsor.slug}
    >
      {/* Logos are first-party files under /sponsors/, so no outside request is made. */}
      <Image src={sponsor.logo!} alt="" width={52} height={52} />
      <span>
        <strong>{sponsor.name}</strong>
        <span>{sponsor.line}</span>
      </span>
    </a>
  );
}

/**
 * The labeled band right under a sponsored page's opening section. Renders nothing until a card (or, on a setup
 * guide, a setup sponsor) is sold. `contained` skips the page-width wrapper on pages that already provide one.
 */
export function SponsorTop({
  page,
  sponsors = SPONSORS,
  contained = false,
}: {
  page: SponsorPage;
  sponsors?: readonly Sponsor[];
  contained?: boolean;
}) {
  const cards = sponsorsOfTier("card", sponsors);
  const setup = setupSponsorFor(page, sponsors);
  if (!cards.length && !setup) return null;
  const inner = contained ? "sponsor-top-inner" : "shell sponsor-top-inner";
  const surface = surfaceFor(page);

  return (
    <>
      {setup && (
        <aside className="sponsor-top sponsor-top-setup" aria-label="Advertisement">
          <div className={inner}>
            <p className="sponsor-top-label">Advertisement</p>
            <SponsorCardLink sponsor={setup} surface={`setup-${surface}`} />
            <p className="sponsor-top-note">{SETUP_GUIDES[setup.setupPage!].note}</p>
          </div>
        </aside>
      )}
      {cards.length > 0 && (
        <aside className="sponsor-top" aria-label="Advertisement">
          <div className={inner}>
            <p className="sponsor-top-label">Advertisement</p>
            {cards.map((sponsor) => (
              <SponsorCardLink key={sponsor.slug} sponsor={sponsor} surface={`${surface}-top`} />
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
