import type { NextConfig } from "next";
import { CSP_REPORT_ONLY_PATHS, securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  // iyzipay, "postman-request" (deprecated "request" fork'u) bağımlısıdır ve
  // dinamik require'lar içerir. Next.js bunu bundle etmeye çalışınca production'da
  // "Cannot find module" ile patlar. Harici bırakıp node_modules'tan çalıştır.
  serverExternalPackages: ["iyzipay"],

  // Güvenlik başlıkları — tanımlar ve gerekçeler src/lib/security-headers.ts'te.
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    // Next eşleşen TÜM kuralları BİRLEŞTİRİR (ezmez): muaf yola hem zorunlu hem
    // rapor başlığı giderdi. Bu yüzden ana kural muaf yolları dışarıda bırakır.
    const excluded = CSP_REPORT_ONLY_PATHS.map((p) => p.replace(/^\//, "")).join("|");
    return [
      { source: `/((?!${excluded}).*)`, headers: securityHeaders(isDev) },
      ...CSP_REPORT_ONLY_PATHS.map((source) => ({ source, headers: securityHeaders(isDev, true) })),
    ];
  },
};

export default nextConfig;
