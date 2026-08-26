import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-statement">
          <Link href="/" className="wordmark brand-wordmark footer-wordmark" aria-label="Bot Cabinet home">
            <Image
              src="/brand/bot-cabinet-wordmark-dark-v1.png"
              alt="Bot Cabinet"
              width={1400}
              height={296}
            />
          </Link>
          <p>
            A free, independent guide to finding, understanding, and building useful
            Bots, starting with Hermes Agent.
          </p>
          <p className="footer-fineprint">
            Not affiliated with Nous Research. Hermes Agent is an open-source project;
            model, API, and hosting costs may still apply.
          </p>
        </div>
        <div className="footer-column">
          <span>Explore</span>
          <Link href="/bots">The Cabinet</Link>
          <Link href="/workshop">Bot Lab</Link>
          <Link href="/use-cases">Bot Crews</Link>
          <Link href="/community">Community Registry</Link>
          <Link href="/guides">Field Manual</Link>
        </div>
        <div className="footer-column">
          <span>Registry</span>
          <Link href="/trust">Inspection Desk</Link>
          <Link href="/contribute">Submission Desk</Link>
          <Link href="/about">About Bot Cabinet</Link>
        </div>
        <div className="footer-column">
          <span>Elsewhere</span>
          <a href="https://github.com/Dgardenhire/bot-cabinet" target="_blank" rel="noreferrer">
            <GithubLogo size={16} aria-hidden="true" /> Bot Cabinet on GitHub
          </a>
          <a href="mailto:damon@linchpin.studio">Email Damon</a>
          <a href="https://github.com/NousResearch/hermes-agent" target="_blank" rel="noreferrer">
            <GithubLogo size={16} aria-hidden="true" /> Hermes Agent
          </a>
          <a href="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode" target="_blank" rel="noreferrer">
            Official Bot Mode docs <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://linchpin.studio/" target="_blank" rel="noreferrer">
            LINCHPIN <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://linchpin.studio/ai-lab" target="_blank" rel="noreferrer">
            AI Innovation Lab <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://ai-seminar.linchpin.studio/open-source" target="_blank" rel="noreferrer">
            Open Source newsletter <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://linchpin.studio/studio" target="_blank" rel="noreferrer">
            The Studio <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://ai-seminar.linchpin.studio/" target="_blank" rel="noreferrer">
            AI for the Real World <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://linchpin.studio/workshop" target="_blank" rel="noreferrer">
            LINCHPIN Workshop <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
