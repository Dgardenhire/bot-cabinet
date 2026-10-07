import Link from "next/link";
import {
  ArrowRight,
  DownloadSimple,
  FileCode,
  Package,
} from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "./copy-text-button";
import { BotWorkbench } from "./bot-workbench";
import { OpenBotWorkbenchOnHash } from "./open-bot-workbench-on-hash";
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
          Choose your app for setup instructions and test results.
        </p>
      </div>

      <div className="bot-platform-list">
        <details className="bot-platform-option" name={`${botSlug}-platform`} suppressHydrationWarning>
          <summary>
            <Package size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">Hermes Agent</span>
            <span className="bot-platform-status is-available">
              {runtimeEvidence
                ? "One task test passed"
                : pack.platforms.hermes.importEvidence
                  ? "Archive import passed"
                  : "Profile ready · import not tested"}
            </span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
          <p>
            Import the profile, review its files, choose the access it
            needs, and run the first assignment. {runtimeEvidence
              ? `${runtimeEvidence.summary} This record covers one run, not general reliability. Review and approve any automation separately.`
              : pack.platforms.hermes.importEvidence
              ? `The archive imported successfully and its Skill was present in an isolated Hermes Agent ${pack.platforms.hermes.importEvidence.hermesVersion} installation. Its task results have not been tested.`
              : "This profile has not been tested for import or task results."}
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
              Read the files <DownloadSimple size={15} />
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

        <details className="bot-platform-option" name={`${botSlug}-platform`} suppressHydrationWarning>
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
            setup has not yet been installed or task-tested for {botName}.
          </p>
          <div className="bot-platform-actions">
            <Link href={`/start/chatgpt/${botSlug}`} className="text-link">
              Set up {botName} in ChatGPT <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

        <details className="bot-platform-option" name={`${botSlug}-platform`} suppressHydrationWarning>
          <summary>
            <FileCode size={24} weight="thin" aria-hidden="true" />
            <span className="bot-platform-option-name">Claude</span>
            <span className="bot-platform-status is-prepared">Setup guide · test pending</span>
            <span className="bot-platform-option-cue" aria-hidden="true">+</span>
          </summary>
          <div className="bot-platform-option-content">
          <p>
            Use a Cowork plugin or Skill for a general work role. Use Claude Code
            only when the job involves code or a local project. This setup
            has not yet been installed or task-tested for {botName}.
          </p>
          <div className="bot-platform-actions">
            <Link href="/guides/use-a-bot-on-another-platform" className="text-link">
              Follow the Claude setup <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

        <details className="bot-platform-option" name={`${botSlug}-platform`} suppressHydrationWarning>
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
            result before adding a Skill or Routine. This Bot has not been tested in Grok.
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
              Grok Bot setup help <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </details>

      </div>

      <OpenBotWorkbenchOnHash />

      <details className="bot-platform-files">
        <summary>Download files for another app</summary>
        <div className="bot-platform-files-content">
          <h3>Portable Bot Pack</h3>
          <p>
            Download the instructions, Bot Passport and setup notes as Markdown
            or JSON. The Agent Skill is a <code>SKILL.md</code> file. Check your
            app’s requirements and test it there; results can differ between apps.
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
          <p className="bot-platform-portability-note">Review the instructions and permissions, then run a test in your chosen app before relying on the result.</p>
        </div>
      </details>
    </section>
  );
}
