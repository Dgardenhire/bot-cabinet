import { AGENT_WATCH_ITEMS, AGENT_WATCH_UPDATED } from "@/data/agent-watch";

const ORIGIN = "https://botcabinet.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function utcDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

export function buildAgentWatchRss() {
  const items = AGENT_WATCH_ITEMS.flatMap(item => {
    const link = `${ORIGIN}/watch/#${item.slug}`;
    const description = [
      `Signal: ${item.signal}`,
      `Why it matters: ${item.whyItMatters}`,
      `Cabinet response: ${item.cabinetResponse}`,
      `What remains unproven: ${item.limits}`,
      `Review again by: ${item.reviewAgainBy}`,
    ].join("\n\n");
    return [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(`bot-cabinet:watch:${item.slug}:${item.observedOn}`)}</guid>`,
      `      <description>${escapeXml(description)}</description>`,
      `      <category>${escapeXml(item.evidence)}</category>`,
      `      <pubDate>${utcDate(item.observedOn)}</pubDate>`,
      "    </item>",
    ];
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Bot Cabinet Agent Watch</title>",
    `    <link>${ORIGIN}/watch/</link>`,
    "    <description>Dated, source-linked signals from the changing agent ecosystem and Bot Cabinet&apos;s documented response.</description>",
    "    <language>en-us</language>",
    `    <lastBuildDate>${utcDate(AGENT_WATCH_UPDATED)}</lastBuildDate>`,
    `    <atom:link href="${ORIGIN}/watch/feed.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export const AGENT_WATCH_RSS = buildAgentWatchRss();
