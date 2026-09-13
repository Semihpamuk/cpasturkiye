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
import { GTM_ID, isGtmEnabled } from "@/lib/gtm";
import { META_PIXEL_ID, isPixelEnabled, trackPixelPageView } from "@/lib/metaPixel";

/**
 * dataLayer kuyruğu + Google Consent Mode v2 varsayılanları.
 *
 * GA yapılandırmasından AYRI tutuluyor: GTM tek başına açıkken de (GA_ID boş)
 * dataLayer ve consent varsayılanı hazır olmalı — aksi halde GTM içindeki
 * etiketler varsayılan `denied` sinyalini hiç görmez ve rıza kapısı GTM
 * tarafında delinir.
 *
 * Tüm `ad_*` sinyalleri kapalı — Google'ın kendi reklam/hedefleme özelliklerini
 * kullanmıyoruz (Meta Pixel ayrı bir mekanizma, bkz. PIXEL_INIT_SCRIPT altında).
 * `analytics_storage` da varsayılan olarak `denied`: KVKK Kurulu'nun çerez
 * rehberi analitik çerezleri "zorunlu" saymıyor, açık rıza gerekiyor.
 *
 * gtag/gtm script'leri yalnızca rıza `granted` iken render edilir (aşağıdaki
 * bileşene bak) — rıza gelmeden Google'a çerezsiz ping dahil hiçbir istek
 * gitmez. Kayıtlı tercih yine de inline script'in İÇİNDE okunuyor: mount ile
 * script'in çalışması arasında tercih değişirse son durum geçerli olsun.
 */
const CONSENT_BOOTSTRAP_SCRIPT = `
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
`;

/**
 * GA4 yapılandırması. CONSENT_BOOTSTRAP_SCRIPT'ten SONRA çalışmalı —
 * `window.gtag` oradan geliyor.
 */
const GA_CONFIG_SCRIPT = `
window.gtag('js', new Date());
window.gtag('config', '${GA_ID}', { send_page_view: true });
`;

/**
 * Google Tag Manager kapsayıcısı — resmi snippet.
 *
 * GA4 ve Meta Pixel bu dosyada doğrudan yükleniyor; aynı etiketleri GTM
 * arayüzüne DE eklemeyin (çift sayım olur). Kapsayıcı yalnızca yeni üçüncü
 * taraf etiketleri (Google Ads, LinkedIn, Hotjar…) içindir.
 *
 * Resmi snippet'in `<noscript><iframe>` parçası BİLEREK yok: JS kapalıyken
 * etiketler zaten çalışamaz, ama iframe rıza kapısını atlayıp Google'a istek
 * atardı (KVKK).
 */
const GTM_INIT_SCRIPT = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
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
    // GA_CONFIG_SCRIPT'teki `config` çağrısı rıza verilmiş durumda atar.
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if ((!isAnalyticsEnabled && !isPixelEnabled && !isGtmEnabled) || isExcluded) {
    return null;
  }

  return (
    <>
      {/* Rıza gelmeden gtag/gtm/fbq hiç yüklenmez — üçüncü tarafa sıfır istek
          (KVKK). Aynı oturumda geri alınırsa script bellekte kalır ama
          consent.ts'in `denied` güncellemesi ölçümü durdurur; sonraki sayfa
          yüklemesinde script zaten hiç yüklenmez. */}
      {hasConsent && (
        <>
          {/* Sıra önemli: kuyruk (dataLayer) ve consent varsayılanı, gtag.js ya
              da gtm.js yüklenmeden önce hazır olmalı. */}
          {(isAnalyticsEnabled || isGtmEnabled) && (
            <Script
              id="consent-bootstrap"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP_SCRIPT }}
            />
          )}
          {isAnalyticsEnabled && (
            <>
              <Script
                id="ga-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: GA_CONFIG_SCRIPT }}
              />
              <Script
                id="ga-lib"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
            </>
          )}
          {isGtmEnabled && (
            <Script
              id="gtm-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: GTM_INIT_SCRIPT }}
            />
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
