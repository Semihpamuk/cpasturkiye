"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  readStoredConsent,
} from "@/lib/consent";

/**
 * Analitik çerez onay bandı.
 *
 * Yalnızca ziyaretçi henüz karar vermemişse görünür. Karar localStorage'da
 * saklanır; sonraki ziyaretlerde band çıkmaz ve tercih init script tarafından
 * `consent default` anında uygulanır (bkz. lib/consent.ts).
 *
 * Zorunlu çerezler bu bandın kapsamı dışında — onlar rıza gerektirmiyor.
 */
export default function CookieConsentBanner() {
  // null = henüz okumadık (SSR/ilk render). Hydration uyuşmazlığı olmasın diye
  // localStorage yalnızca efekt içinde okunur.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Olay artık her tercih değişiminde yayınlanıyor (onay/ret dahil); band
    // yalnızca ortada karar yokken görünmeli, o yüzden koşulsuz açmak yerine
    // kayıtlı tercihe bakılır.
    const sync = () => setIsVisible(readStoredConsent() === null);
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!isVisible) return null;

  function accept() {
    grantAnalyticsConsent();
    setIsVisible(false);
  }

  function reject() {
    denyAnalyticsConsent();
    setIsVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez tercihi"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-ink-950/95 p-5 text-white shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <p className="flex-1 text-sm leading-relaxed text-white/80">
          Sitenin çalışması için gerekli zorunlu çerezleri kullanıyoruz. Ziyaret
          istatistiklerini ölçmek için kullanılan analitik çerezler ise yalnızca
          onayınızla çalışır; dilerseniz{" "}
          <button
            type="button"
            onClick={reject}
            className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-brand-300"
          >
            reddedebilirsiniz
          </button>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <Link
            href="/cerez-politikasi"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Çerez Politikası
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-brand-800"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
