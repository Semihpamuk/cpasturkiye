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
import { META_PIXEL_ID, isPixelEnabled, trackPixelPageView } from "@/lib/metaPixel";

/**
 * Google Consent Mode v2 varsayılanları.
 *
 * Tüm `ad_*` sinyalleri kapalı — Google'ın kendi reklam/hedefleme özelliklerini
 * kullanmıyoruz (Meta Pixel ayrı bir mekanizma, bkz. PIXEL_INIT_SCRIPT altında).
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
 * Meta Pixel init script — resmi fbevents.js snippet'inin aynısı.
 *
 * GA'nın aksine kendi "Consent Mode"u yok; bu yüzden script'in kendisi de
 * (aşağıdaki <Script> gibi) yalnızca `hasConsent` true iken render edilir.
 * Rıza yokken fbq tanımlı bile olmaz — kısmi/varsayılan init yerine script
 * bütünüyle DOM'a hiç girmez.
 */
const PIXEL_INIT_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
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
    trackPixelPageView();
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

  if ((!isAnalyticsEnabled && !isPixelEnabled) || isExcluded) return null;

  return (
    <>
      {/* Rıza gelmeden gtag/fbq hiç yüklenmez — üçüncü tarafa sıfır istek (KVKK).
          Aynı oturumda geri alınırsa script bellekte kalır ama consent.ts'in
          `denied` güncellemesi ölçümü durdurur; sonraki sayfa yüklemesinde
          script zaten hiç yüklenmez. */}
      {hasConsent && (
        <>
          {isAnalyticsEnabled && (
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
            </>
          )}
          {isPixelEnabled && (
            <>
              <Script
                id="meta-pixel-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: PIXEL_INIT_SCRIPT }}
              />
              {/* noscript fallback: JS kapalıyken bile PageView sayılabilsin diye
                  Meta'nın resmi snippet'i böyle önerir. Rıza yoksa bu blok hiç
                  render edilmiyor (üstteki hasConsent guard'ı). */}
              <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  height="1"
                  width="1"
                  alt=""
                  style={{ display: "none" }}
                  src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                />
              </noscript>
            </>
          )}
          <PageViewTracker />
        </>
      )}
      {/* Band yalnızca ölçüm açıkken ve /admin dışında — üstteki guard'ın altında. */}
      <CookieConsentBanner />
    </>
  );
}
