import { ArrowRight, TerminalWindow } from "@phosphor-icons/react/dist/ssr";

import { CopyTextButton } from "@/components/copy-text-button";
import {
  CABINET_CATALOG_LISTED,
  CABINET_INSTALL_COMMAND,
  CABINET_INSTALL_URL,
  CABINET_MIN_HERMES,
  CABINET_REPO,
} from "@/data/hermes-cabinet";
import styles from "./cabinet-install.module.css";

export function CabinetInstallButton({ surface }: { surface: string }) {
  return (
    <a href={CABINET_INSTALL_URL} className="button button-primary" data-funnel-event="cabinet_plugin_install_open" data-funnel-surface={surface}>
      Install in Hermes <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}

export function CabinetInstall({ surface }: { surface: string }) {
  return (
    <div className={styles.install}>
      <div className={styles.primary}>
        <CabinetInstallButton surface={surface} />
        <p>
          Do this on the computer where Hermes Desktop is installed. You need Hermes {CABINET_MIN_HERMES} or later.
        </p>
      </div>

      <ol className={styles.steps}>
        {CABINET_CATALOG_LISTED ? (
          <li>
            <strong>Find Cabinet in the plugin catalog</strong>
            <p>
              In Hermes Desktop, open <span className={styles.ui}>Capabilities</span>, then{" "}
              <span className={styles.ui}>Plugins</span>. Find Cabinet in the catalog and press{" "}
              <span className={styles.ui}>Install</span>. The button above opens the same screen.
            </p>
          </li>
        ) : (
          <li>
            <strong>Press Install in Hermes</strong>
            <p>
              Hermes Desktop opens and shows Cabinet&apos;s install screen. Press <span className={styles.ui}>Install</span>.
            </p>
            <p>
              Hermes marks Cabinet as Unverified because it comes straight from GitHub. That is expected for now.
            </p>
          </li>
        )}
        <li>
          <strong>Open Cabinet in the sidebar</strong>
          <p>If it isn&apos;t there yet, quit Hermes Desktop fully and open it again.</p>
        </li>
        <li>
          <strong>If it says Cabinet isn&apos;t connected</strong>
          <p>
            Open <span className={styles.ui}>Capabilities</span>, turn Cabinet on, and open the page again. You can
            browse while it&apos;s off, but adding a Bot needs it on.
          </p>
        </li>
      </ol>

      <div className={styles.terminal}>
        <p className={styles.terminalTitle}>
          <TerminalWindow size={18} weight="thin" aria-hidden="true" /> Prefer the terminal?
        </p>
        <p>
          On Windows, open PowerShell. On a Mac or Linux, open Terminal. Run this line, then quit Hermes Desktop fully
          and open it again.
        </p>
        <code className={styles.command}>
          hermes plugins install {CABINET_REPO} <span className={styles.nowrap}>--enable</span>
        </code>
        <CopyTextButton text={CABINET_INSTALL_COMMAND} label="Copy the install line" analyticsEvent="cabinet_plugin_install_copy" analyticsSurface={surface} />
      </div>
    </div>
  );
}
