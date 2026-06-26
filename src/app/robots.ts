import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Yapay zekâ / arama botlarına içeriğin taranmasına açıkça izin verilir.
// (GPTBot, OAI-SearchBot → ChatGPT; ClaudeBot → Claude; PerplexityBot → Perplexity;
//  Google-Extended → Gemini/AI Overviews). Yalnızca /admin ve /api gizli tutulur.
const AI_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/admin", "/api/"],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
