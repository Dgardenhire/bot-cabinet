import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowSquareOut, Info, Warning } from "@phosphor-icons/react/dist/ssr";
import { EvidencePill, Eyebrow } from "@/components/ui";
import { getGuide, GUIDES } from "@/data/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  return guide ? { title: `${guide.title} · Field Manual`, description: guide.summary } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <main id="main-content" className="page-main">
      <article className="guide-article shell">
        <Link href="/guides" className="guide-back"><ArrowLeft size={15} /> Back to the Field Manual</Link>
        <header className="guide-article-header">
          <Eyebrow>{guide.audience}</Eyebrow>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <div className="guide-meta">
            <span>{guide.readTime} read</span>
            <span>Updated {guide.updated}</span>
            <EvidencePill kind="official">Official sources linked</EvidencePill>
          </div>
        </header>

        <div className="guide-article-body">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              {section.code && <pre className="guide-code"><code>{section.code}</code></pre>}
              {section.note && <aside className="guide-note"><Warning size={19} weight="thin" /><p>{section.note}</p></aside>}
              {section.sources && (
                <div className="guide-sources">
                  <Info size={16} weight="thin" aria-hidden="true" />
                  <span>Sources</span>
                  {section.sources.map((source) => (
                    <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                      {source.label} <ArrowSquareOut size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
