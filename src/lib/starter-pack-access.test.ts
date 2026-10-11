import { describe, expect, it, vi } from "vitest";
import { ACCESS_REQUEST_URL, PACK_CONTENT_URL, loadStarterPack, requestStarterPack } from "./starter-pack-access";
describe("server-granted pack access", () => {
  it("does not treat legacy signup success as entitlement", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    await expect(requestStarterPack("sample@example.invalid", "Sample", fetcher)).rejects.toThrow();
  });
  it("accepts server delivery acknowledgement without unlocking content", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accepted: true })));
    await requestStarterPack(" sample@example.invalid ", " Sample ", fetcher);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(ACCESS_REQUEST_URL, expect.objectContaining({ body: JSON.stringify({ email: "sample@example.invalid", name: "Sample" }) }));
  });
  it("keeps the bearer token out of the request URL", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("{}", { status: 403 }));
    await expect(loadStarterPack("test-token", fetcher)).rejects.toThrow("expired or is invalid");
    expect(fetcher).toHaveBeenCalledWith(PACK_CONTENT_URL, { headers: { Authorization: "Bearer test-token" }, cache: "no-store" });
  });
  it("rejects rate limits and malformed successful payloads", async () => {
    await expect(requestStarterPack("sample@example.invalid", "", vi.fn().mockResolvedValue(new Response("", { status: 429 })))).rejects.toThrow("wait");
    await expect(loadStarterPack("test-token", vi.fn().mockResolvedValue(new Response("{}")))).rejects.toThrow("couldn’t load");
  });
});
