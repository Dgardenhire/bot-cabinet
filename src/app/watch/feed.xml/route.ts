import { AGENT_WATCH_RSS_URL } from "@/lib/agent-watch-live";

export const dynamic = "force-static";

export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: AGENT_WATCH_RSS_URL,
      "Cache-Control": "public, max-age=300",
    },
  });
}
