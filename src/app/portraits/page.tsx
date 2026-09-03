import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Certificate, DownloadSimple, UploadSimple } from "@phosphor-icons/react/dist/ssr";

import { BotPortraitStudio } from "@/components/bot-portrait-studio";
import portraits from "@/data/bot-portraits.json";
import classicPortraits from "@/data/classic-bot-portraits.json";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Bot Portrait Studio · Avatars for Hermes Desktop",
  description:
    "Download 18 friendly Bot Cabinet portraits or build a personalized portrait recipe for Hermes Desktop.",
  path: "/portraits/",
  image: "/brand/social/bot-portrait-studio-1200x630.jpg",
  imageAlt: "Bot Portrait Studio — give your Bot a face",
});

export default function PortraitsPage() {
  return (
    <main id="main-content" className="page-main portrait-page">
      <section className="shell portrait-hero">
        <div className="portrait-hero-copy">
          <p className="portrait-kicker">Bot Portrait Studio</p>
          <h1>Give your Bot a face</h1>
          <p>
            Choose from 18 friendly Bot Cabinet portraits or build a personalized image
            recipe. Every download is prepared for Hermes Desktop. The recipe builder
            gives you a prompt to use with your preferred image tool.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="#portrait-gallery">
              Choose a portrait <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#design-your-own">
              Build a portrait recipe <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="portrait-hero-facts">
            <span>18 free portraits</span>
            <span>No account required</span>
            <span>Recipe stays in your browser</span>
          </div>
        </div>
        <figure className="portrait-hero-art">
          <picture>
            <source
              srcSet="/bot-portraits/previews/fleet-720.webp 720w, /bot-portraits/previews/fleet-1200.webp 1200w, /bot-portraits/previews/fleet-1800.webp 1800w"
              sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 800px"
              type="image/webp"
            />
            <Image
              src="/atelier/fleet.jpg"
              alt="Five friendly mechanical Bots from the premium collection gathered in a refined workshop"
              width={1800}
              height={1200}
              fetchPriority="high"
            />
          </picture>
          <figcaption>Five portraits from the premium Bot Cabinet collection.</figcaption>
        </figure>
      </section>

      <section className="shell portrait-gallery-section" id="portrait-gallery" aria-labelledby="portrait-gallery-title">
        <div className="portrait-section-heading">
          <div>
            <p className="portrait-kicker">Choose from the Cabinet</p>
            <h2 id="portrait-gallery-title">Ten premium portraits</h2>
          </div>
          <p>
            These polished studio portraits use the warm, cheerful Bot Cabinet style.
            Each 1024px PNG is under 500 KB and stays clear in the Bot list and chat.
          </p>
        </div>

        <div className="portrait-gallery-grid portrait-gallery-grid-premium">
          {portraits.map((portrait) => (
            <article className="portrait-card" key={portrait.slug}>
              <Image
                src={`/bot-portraits/previews/${portrait.slug}.webp`}
                alt={portrait.alt}
                width={560}
                height={560}
                sizes="(max-width: 500px) 92vw, (max-width: 700px) 45vw, (max-width: 1180px) 30vw, 300px"
              />
              <div className="portrait-card-copy">
                <span>Premium collection</span>
                <h3>{portrait.name}</h3>
                <p>{portrait.description}</p>
                <a
                  className="button button-primary"
                  href={`/downloads/bot-portraits/hermes/${portrait.slug}-1024.png`}
                  download
                  data-funnel-event="portrait_downloaded"
                  data-funnel-surface="portrait_studio"
                  data-funnel-destination={portrait.slug}
                >
                  <DownloadSimple size={16} aria-hidden="true" /> Download for Hermes
                </a>
                <div className="portrait-card-links">
                  <a
                    href={`/downloads/bot-portraits/hermes/${portrait.slug}-256.png`}
                    download
                    data-funnel-event="portrait_downloaded"
                    data-funnel-surface="portrait_studio"
                    data-funnel-destination={`${portrait.slug}-256`}
                  >
                    256px PNG
                  </a>
                  <a
                    href={`/downloads/bot-portraits/originals/${portrait.slug}-original.png`}
                    download
                    data-funnel-event="portrait_downloaded"
                    data-funnel-surface="portrait_studio"
                    data-funnel-destination={`${portrait.slug}-original`}
                  >
                    Original portrait
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shell portrait-gallery-section portrait-classic-section" aria-labelledby="portrait-classic-title">
        <div className="portrait-section-heading">
          <div>
            <p className="portrait-kicker">Classic Cabinet</p>
            <h2 id="portrait-classic-title">Eight role-based portraits</h2>
          </div>
          <p>
            Choose a familiar working role, from Writer to Operations. The prepared
            downloads use the same square format as the premium collection.
          </p>
        </div>

        <div className="portrait-gallery-grid portrait-gallery-grid-classic">
          {classicPortraits.map((portrait) => (
            <article className="portrait-card portrait-card-classic" key={portrait.slug}>
              <Image
                src={`/bot-portraits/previews/${portrait.slug}.webp`}
                alt={portrait.alt}
                width={560}
                height={560}
                sizes="(max-width: 500px) 92vw, (max-width: 700px) 45vw, (max-width: 1180px) 30vw, 300px"
              />
              <div className="portrait-card-copy">
                <span>Classic collection</span>
                <h3>{portrait.name}</h3>
                <p>{portrait.description}</p>
                <a
                  className="button button-primary"
                  href={`/downloads/bot-portraits/hermes/${portrait.slug}-1024.png`}
                  download
                  data-funnel-event="portrait_downloaded"
                  data-funnel-surface="portrait_studio"
                  data-funnel-destination={portrait.slug}
                >
                  <DownloadSimple size={16} aria-hidden="true" /> Download for Hermes
                </a>
                <div className="portrait-card-links">
                  <a
                    href={`/downloads/bot-portraits/hermes/${portrait.slug}-256.png`}
                    download
                    data-funnel-event="portrait_downloaded"
                    data-funnel-surface="portrait_studio"
                    data-funnel-destination={`${portrait.slug}-256`}
                  >
                    256px PNG
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="portrait-upload-steps" aria-label="How to add a portrait in Hermes Desktop">
          <article><span>01</span><DownloadSimple size={22} aria-hidden="true" /><div><h3>Download</h3><p>Choose the square 1024px PNG.</p></div></article>
          <article><span>02</span><UploadSimple size={22} aria-hidden="true" /><div><h3>Open Edit Profile</h3><p>Right-click the Bot in Hermes Desktop.</p></div></article>
          <article><span>03</span><Certificate size={22} aria-hidden="true" /><div><h3>Upload and save</h3><p>Choose Upload, select the image, and save.</p></div></article>
          <a href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode" target="_blank" rel="noreferrer">
            Official Bot Mode guide <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

      <BotPortraitStudio />

      <section className="shell portrait-use-section" id="portrait-use" aria-labelledby="portrait-use-title">
        <div>
          <p className="portrait-kicker">Use and provenance</p>
          <h2 id="portrait-use-title">Use these as Bot avatars</h2>
        </div>
        <div>
          <p>
            You may use the selected Portrait Studio images as profile images for AI Bots
            you operate or configure. Ordinary avatar cropping, resizing, and compression
            are allowed. Please do not resell or repackage the art, use it as a trademark,
            place it in model-training data, claim authorship, or imply an endorsement.
          </p>
          <p>
            The source PNGs retain their original Content Credentials. The prepared square
            downloads and their source records are documented. Read the <a href="/downloads/bot-portraits/ASSET-LICENSE.md" target="_blank" rel="noreferrer">full use terms <ArrowUpRight size={14} aria-hidden="true" /></a>, the <a href="/downloads/bot-portraits/PROVENANCE.md" target="_blank" rel="noreferrer">provenance record <ArrowUpRight size={14} aria-hidden="true" /></a>, or <a href="/downloads/bot-portraits/USAGE.txt" download>download the setup guide <DownloadSimple size={14} aria-hidden="true" /></a>.
          </p>
        </div>
      </section>
    </main>
  );
}
