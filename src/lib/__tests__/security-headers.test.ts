import { describe, expect, test } from "vitest";
import { CSP_ENFORCE, buildCsp, securityHeaders } from "../security-headers";

function directive(csp: string, name: string): string[] {
  const part = csp.split("; ").find((d) => d.startsWith(`${name} `) || d === name);
  return part ? part.split(" ").slice(1) : [];
}

describe("buildCsp", () => {
  const prod = buildCsp(false);

  test("kullanılan üçüncü tarafların hepsine script izni verir", () => {
    const scripts = directive(prod, "script-src");
    expect(scripts).toContain("https://www.googletagmanager.com"); // GA4 + GTM
    expect(scripts).toContain("https://connect.facebook.net"); // Meta Pixel
    expect(scripts).toContain("https://*.iyzipay.com"); // ödeme formu
  });

  test("iyzico ödeme iframe'ine ve form gönderimine izin verir", () => {
    expect(directive(prod, "frame-src")).toContain("https://*.iyzipay.com");
    expect(directive(prod, "form-action")).toContain("https://*.iyzipay.com");
  });

  test("sayfanın yabancı sitelerce iframe'lenmesini yasaklar", () => {
    expect(directive(prod, "frame-ancestors")).toEqual(["'self'"]);
    expect(directive(prod, "object-src")).toEqual(["'none'"]);
    expect(directive(prod, "base-uri")).toEqual(["'self'"]);
  });

  test("production'da eval yok; HTTP→HTTPS yükseltme yalnızca zorunlu modda", () => {
    expect(directive(prod, "script-src")).not.toContain("'unsafe-eval'");
    // Rapor modunda tarayıcı direktifi yok sayıp konsola hata basar.
    expect(prod.includes("upgrade-insecure-requests")).toBe(CSP_ENFORCE);
  });

  test("dev'de Next HMR için eval ve websocket açık, yükseltme yok", () => {
    const dev = buildCsp(true);
    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(directive(dev, "connect-src")).toContain("ws:");
    expect(dev).not.toContain("upgrade-insecure-requests");
  });

  test("ihlaller rapor uç noktasına gider", () => {
    expect(directive(prod, "report-uri")).toEqual(["/api/csp-report"]);
  });

  test("hiçbir direktif boş kaynak listesiyle basılmaz", () => {
    for (const part of prod.split("; ")) {
      expect(part.trim()).not.toBe("");
      expect(part.endsWith(" ")).toBe(false);
    }
  });
});

describe("securityHeaders", () => {
  const headers = securityHeaders(false);
  const get = (key: string) => headers.find((h) => h.key === key)?.value;

  test("temel başlıklar zorunlu modda", () => {
    expect(get("Strict-Transport-Security")).toBe("max-age=31536000; includeSubDomains");
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get("Permissions-Policy")).toContain("camera=()");
  });

  test("Permissions-Policy ödeme API'sini kısıtlamaz (iyzico iframe)", () => {
    expect(get("Permissions-Policy")).not.toContain("payment");
  });

  test("CSP başlık adı CSP_ENFORCE bayrağına göre seçilir", () => {
    const expected = CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
    expect(get(expected)).toBe(buildCsp(false));
    expect(headers.filter((h) => h.key.startsWith("Content-Security-Policy"))).toHaveLength(1);
  });
});
