import { NextResponse } from "next/server";
import { loadLiveBotListings } from "@/lib/live-bot-listings-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await loadLiveBotListings();
  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
  });
}
