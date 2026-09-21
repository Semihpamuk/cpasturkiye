import { describe, expect, test } from "vitest";
import { isFetchableLogoUrl, localizeReferenceLogos, sniffImageExt } from "../logo-localize";
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

describe("sniffImageExt", () => {
  test("yanlış Content-Type gelse de JPEG/PNG/WEBP/SVG'yi baytlardan tanır", () => {
    expect(sniffImageExt(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]))).toBe("jpg");
    expect(sniffImageExt(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]))).toBe("png");
    expect(sniffImageExt(Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 ")]))).toBe("webp");
    expect(sniffImageExt(Buffer.from('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"/>'))).toBe("svg");
    expect(sniffImageExt(Buffer.from("  <svg viewBox='0 0 1 1'/>"))).toBe("svg");
  });
  test("görsel olmayan veriyi reddeder", () => {
    expect(sniffImageExt(Buffer.from("<html><body>404</body></html>"))).toBeNull();
    expect(sniffImageExt(Buffer.from([0x00, 0x01]))).toBeNull();
    expect(sniffImageExt(Buffer.alloc(0))).toBeNull();
  });
});
