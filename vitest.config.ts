import { defineConfig } from "vitest/config";
import path from "path";

// tsconfig'deki "@/…" takma adı; Next bunu kendisi çözer, Vitest'e ayrıca söylenmeli.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"] },
});
