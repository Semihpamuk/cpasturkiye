"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { GA_ID, isAnalyticsEnabled, trackPageView } from "@/lib/analytics";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

/**
 * Google Consent Mode v2 varsayılanları.
 *
 * Tüm `ad_*` sinyalleri kapalı — reklam çerezi hiç kullanmıyoruz.
 * `analytics_storage` da varsayılan olarak `denied`: KVKK Kurulu'nun çerez
 * rehberi analitik çerezleri "zorunlu" saymıyor, açık rıza gerekiyor.
 *
 * Kayıtlı tercih inline script'in İÇİNDE okunuyor: gtag consent durumunu
 * hatırlamaz, her sayfa yüklemesinde biz vermek zorundayız. React efektiyle
 * sonradan `update` çekmek, ilk olaylar gönderildikten sonraya kalabileceği
 * için yarış koşulu yaratır.
 *
 * `wait_for_update`, band'dan gelen onayın ilk olayları yakalayabilmesi için
 * gtag'e kısa bir bekleme süresi tanır.
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
  const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAnalyticsEnabled || isExcluded) return null;

  return (
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
      {/* Band yalnızca ölçüm açıkken ve /admin dışında — üstteki guard'ın altında. */}
      <CookieConsentBanner />
    </>
  );
}
