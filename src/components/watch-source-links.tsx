import { ArrowSquareOut, Robot } from "@phosphor-icons/react/dist/ssr";
import styles from "./watch-source-links.module.css";

type Source = { label: string; href: string };
export function WatchSourceLinks({ sources }: { sources: Source[] }) {
  const templates = sources.filter(source => /^https:\/\/x\.ai\/bot\/(?:marketplace\/bots\/[^/]+|[\w-]{12,})\/?$/.test(source.href));
  const groups = new Map<string, Source[]>();
  for (const source of templates) {
    const name = source.label.split(":")[0];
    groups.set(name, [...(groups.get(name) ?? []), source]);
  }
  return <>
    {groups.size > 0 ? <div className={styles.templates}>{[...groups].map(([name, links]) => {
      const direct = links.find(link => !link.href.includes("/marketplace/")) ?? links[0];
      const instructions = links.find(link => link !== direct);
      return <div className={styles.template} key={name}>
        <Robot size={24} weight="duotone" aria-hidden="true" />
        <div><a href={direct.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} in Grok Bot`} data-funnel-event="native_template_open" data-funnel-surface="agent_watch" data-funnel-destination="grok_bot"><strong>{name}</strong><span>Open in Grok Bot <ArrowSquareOut size={14} aria-hidden="true" /></span></a>
        {instructions ? <a className={styles.instructions} href={instructions.href} target="_blank" rel="noopener noreferrer">Read instructions</a> : null}</div>
      </div>;
    })}</div> : null}
    {sources.some(source => !templates.includes(source)) ? <div className="agent-watch-links">{sources.filter(source => !templates.includes(source)).map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <ArrowSquareOut size={13} aria-hidden="true" /></a>)}</div> : null}
  </>;
}
