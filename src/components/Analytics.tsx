"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, isAnalyticsEnabled, trackPageView } from "@/lib/analytics";

/**
 * Google Consent Mode v2 varsayılanları.
 *
 * KVKK gereği reklam amaçlı çerezler açık rıza olmadan çalışmamalı; ölçüm
 * çerezi meşru menfaat kapsamında açık bırakılıyor. Sitede çerez izin bandı
 * eklendiğinde `ad_*` değerleri kullanıcı onayıyla `granted`a çekilmelidir
 * (gtag("consent", "update", {...})).
 */
const CONSENT_DEFAULTS = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "granted",
} as const;

const INIT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${JSON.stringify(CONSENT_DEFAULTS)});
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: true });
`;

/**
 * Rota değişiminde page_view gönderir.
 *
 * İlk yüklemede `config` zaten bir page_view atıyor — ilk efekt çalışması
 * atlanmazsa ana sayfa iki kez sayılır.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    trackPageView(pathname);
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
    </>
  );
}
