import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, ClockCounterClockwise, Flask, WarningCircle } from "@phosphor-icons/react/dist/ssr";

import { Eyebrow } from "@/components/ui";
import { PROOF_ROOM_DEMOS, PROOF_STATE_NAMES } from "@/data/proof-room";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Proof Room · See what a Bot does",
  description: "Inspect the material, exact prompt, conversation evidence, result, human decisions, and test status behind Bot Cabinet demonstrations.",
  path: "/proof/",
  image: "/brand/social/proof-room-1200x630.jpg",
  imageAlt: "Bot Cabinet Proof Room — see the path from a request to useful work",
});

const stateIcon = {
  "test-designed": ClockCounterClockwise,
  "test-prepared": ClockCounterClockwise,
  "recorded-excerpt": WarningCircle,
  reproduced: CheckCircle,
} as const;

export default function ProofRoomPage() {
  return (
    <main id="main-content" className="page-main proof-room-page">
      <section className="inner-hero proof-room-hero">
        <div className="shell inner-hero-grid">
          <div>
            <Eyebrow>Assignments, conversations, and results</Eyebrow>
            <h1 className="inner-title">Proof Room</h1>
            <p className="inner-deck">
              See what a Bot actually does. Each demonstration shows the supplied or planned source
              material, the exact request, the available conversation evidence, the finished result
              when one has been preserved, and the decisions that stayed with a person.
            </p>
          </div>
          <aside className="inner-aside proof-room-legend">
            <Flask size={28} weight="thin" aria-hidden="true" />
            <strong>Evidence labels have specific meanings</strong>
            <dl>
              <div><dt>Test designed</dt><dd>The test is defined, but required source material is still pending.</dd></div>
              <div><dt>Test prepared</dt><dd>Input and prompt are ready; the run has not happened.</dd></div>
              <div><dt>Recorded excerpt</dt><dd>Part of a run exists, but the full record is incomplete.</dd></div>
              <div><dt>Reproduced</dt><dd>The same package, input, and prompt passed the disclosed checks again.</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="proof-room-disclosure">
        <div className="shell">
          <WarningCircle size={20} aria-hidden="true" />
          <p>
            Every demonstration carries a specific evidence label. Missing records remain visible
            until the required run and checks have been preserved.
          </p>
        </div>
      </section>

      <section className="content-section shell proof-room-library" aria-labelledby="proof-room-library-title">
        <div className="proof-room-library-heading">
          <div>
            <Eyebrow>Practical assignments</Eyebrow>
            <h2 id="proof-room-library-title" className="section-heading">Follow each test from its source material</h2>
          </div>
          <p>Scout leads the room. Writer is waiting for its approved source brief. Chief of Staff is ready to run with its fictional transcript.</p>
        </div>

        <div className="proof-room-card-grid">
          {PROOF_ROOM_DEMOS.map((demo) => {
            const StateIcon = stateIcon[demo.state];
            return (
              <article className={`proof-room-card proof-state-${demo.state}`} key={demo.slug}>
                <div className="proof-room-card-image">
                  <Image src={demo.cardImage} alt="" width={900} height={700} sizes="(max-width: 860px) 100vw, (max-width: 1120px) 48vw, 33vw" />
                </div>
                <div className="proof-room-card-copy">
                  <span className="proof-state-label"><StateIcon size={17} aria-hidden="true" />{PROOF_STATE_NAMES[demo.state]} · {demo.stateDetail}</span>
                  <h3>{demo.title}</h3>
                  <p className="proof-room-outcome">{demo.outcome}</p>
                  <p>{demo.summary}</p>
                  <dl className="proof-room-card-facts">
                    <div><dt>Platform</dt><dd>{demo.platform}</dd></div>
                    <div><dt>Profile</dt><dd>v{demo.profileVersion}</dd></div>
                    <div><dt>Passport</dt><dd>v{demo.passportVersion}</dd></div>
                  </dl>
                  <Link href={`/proof/${demo.slug}`} className="button button-secondary">
                    Inspect this demonstration <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
