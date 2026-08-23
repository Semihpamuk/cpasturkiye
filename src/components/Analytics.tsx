"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { GA_ID, isAnalyticsEnabled, trackPageView } from "@/lib/analytics";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  readStoredConsent,
} from "@/lib/consent";

/**
 * Google Consent Mode v2 varsayılanları.
 *
 * Tüm `ad_*` sinyalleri kapalı — reklam çerezi hiç kullanmıyoruz.
 * `analytics_storage` da varsayılan olarak `denied`: KVKK Kurulu'nun çerez
 * rehberi analitik çerezleri "zorunlu" saymıyor, açık rıza gerekiyor.
 *
 * gtag script'leri yalnızca rıza `granted` iken render edilir (aşağıdaki
 * bileşene bak) — rıza gelmeden Google'a çerezsiz ping dahil hiçbir istek
 * gitmez. Kayıtlı tercih yine de inline script'in İÇİNDE okunuyor: mount ile
 * script'in çalışması arasında tercih değişirse son durum geçerli olsun.
 */
const INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var __cpasConsent = null;
try { __cpasConsent = localStorage.getItem(${JSON.stringify(
  CONSENT_STORAGE_KEY
)}); } catch (e) {}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: __cpasConsent === 'granted' ? 'granted' : 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: true });
`;

/**
 * Son ölçülen yol — MODÜL seviyesinde tutuluyor.
 *
 * Bileşen /admin'de unmount olduğu için ref kullanılsaydı her dönüşte sıfırlanır
 * ve kullanıcı panelden siteye döndüğünde ilk sayfa hiç sayılmazdı.
 *
 * null = ilk `config` çağrısı zaten bir page_view attı; onu tekrarlama.
 */
let lastTrackedPath: string | null = null;

/** Rota değişiminde page_view gönderir. */
function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (lastTrackedPath === null) {
      lastTrackedPath = pathname;
      return;
    }
    if (lastTrackedPath === pathname) return;
    lastTrackedPath = pathname;
    trackPageView();
  }, [pathname]);

  return null;
}

/** Admin paneli ölçüme dahil edilmez — kendi trafiğimiz veriyi kirletmesin. */
const EXCLUDED_PREFIXES = ["/admin"];

export default function Analytics() {
  const pathname = usePathname();
  // false = rıza yok ya da henüz okumadık (SSR/ilk render). localStorage
  // yalnızca efekt içinde okunur ki hydration uyuşmazlığı olmasın.
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const sync = () => setHasConsent(readStoredConsent() === "granted");
    sync();
    // Banddan onay gelince script'ler burada mount olur; ilk page_view'ı
    // INIT_SCRIPT'teki `config` çağrısı rıza verilmiş durumda atar.
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAnalyticsEnabled || isExcluded) return null;

  return (
    <>
      {/* Rıza gelmeden gtag hiç yüklenmez — Google'a sıfır istek (KVKK).
          Aynı oturumda geri alınırsa script bellekte kalır ama consent.ts'in
          `denied` güncellemesi ölçümü durdurur; sonraki sayfa yüklemesinde
          script zaten hiç yüklenmez. */}
      {hasConsent && (
        <>
          {/* Sıra önemli: kuyruk (dataLayer) gtag.js yüklenmeden önce hazır olmalı. */}
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }}
          />
          <Script
            id="ga-lib"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <PageViewTracker />
        </>
      )}
      {/* Band yalnızca ölçüm açıkken ve /admin dışında — üstteki guard'ın altında. */}
      <CookieConsentBanner />
    </>
  );
}
