import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { AGENT_WATCH_SOURCE_GROUPS, AGENT_WATCH_SOURCES } from "@/data/agent-watch-sources";

export function AgentWatchSources() {
  return (
    <details className="agent-watch-sources">
      <summary>
        <div>
          <span>Coverage for this edition</span>
          <strong>Sources we check ({AGENT_WATCH_SOURCES.length})</strong>
        </div>
        <span className="agent-watch-sources-open">View sources</span>
      </summary>
      <p className="agent-watch-sources-note">Eight sources refresh here, including the official Grok Bot Marketplace. The remaining sources appear in the reviewed notes when there is something useful to report.</p>
      <div className="agent-watch-source-groups">
        {AGENT_WATCH_SOURCE_GROUPS.map((group) => (
          <div key={group}>
            <h3>{group}</h3>
            <ul>
              {AGENT_WATCH_SOURCES.filter((source) => source.group === group).map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">{source.name} <ArrowSquareOut size={12} /></a>
                  <span>{source.coverage}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
