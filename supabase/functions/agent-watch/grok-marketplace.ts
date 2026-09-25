export type GrokMarketplaceListing = {
  id: string;
  name: string;
  job: string;
  creator: string;
  sourceUrl: string;
};

const START = ',\\"templates\\":[';
const END = '],\\"initialCategory\\"';
const MAX_HTML_CHARS = 2_000_000;
const MAX_LISTINGS = 200;

export async function readBoundedText(response: Response, maximumBytes = MAX_HTML_CHARS): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumBytes) throw new Error("marketplace response exceeded the byte limit");
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const combined = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(combined);
}

function text(value: unknown, maximum: number): string | null {
  return typeof value === "string" && value.trim() && value.length <= maximum ? value.trim() : null;
}

/** Read the bounded public catalog embedded in the official marketplace page. */
export function parseGrokMarketplaceHtml(html: string): GrokMarketplaceListing[] {
  if (!html || html.length > MAX_HTML_CHARS) return [];
  const start = html.indexOf(START);
  if (start < 0) return [];
  const contentStart = start + START.length;
  const end = html.indexOf(END, contentStart);
  if (end < 0) return [];

  let raw: unknown;
  try {
    const decoded = JSON.parse(`"${html.slice(contentStart, end)}"`);
    raw = JSON.parse(`[${decoded}]`);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  return raw.slice(0, MAX_LISTINGS).flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const item = entry as Record<string, unknown>;
    const id = text(item.id, 100);
    const name = text(item.name, 120);
    const job = text(item.summary, 500) ?? text(item.description, 500);
    const creator = text(item.creatorName, 120);
    if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(id) || !name || !job || !creator || seen.has(id)) return [];
    seen.add(id);
    return [{ id, name, job, creator, sourceUrl: `https://x.ai/bot/marketplace/bots/${id}` }];
  });
}
