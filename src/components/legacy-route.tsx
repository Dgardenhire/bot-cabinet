import Link from "next/link";
import { ArrowRight, Compass } from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui";

export function LegacyRoute({ eyebrow, title, copy, href, action }: { eyebrow: string; title: string; copy: string; href: string; action: string }) {
  return (
    <main id="main-content" className="page-main legacy-route">
      <div className="shell legacy-route-card">
        <Compass size={38} weight="thin" aria-hidden="true" />
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{copy}</p>
        <Link href={href} className="button button-primary">{action} <ArrowRight size={16} /></Link>
      </div>
    </main>
  );
}
