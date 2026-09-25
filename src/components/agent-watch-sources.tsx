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
      <p className="agent-watch-sources-note">Fourteen sources feed the current listings, including the official Grok Bot Marketplace, independent Bot directories and newly created agent repositories. Other sources stay on this list even when they do not offer a dependable public feed.</p>
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
