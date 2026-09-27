import Link from "next/link";
import {
  ArrowRight,
  DownloadSimple,
  FileCode,
  Package,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "./copy-text-button";
import { BotWorkbench } from "./bot-workbench";
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
      id="choose-platform"
      aria-labelledby={`${botSlug}-platform-heading`}
    >
      <div className="bot-platform-chooser-heading">
        <div>
          <Eyebrow>Choose where to use it</Eyebrow>
          <h2 id={`${botSlug}-platform-heading`}>Use {botName} on your platform</h2>
        </div>
        <p>
          Pick the app you have. Each path tells you what is ready and what still needs testing.
        </p>
      </div>

      <div className="bot-platform-list">
        <details className="bot-platform-option" name={`${botSlug}-platform`}>
          <summary>
            <Package size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">Hermes Agent</span>
            <span className="bot-platform-status is-available">
              {runtimeEvidence
                ? "Bounded task passed"
                : pack.platforms.hermes.importEvidence
                  ? "Archive import passed"
                  : "Prepared profile · import test pending"}
            </span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
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
              data-funnel-event="bot_profile_download"
              data-funnel-surface="bot_platform_chooser"
              data-funnel-destination={botSlug}
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
          <div className="bot-platform-tracker">
            <p className="bot-platform-tracker-label">Keep track of your first Hermes run</p>
            <BotWorkbench botSlug={botSlug} botName={botName} packVersion={pack.packVersion} />
          </div>
          </div>
        </details>

        <details className="bot-platform-option" name={`${botSlug}-platform`}>
          <summary>
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">ChatGPT Workspace Agent</span>
            <span className="bot-platform-status is-prepared">Setup guide · test pending</span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
          <p>
            Build the same job as a Workspace Agent, add its Agent Skill, then
            choose the files, apps, approvals and sharing rules it needs. This
            adapter has not yet been installed or task-tested for {botName}.
          </p>
          <div className="bot-platform-actions">
            <Link href={`/start/chatgpt/${botSlug}`} className="text-link">
              Set up {botName} in ChatGPT <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

        <details className="bot-platform-option" name={`${botSlug}-platform`}>
          <summary>
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">Claude</span>
            <span className="bot-platform-status is-prepared">Setup guide · test pending</span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
          <p>
            Use a Cowork plugin or Skill for a general work role. Use Claude Code
            only when the job belongs to a codebase or local project. This adapter
            has not yet been installed or task-tested for {botName}.
          </p>
          <div className="bot-platform-actions">
            <Link href="/guides/use-a-bot-on-another-platform" className="text-link">
              Follow the Claude setup <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

        <details className="bot-platform-option" name={`${botSlug}-platform`}>
          <summary>
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">Grok Bot</span>
            <span className="bot-platform-status is-prepared">
              Prepared · test pending
            </span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
          <p>
            Copy the job into a Grok Bot profile, try one task, and review the
            result before adding a Skill or Routine. Runtime testing is still pending.
          </p>
          <div className="bot-platform-actions">
            <Link href={`/start/grok/${botSlug}`} className="text-link">
              Follow the guided setup <ArrowRight size={15} />
            </Link>
            <a
              href={grokBriefUrl}
              download
              className="text-link"
            >
              Download the full recipe <DownloadSimple size={15} />
            </a>
            <Link href="/platforms/grok-bot" className="text-link">
              See how the adaptation works <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

      </div>

      <details className="bot-platform-files">
        <summary>Want the files to adapt this Bot elsewhere?</summary>
        <div className="bot-platform-files-content">
          <h3>Portable Bot Pack</h3>
          <p>
            Keep the complete recipe as readable Markdown or structured JSON,
            including its Bot Passport and platform-specific setup notes. The
            included Agent Skill uses the <code>SKILL.md</code> convention, but
            a shared file format does not prove identical behavior on every host.
          </p>
          <div className="bot-platform-file-actions">
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
        </div>
      </details>
    </section>
  );
}
