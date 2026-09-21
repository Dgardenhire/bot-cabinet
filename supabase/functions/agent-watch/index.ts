import { latestPublications, mergePublishedWithFallback } from "./core.ts";
import { AGENT_WATCH_SEED } from "./seed.ts";

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
  const headers = { ...cors, "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" };
  return Response.json({ version: 1, updatedAt: new Date().toISOString(), items }, { headers });
});
