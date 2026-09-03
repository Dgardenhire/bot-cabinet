import Link from "next/link";
import {
  ArrowRight,
  DownloadSimple,
  FileCode,
  Package,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "./copy-text-button";
import { Eyebrow } from "./ui";

export function BotPlatformChooser({
  botName,
  botSlug,
  hermesImportCommand,
}: {
  botName: string;
  botSlug: string;
  hermesImportCommand?: string;
}) {
  return (
    <section
      className="bot-platform-chooser shell"
      aria-labelledby={`${botSlug}-platform-heading`}
    >
      <div className="bot-platform-chooser-heading">
        <div>
          <Eyebrow>Choose a platform</Eyebrow>
          <h2 id={`${botSlug}-platform-heading`}>Use {botName} on your platform</h2>
        </div>
        <p>
          The job, limits, first task, Skill recipe, and Routine recipe stay
          together. Each platform gets its own setup path and status.
        </p>
      </div>

      <div className="bot-platform-grid">
        <article>
          <div className="bot-platform-card-topline">
            <Package size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-status is-available">
              Downloadable profile
            </span>
          </div>
          <h3>Hermes Agent</h3>
          <p>
            Import the prepared profile, review its files, choose the access it
            needs, and run the first test.
          </p>
          <div className="bot-platform-actions">
            <a
              href={`/downloads/starter-bots/${botSlug}.tar.gz`}
              download
              className="text-link"
            >
              Download the profile <DownloadSimple size={15} />
            </a>
            {hermesImportCommand && (
              <CopyTextButton
                text={hermesImportCommand}
                label="Copy the import command"
                analyticsEvent="bot_install_command_copy"
                analyticsSurface="bot_platform_chooser"
              />
            )}
          </div>
        </article>

        <article>
          <div className="bot-platform-card-topline">
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-status is-prepared">
              Prepared · test pending
            </span>
          </div>
          <h3>Grok Bot</h3>
          <p>
            Use the build brief to create this role with Grok Bot&apos;s profile,
            Skill, Routine, and sharing controls. Runtime testing is still pending.
          </p>
          <div className="bot-platform-actions">
            <a
              href={`/downloads/grok-bot-templates/${botSlug}.md`}
              download
              className="text-link"
            >
              Download the Grok build brief <DownloadSimple size={15} />
            </a>
            <Link href="/platforms/grok-bot" className="text-link">
              See how the adaptation works <ArrowRight size={15} />
            </Link>
          </div>
        </article>

        <article>
          <div className="bot-platform-card-topline">
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-status">Platform-neutral core</span>
          </div>
          <h3>Portable Bot Pack</h3>
          <p>
            Keep the complete recipe as readable Markdown or structured JSON,
            including its Bot Passport and platform-specific setup notes.
          </p>
          <div className="bot-platform-actions">
            <a
              href={`/downloads/portable-bot-packs/${botSlug}.md`}
              download
              className="text-link"
            >
              Download Markdown <DownloadSimple size={15} />
            </a>
            <a
              href={`/downloads/portable-bot-packs/${botSlug}.json`}
              download
              className="text-link"
            >
              Download JSON <DownloadSimple size={15} />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
