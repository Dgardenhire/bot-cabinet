import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowSquareOut,
  ArrowUUpLeft,
  BookOpenText,
  ClipboardText,
  GithubLogo,
  Scales,
  UserPlus,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import { Eyebrow } from "@/components/ui";
import { getBotRuntimeEvidence, getReproducedBotEvidence } from "@/data/bot-release-evidence";
import { CREW_KITS } from "@/data/crew-kits";
import { STARTER_BOTS } from "@/data/starter-bots";
import { buildPageMetadata } from "@/lib/metadata";
import styles from "./hermes.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Bot Cabinet in Hermes · Cabinet plugin",
  description:
    "Cabinet puts Bot Cabinet inside Hermes Desktop. Find the smallest setup for a job, add Bots and Crew Kits as Hermes bots, and remove what it made.",
  path: "/hermes/",
  image: "/brand/social/cabinet-for-hermes-1200x630.jpg",
  imageAlt: "Cabinet, a plugin for Hermes Desktop that adds Bots and crews from botcabinet.com",
});

const CABINET_INSTALL_COMMAND = "hermes plugins install Dgardenhire/hermes-cabinet --enable";
const CABINET_REPO_URL = "https://github.com/Dgardenhire/hermes-cabinet";
const CABINET_MANUAL_URL = "https://github.com/Dgardenhire/hermes-cabinet/blob/main/docs/MANUAL.md";

const testedBotCount = STARTER_BOTS.filter(
  (bot) => getReproducedBotEvidence(bot.slug) || getBotRuntimeEvidence(bot.slug),
).length;

const features = [
  {
    icon: ClipboardText,
    title: "Find the right size",
    copy: "Describe a job and answer five short questions. Cabinet tells you whether one chat message will do, or whether you need a skill, a schedule, one Bot or a crew. It shows which of your answers led there.",
  },
  {
    icon: UserPlus,
    title: "Add a Bot or a crew",
    copy: `Pick one of the ${STARTER_BOTS.length} Bots or ${CREW_KITS.length} Crew Kits from botcabinet.com. Cabinet shows exactly what it will make, and you can change any of it first. The result is a normal Hermes bot that uses the model you already have.`,
  },
  {
    icon: ArrowUUpLeft,
    title: "Take it back",
    copy: "My Bots lists everything Cabinet made. You can remove any of it, as long as you haven't changed it. Once you edit a bot, it's yours, and Cabinet leaves it alone.",
  },
  {
    icon: Scales,
    title: "See what was tested",
    copy: `Test Records show what each Bot has been tested on, failures included. Today ${testedBotCount} of the ${STARTER_BOTS.length} Bots have a recorded task run. Check a Bot's work yourself before you rely on it.`,
  },
] as const;

const screens = [
  {
    src: "/hermes-cabinet/fit-answer-crew.jpg",
    width: 1168,
    height: 1001,
    alt: "A Fit Test answer in Cabinet that points to the Personal Planning Desk crew, with its four steps and the reasons on the right",
    caption: "A Fit Test answer names the setup and lists the answers that led there.",
  },
  {
    src: "/hermes-cabinet/add-review.jpg",
    width: 1168,
    height: 1014,
    alt: "Cabinet's review screen for adding Daily Newspaper, with its name, editable instructions and a list of what will be made",
    caption: "Before anything is made, you see the whole Bot and can edit it.",
  },
] as const;

