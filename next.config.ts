import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iyzipay, "postman-request" (deprecated "request" fork'u) bağımlısıdır ve
  // dinamik require'lar içerir. Next.js bunu bundle etmeye çalışınca production'da
  // "Cannot find module" ile patlar. Harici bırakıp node_modules'tan çalıştır.
  serverExternalPackages: ["iyzipay"],
};

export default nextConfig;
