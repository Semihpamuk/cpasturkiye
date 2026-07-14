import "server-only";

/**
 * Jale panelinin kategori bazlı public stats endpoint'inden vaka verilerini çeker.
 *
 * SADECE SUNUCU TARAFINDA çalışır — API anahtarı tarayıcıya düşmez.
 * Env eksikse veya istek başarısızsa null döner; bu durumda vaka bölümü
 * statik örneklere düşer (site bozulmaz).
 *
 * Gerekli env:
 *   JALE_STATS_API_KEY        → Jale PUBLIC_STATS_API_KEY ile aynı
 *   JALE_CATEGORY_STATS_URL   → (opsiyonel) tam URL. Verilmezse JALE_STATS_URL'den
 *                               ".../stats" → ".../category-stats" olarak türetilir.
 */

import type { CategoryStatsPayload } from "@/types/categoryStats";

export type { CategoryStat, CategoryStatsPayload } from "@/types/categoryStats";

interface ApiResponse {
  success: boolean;
  data?: CategoryStatsPayload;
  error?: string;
}

const REVALIDATE_SECONDS = 300; // 5 dk — Jale cache ile uyumlu

function resolveUrl(): string | null {
  const explicit = process.env.JALE_CATEGORY_STATS_URL;
  if (explicit) return explicit;
  const base = process.env.JALE_STATS_URL;
  if (!base) return null;
  // ".../api/public/stats" → ".../api/public/category-stats"
  return base.replace(/\/stats(\/?$|\?)/, "/category-stats$1");
}

export async function getCategoryStats(): Promise<CategoryStatsPayload | null> {
  const url = resolveUrl();
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
      console.error(`[categoryStats] HTTP ${response.status}`);
      return null;
    }

    const json = (await response.json()) as ApiResponse;
    if (!json.success || !json.data) {
      console.error("[categoryStats] Geçersiz yanıt:", json.error);
      return null;
    }

    return json.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    console.error("[categoryStats] İstek başarısız:", message);
    return null;
  }
}
