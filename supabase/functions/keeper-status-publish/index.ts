import { parsePublishRequest, secretsMatch } from "./core.ts";

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });
  const expectedSecret = Deno.env.get("KEEPER_STATUS_PUBLISH_SECRET") ?? "";
  const providedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!await secretsMatch(providedSecret, expectedSecret)) return json(401, { error: "Not authorized" });
  let body: unknown;
  try { body = await request.json(); } catch { return json(400, { error: "Invalid request" }); }
  const publication = await parsePublishRequest(body);
  if (!publication) return json(400, { error: "Invalid or changed approval record" });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json(503, { error: "Publication unavailable" });
  const authHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" };
  const currentResponse = await fetch(`${supabaseUrl}/rest/v1/keeper_status_publications?select=revision&order=revision.desc&limit=1`, { headers: authHeaders });
  if (!currentResponse.ok) return json(503, { error: "Publication unavailable" });
  const current = await currentResponse.json() as { revision: number }[];
  const currentRevision = current[0]?.revision ?? 0;
  if (currentRevision !== publication.expectedRevision) return json(409, { error: "The status changed after review", currentRevision });
  const nextRevision = currentRevision + 1;
  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/keeper_status_publications`, {
    method: "POST",
    headers: { ...authHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({
      revision: nextRevision,
      payload: publication.status,
      content_sha256: publication.contentSha256,
      approved_by: publication.approval.approvedBy.trim(),
      approved_at: publication.approval.approvedAt,
      approval_note: publication.approval.note.trim(),
    }),
  });
  if (insertResponse.status === 409) return json(409, { error: "The status changed after review" });
  if (!insertResponse.ok) return json(503, { error: "Publication unavailable" });
  return json(201, { published: true, revision: nextRevision });
});
