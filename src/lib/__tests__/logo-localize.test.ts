import { describe, expect, test } from "vitest";
import { isFetchableLogoUrl, localizeReferenceLogos } from "../logo-localize";
import type { ReferenceItem } from "../references";

const ref = (name: string, logo: string): ReferenceItem => ({ name, url: "", logo });

describe("isFetchableLogoUrl", () => {
  test("yalnızca https alan adlarını kabul eder", () => {
    expect(isFetchableLogoUrl("https://cdn.dsmcdn.com/x/logo.jpg")).toBe(true);
    expect(isFetchableLogoUrl("http://cdn.dsmcdn.com/x/logo.jpg")).toBe(false);
    expect(isFetchableLogoUrl("https://127.0.0.1/logo.png")).toBe(false);
    expect(isFetchableLogoUrl("https://localhost/logo.png")).toBe(false);
    expect(isFetchableLogoUrl("https://[::1]/logo.png")).toBe(false);
    expect(isFetchableLogoUrl("/api/logo?file=a.png")).toBe(false);
  });
});

describe("localizeReferenceLogos", () => {
  const stored: Record<string, number> = {};
  const store = async (name: string, data: Buffer) => {
    stored[name] = data.byteLength;
  };
  const fetchOk = async () => ({ data: Buffer.from("png-bytes"), ext: "png" });

  test("uzak logoyu indirir, yerel yola çevirir; yerel/boş olanları atlar", async () => {
    const refs = [
      ref("Uzak", "https://cdn.example.com/a.jpg"),
      ref("Yerel", "/api/logo?file=abc.png"),
      ref("Logosuz", ""),
    ];
    const r = await localizeReferenceLogos(refs, fetchOk, store);
    expect(r.localized).toEqual(["Uzak"]);
    expect(r.skipped).toEqual(["Yerel", "Logosuz"]);
    expect(r.failed).toEqual([]);
    expect(r.references[0].logo).toMatch(/^\/api\/logo\?file=[a-z0-9-]+\.png$/);
    expect(r.references[1].logo).toBe("/api/logo?file=abc.png");
    expect(Object.keys(stored)).toHaveLength(1);
  });

  test("indirme hatasında eski adres korunur ve neden raporlanır", async () => {
    const refs = [ref("Bozuk", "https://cdn.example.com/yok.jpg")];
    const r = await localizeReferenceLogos(refs, async () => { throw new Error("HTTP 404"); }, store);
    expect(r.localized).toEqual([]);
    expect(r.failed).toEqual([{ name: "Bozuk", reason: "HTTP 404" }]);
    expect(r.references[0].logo).toBe("https://cdn.example.com/yok.jpg");
  });

  test("http:// ve IP adresleri indirilmeden reddedilir", async () => {
    const refs = [ref("Http", "http://cdn.example.com/a.jpg"), ref("Ip", "https://10.0.0.1/a.jpg")];
    let calls = 0;
    const r = await localizeReferenceLogos(refs, async () => { calls++; return fetchOk(); }, store);
    expect(calls).toBe(0);
    expect(r.failed.map((f) => f.name)).toEqual(["Http", "Ip"]);
  });
});
