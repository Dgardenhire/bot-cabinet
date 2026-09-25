import { latestPublications, mergePublishedWithFallback } from "./core.ts";
import { parseGrokMarketplaceHtml, readBoundedText } from "./grok-marketplace.ts";
import { AGENT_WATCH_SEED } from "./seed.ts";
import { loadLiveBotListings } from "./live-listings.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "accept, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return Response.json({ error: "Feed unavailable" }, { status: 503, headers: cors });

  const response = await fetch(`${supabaseUrl}/rest/v1/agent_watch_publications?select=slug,revision,payload,published_at&order=revision.desc&limit=500`, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
  });
  if (!response.ok) return Response.json({ error: "Feed unavailable" }, { status: 503, headers: cors });

  const items = mergePublishedWithFallback(latestPublications(await response.json()), AGENT_WATCH_SEED);
  let marketplaceListings: ReturnType<typeof parseGrokMarketplaceHtml> = [];
  let marketplaceAvailable = false;
  try {
    const marketplace = await fetch("https://x.ai/bot/marketplace", {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8_000),
    });
    const declaredSize = Number(marketplace.headers.get("content-length") ?? 0);
    if (marketplace.ok && (!declaredSize || declaredSize <= 2_000_000)) {
      marketplaceListings = parseGrokMarketplaceHtml(await readBoundedText(marketplace));
      marketplaceAvailable = marketplaceListings.length > 0;
    }
  } catch {
    // The reviewed feed remains available when the outside marketplace is not.
  }
  const listings = await loadLiveBotListings();
  const headers = { ...cors, "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" };
  return Response.json({
    version: 1,
    updatedAt: new Date().toISOString(),
    items,
    marketplace: {
      source: "Grok Bot Marketplace",
      sourceUrl: "https://x.ai/bot/marketplace",
      available: marketplaceAvailable,
      listings: marketplaceListings,
    },
    listings,
  }, { headers });
});
