"use client";

import { isAnalyticsEnabled } from "@/lib/analytics";
import { reopenConsentBanner } from "@/lib/consent";

/**
 * Footer'ın "Yasal" listesindeki çerez tercihi bağlantısı.
 *
 * Rızanın geri alınması, verilmesi kadar kolay olmak zorunda (KVKK); tıklandığında
 * kayıtlı tercih sıfırlanır, ölçüm durur ve onay bandı tekrar açılır.
 *
 * Listenin bir parçası olduğu için `li` etiketini kendisi render eder: ölçüm
 * kapalıyken hiçbir şey basmayıp `space-y` boşluğu bırakmaması gerekiyor.
 */
export default function CookieSettingsLink() {
  // GA_ID tanımlı değilse band hiç mount edilmez — tıklanınca hiçbir şey olmayan
  // bir bağlantı göstermektense bağlantıyı hiç gösterme.
  if (!isAnalyticsEnabled) return null;

  return (
    <li>
      <button
        type="button"
        onClick={reopenConsentBanner}
        className="text-left text-sm text-ink-500 transition-colors hover:text-brand-700"
      >
        Çerez Tercihleri
      </button>
    </li>
  );
}
