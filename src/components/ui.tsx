import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-rule" aria-label={typeof children === "string" ? children : undefined}>
      <span aria-hidden="true" />
      <strong>{children}</strong>
      <span aria-hidden="true" />
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-link">
      {children} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

export function EvidencePill({
  kind,
  children,
}: {
  kind: "official" | "tested" | "blueprint" | "maintainer" | "review";
  children: React.ReactNode;
}) {
  return <span className={`evidence-pill evidence-${kind}`}>{children}</span>;
}

export function FeatureLine({
  icon: IconComponent,
  title,
  children,
}: {
  icon: Icon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="feature-line">
      <div className="feature-icon">
        <IconComponent size={24} weight="thin" aria-hidden="true" />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
