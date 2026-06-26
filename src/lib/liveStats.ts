import "server-only";

/**
 * Jale panelinin public stats endpoint'inden canlı özet istatistikleri çeker.
 *
 * SADECE SUNUCU TARAFINDA çalışır ("server-only") — API anahtarı tarayıcıya düşmez.
 * Env değişkenleri eksikse veya istek başarısız olursa null döner; bu durumda
 * canlı istatistik bandı hiç render edilmez (site bozulmaz).
 *
 * Gerekli env:
 *   JALE_STATS_URL      → ör. https://panel.cpasturkiye.com/api/public/stats
 *   JALE_STATS_API_KEY  → Jale .env'indeki PUBLIC_STATS_API_KEY ile aynı
 */

import type { LiveStats } from "@/types/liveStats";

export type { LiveStats, StatsBucket } from "@/types/liveStats";

interface StatsApiResponse {
  success: boolean;
  data?: LiveStats;
  error?: string;
}

const REVALIDATE_SECONDS = 300; // 5 dk — Jale tarafındaki cache ile uyumlu

export async function getLiveStats(): Promise<LiveStats | null> {
  const url = process.env.JALE_STATS_URL;
  const apiKey = process.env.JALE_STATS_API_KEY;

  if (!url || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`[liveStats] HTTP ${response.status}`);
      return null;
    }

    const json = (await response.json()) as StatsApiResponse;
    if (!json.success || !json.data) {
      console.error("[liveStats] Geçersiz yanıt:", json.error);
      return null;
    }

    return json.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    console.error("[liveStats] İstek başarısız:", message);
    return null;
  }
}
