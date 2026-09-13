"use client";

/**
 * Google Tag Manager kapsayıcısı.
 *
 * GTM burada YALNIZCA kapsayıcı olarak yüklenir. GA4 ve Meta Pixel etiketleri
 * kodun içinde duruyor (bkz. components/Analytics.tsx) — aynı etiketleri GTM
 * arayüzüne DE eklemek çift sayıma yol açar. GTM, ileride eklenecek üçüncü
 * taraf etiketleri (Google Ads, LinkedIn, Hotjar…) için ayrılmıştır.
 *
 * GA_ID / META_PIXEL_ID ile aynı kalıp: değer boşsa gtm.js hiç yüklenmez,
 * böylece dev/preview ortamı prod verisini kirletmez.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

/** GTM_ID tanımlı değilse (dev/preview) kapsayıcı hiç yüklenmez. */
export const isGtmEnabled = GTM_ID.length > 0;
