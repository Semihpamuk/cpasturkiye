"use client";

/**
 * Meta (Facebook/Instagram) Pixel istemci tarafı katmanı.
 *
 * GA4 ile aynı rıza kapısının arkasında çalışır (bkz. components/Analytics.tsx):
 * ziyaretçi çerez rızası vermeden fbq hiç yüklenmez. Sitenin KVKK çerez metni
 * "reklam çerezi kullanmıyoruz" diyordu — pixel eklendiğinde Çerez Politikası
 * ve Gizlilik Politikası metinlerinin de güncellenmesi gerekir, bu dosya
 * yalnız kod tarafını kapsar.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/** PIXEL_ID tanımlı değilse (dev/preview) hiçbir şey yüklenmez. */
export const isPixelEnabled = META_PIXEL_ID.length > 0;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

/** Rota değişiminde PageView gönderir — init script yalnızca ilk yüklemeyi sayar. */
export function trackPixelPageView(): void {
  if (!isPixelEnabled) return;
  fbq("track", "PageView");
}
