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
      <p className="agent-watch-sources-note">Seven sources can refresh here today. The others are checked through reviewed editions because they do not provide a safe browser-readable feed. Cabinet Keeper is not yet supplying continuous updates, so we do not call the whole list live.</p>
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
