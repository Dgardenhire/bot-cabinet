import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, List, X } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  ["Start Here", "/start"],
  ["The Cabinet", "/bots"],
  ["Bot Lab", "/workshop"],
  ["Bot Crews", "/use-cases"],
  ["Crew Kits", "/crew-kits"],
  ["Community Registry", "/community"],
  ["Field Manual", "/guides"],
  ["Inspection Desk", "/trust"],
  ["Submission Desk", "/contribute"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="independent-bar">
        <span className="independent-note">
          <span className="status-lamp" aria-hidden="true" />
          Independent guide to useful Bots · Starting with Hermes Agent
        </span>
        <a
          className="newsletter-top-link"
          href="https://ai-seminar.linchpin.studio/open-source"
          target="_blank"
          rel="noreferrer"
        >
          Read the Open Source newsletter <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <div className="site-nav shell">
        <Link href="/" className="wordmark brand-wordmark" aria-label="Bot Cabinet home">
          <Image
            src="/brand/bot-cabinet-wordmark-dark-v1.png"
            alt="Bot Cabinet"
            width={1400}
            height={296}
            priority
          />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <List className="menu-open" size={23} aria-hidden="true" />
            <X className="menu-close" size={23} aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
