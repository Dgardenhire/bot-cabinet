import Link from "next/link";
import {
  ArrowRight,
  DownloadSimple,
  FileCode,
  Package,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "./copy-text-button";
import { Eyebrow } from "./ui";
import {
  portableBotPackV2ArtifactPaths,
  type PortableBotPackV2,
} from "../lib/portable-bot-pack-v2";

export function BotPlatformChooser({
  hermesImportCommand,
  pack,
  runtimeEvidence,
}: {
  hermesImportCommand?: string;
  pack: PortableBotPackV2;
  runtimeEvidence?: {
    proofPath: string;
    summary: string;
    testedDate: string;
  };
}) {
  const botName = pack.identity.name;
  const botSlug = pack.identity.slug;
  const hermesArchiveUrl = pack.platforms.hermes.archiveUrl;
  const hermesReadableFilesUrl = pack.platforms.hermes.readableFilesUrl;
  const grokBriefUrl = pack.platforms.grokBot.briefUrl;
  const paths = portableBotPackV2ArtifactPaths(botSlug);

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
              {runtimeEvidence
                ? "Bounded task passed"
                : pack.platforms.hermes.importEvidence
                  ? "Archive import passed"
                  : "Prepared profile · import test pending"}
            </span>
          </div>
          <h3>Hermes Agent</h3>
          <p>
            Import the prepared profile, review its files, choose the access it
            needs, and run the first assignment. {runtimeEvidence
              ? `${runtimeEvidence.summary} This is one run, not evidence of general reliability or approval for automation.`
              : pack.platforms.hermes.importEvidence
              ? `The archive and bundled Skill passed an isolated import check in Hermes Agent ${pack.platforms.hermes.importEvidence.hermesVersion}. Role-specific output testing remains pending.`
              : "Import and role-specific output testing remain pending for this new profile."}
          </p>
          <div className="bot-platform-actions">
            <a
              href={hermesArchiveUrl}
              download
              className="text-link"
            >
              Download the profile <DownloadSimple size={15} />
            </a>
            <a href={hermesReadableFilesUrl} download className="text-link">
              Inspect the readable files <DownloadSimple size={15} />
            </a>
            {hermesImportCommand && (
              <CopyTextButton
                text={hermesImportCommand}
                label="Copy the import command"
                analyticsEvent="bot_install_command_copy"
                analyticsSurface="bot_platform_chooser"
              />
            )}
            {runtimeEvidence && (
              <Link href={runtimeEvidence.proofPath} className="text-link">
                Read the test record <ArrowRight size={15} />
              </Link>
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
              href={grokBriefUrl}
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
            including its Bot Passport and platform-specific setup notes. The
            included Agent Skill uses the <code>SKILL.md</code> convention, but
            a shared file format does not prove identical behavior on every host.
          </p>
          <div className="bot-platform-actions">
            <a
              href={paths.portableMarkdownUrl}
              download
              className="text-link"
            >
              Download Markdown <DownloadSimple size={15} />
            </a>
            <a
              href={paths.portableJsonUrl}
              download
              className="text-link"
            >
              Download JSON <DownloadSimple size={15} />
            </a>
            <a
              href={paths.portableSkillUrl}
              download
              className="text-link"
              data-funnel-event="bot_portable_skill_download"
              data-funnel-surface="bot_platform_chooser"
              data-funnel-destination={botSlug}
            >
              Download the Agent Skill <DownloadSimple size={15} />
            </a>
          </div>
          <p className="bot-platform-portability-note">Prepared file. Review its instructions and permissions, then test it in the target agent before relying on it.</p>
        </article>
      </div>
    </section>
  );
}
