import { AGENT_WATCH_RSS } from "@/lib/agent-watch-feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(AGENT_WATCH_RSS, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
