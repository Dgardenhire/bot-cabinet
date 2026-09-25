import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui";
import { GUIDES } from "@/data/guides";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Field Manual · Guides",
  description: "Plain-language guides to choosing agent tools, inspecting Bot workflows, setting up Hermes profiles, and testing useful results.",
  path: "/guides/",
  image: "/brand/social/field-manual-1200x630.jpg",
  imageAlt: "Field Manual — choose, inspect and test agent workflows",
});

export default function GuidesPage() {
  return (
    <main id="main-content" className="page-main">
      <section className="inner-hero">
        <div className="shell inner-hero-grid guides-hero-grid">
          <div>
            <Eyebrow>Step-by-step guides</Eyebrow>
            <h1 className="inner-title">Field Manual</h1>
            <p className="inner-deck">Choose an agent path that fits your work. Compare services and reusable workflows, inspect a package, and test a useful result. Hermes setup guides remain here when that is the right path.</p>
          </div>
          <figure className="guides-hero-art">
            <Image
              src="/atelier/victorian-library-guides-v1.png"
              alt="A Victorian library with a reading table, books, and a brass lamp"
              width={1774}
              height={887}
              priority
            />
            <figcaption>Practical guides with dated context and links to original sources.</figcaption>
          </figure>
        </div>
      </section>

      <section className="content-section shell">
        <div className="guide-path">
          <div className="guide-path-step"><Compass size={24} weight="thin" /><span>Understand</span></div>
          <div className="guide-path-step"><ShieldCheck size={24} weight="thin" /><span>Inspect</span></div>
          <div className="guide-path-step"><BookOpenText size={24} weight="thin" /><span>Test</span></div>
        </div>
        <div className="guide-card-grid">
          {GUIDES.map((guide, index) => (
            <Link href={`/guides/${guide.slug}`} className="guide-card" key={guide.slug}>
              <div className="guide-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{guide.readTime}</span>
              </div>
              <div className="guide-card-main">
                <div className="guide-book-thumbnail" aria-hidden="true">
                  <Image
                    src={guide.coverImage ?? `/guides/books/${guide.slug}.webp`}
                    alt=""
                    width={360}
                    height={450}
                    sizes="84px"
                  />
                </div>
                <div className="guide-card-copy">
                  <h2>{guide.title}</h2>
                  <p>{guide.summary}</p>
                </div>
              </div>
              <div className="guide-card-footer">
                <span>{guide.audience}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