export default function CabinetForHermesPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="first-run-hero">
        <div className="shell first-run-hero-grid">
          <div className="first-run-hero-copy">
            <Eyebrow>Plugin for Hermes Desktop</Eyebrow>
            <h1>Bot Cabinet in Hermes</h1>
            <p>
              Cabinet puts Bot Cabinet in the Hermes Desktop sidebar. Tell it the job you need done. It
              suggests the smallest setup that can do it, then adds the right Bots to Hermes for you.
            </p>
            <div className="button-row">
              <a href="#install" className="button button-primary" data-funnel-event="cabinet_plugin_install_jump" data-funnel-surface="hermes_page">
                Install Cabinet <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href={CABINET_MANUAL_URL} className="button button-secondary" target="_blank" rel="noreferrer" data-funnel-event="cabinet_plugin_manual" data-funnel-surface="hermes_page">
                Read the manual <ArrowSquareOut size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="first-run-facts" aria-label="At a glance">
              <span>Free and open source</span>
              <span>Needs Hermes 0.22.0 or later</span>
              <span>Windows, Mac and Linux</span>
            </div>
          </div>
          <figure className={`first-run-hero-art ${styles.heroArt}`}>
            <Image src="/hermes-cabinet/cabinet-art.jpg" alt="Two brass Bots inside an open wooden cabinet lined with blueprints" width={620} height={600} priority />
            <figcaption>Cabinet · Inside Hermes Desktop</figcaption>
          </figure>
        </div>
      </section>

      <section className={`shell ${styles.section} ${styles.lead}`} aria-labelledby="cabinet-start-title">
        <div className={styles.split}>
          <div>
            <Eyebrow>What you get</Eyebrow>
            <h2 id="cabinet-start-title" className="section-heading">The Cabinet, in your sidebar</h2>
            <p className="section-deck">
              Cabinet opens on Start Here. From there you can take the Fit Test, browse the Bots, plan a new one in
              Bot Lab, set up a crew or check the test records.
            </p>
          </div>
          <figure className={styles.screen}>
            <Image src="/hermes-cabinet/start.jpg" alt="Cabinet's Start Here page in Hermes Desktop, with the Fit Test ladder, six Bot portraits with test badges, a Crew Kit and the test totals" width={1168} height={1462} />
            <figcaption>Start Here, the first page Cabinet opens to.</figcaption>
          </figure>
        </div>
      </section>

      <section className={`shell ${styles.section}`} aria-labelledby="cabinet-does-title">
        <Eyebrow>Inside the sidebar</Eyebrow>
        <h2 id="cabinet-does-title" className="section-heading">What it does for you</h2>
        <div className={styles.features}>
          {features.map(({ icon: Icon, title, copy }) => (
            <article key={title}>
              <Icon size={28} weight="thin" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className={styles.screens}>
          {screens.map((screen) => (
            <figure className={styles.screen} key={screen.src}>
              <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} />
              <figcaption>{screen.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`shell ${styles.section}`} id="install" aria-labelledby="cabinet-install-title">
        <div className={styles.split}>
          <div>
            <Eyebrow>Install</Eyebrow>
            <h2 id="cabinet-install-title" className="section-heading">Getting it running</h2>
            <p className="section-deck">
              You install Cabinet once. After that it lives in the Hermes Desktop sidebar. Hermes uses git to
              download it, so git needs to be on your computer too.
            </p>
          </div>
          <ol className={styles.steps}>
            <li>
              <strong>Open a terminal</strong>
              <p>On Windows, open PowerShell. On a Mac or Linux, open Terminal.</p>
            </li>
            <li>
              <strong>Run this one line</strong>
              <code className={styles.command}>{CABINET_INSTALL_COMMAND}</code>
              <CopyTextButton text={CABINET_INSTALL_COMMAND} label="Copy the install line" analyticsEvent="cabinet_plugin_install_copy" analyticsSurface="hermes_page" />
              <p>Hermes may say this comes from a source it hasn&apos;t reviewed. That is expected for now.</p>
            </li>
            <li>
              <strong>Restart Hermes Desktop</strong>
              <p>Quit it fully and open it again, so it loads the new plugin.</p>
            </li>
            <li>
              <strong>Open Cabinet in the sidebar</strong>
              <p>If the page says Cabinet isn&apos;t connected, turn the plugin on under Capabilities and open the page again.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className={`shell ${styles.section}`} aria-labelledby="cabinet-beside-title">
        <div className={styles.split}>
          <div>
            <Eyebrow>Hermes Bots</Eyebrow>
            <h2 id="cabinet-beside-title" className="section-heading">One copy of every Bot</h2>
          </div>
          <div className={styles.prose}>
            <p>
              When Hermes carries a Bot in its own Bots catalog, Cabinet sends you there to add it, so you never get
              two copies. Cabinet adds every other Bot itself.
            </p>
            <p>
              Cabinet reads the list of Bots from botcabinet.com and sends nothing else. There is no tracking and
              no account. Your new bots use the model and sign-in you already have in Hermes.
            </p>
          </div>
        </div>
      </section>

      <section className={`shell ${styles.section} ${styles.closing}`} aria-labelledby="cabinet-source-title">
        <a href={CABINET_REPO_URL} className={styles.card} target="_blank" rel="noreferrer" data-funnel-event="cabinet_plugin_github" data-funnel-surface="hermes_page">
          <Image src="/hermes-cabinet/card.jpg" alt="Cabinet: find the smallest setup for a job, then add Bots and crews from botcabinet.com, with undo" width={1200} height={600} />
        </a>
        <div>
          <Eyebrow>Source and manual</Eyebrow>
          <h2 id="cabinet-source-title" className="section-heading">Read it before you run it</h2>
          <p className="section-deck">
            Cabinet&apos;s code is on GitHub under the MIT license. The manual walks through every screen with
            pictures.
          </p>
          <div className={styles.links}>
            <a href={CABINET_REPO_URL} target="_blank" rel="noreferrer" className="text-link">
              <GithubLogo size={16} aria-hidden="true" /> Cabinet on GitHub
            </a>
            <a href={CABINET_MANUAL_URL} target="_blank" rel="noreferrer" className="text-link">
              <BookOpenText size={16} aria-hidden="true" /> The Cabinet manual
            </a>
            <Link href="/bots" className="text-link">
              Browse the Bots <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className={styles.independent}>
            Cabinet is an independent plugin developed by Damon Gardenhire. It is not an official plugin for Hermes
            made by Nous Research.
          </p>
        </div>
      </section>
    </main>
  );
}
