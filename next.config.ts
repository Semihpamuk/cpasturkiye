import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  // iyzipay, "postman-request" (deprecated "request" fork'u) bağımlısıdır ve
  // dinamik require'lar içerir. Next.js bunu bundle etmeye çalışınca production'da
  // "Cannot find module" ile patlar. Harici bırakıp node_modules'tan çalıştır.
  serverExternalPackages: ["iyzipay"],

  // Güvenlik başlıkları — tanımlar ve gerekçeler src/lib/security-headers.ts'te.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders(process.env.NODE_ENV !== "production"),
      },
    ];
  },
};

export default nextConfig;
