"use client";

/**
 * Çerez rızası (KVKK).
 *
 * Analitik ve reklam çerezleri "zorunlu çerez" sayılmaz — KVKK Kurulu'nun çerez
 * rehberine göre açık rıza gerektirir. Bu yüzden dört Consent Mode sinyalinin de
 * varsayılanı `denied`; `_ga`, `_gcl_au` ve `_fbp` çerezleri ziyaretçi onay
 * verene kadar oluşmaz.
 *
 * Tercih localStorage'da tutulur; gtag consent durumunu kendisi hatırlamaz,
 * her sayfa yüklemesinde biz vermek zorundayız. Bu okuma Analytics bileşenindeki
 * inline init script'in İÇİNDE, `consent default` çağrısından önce yapılır —
 * React efektiyle sonradan `update` çekmek yarış koşulu yaratır.
 */

export const CONSENT_STORAGE_KEY = "cpas_cookie_consent";

/**
 * Tercih her değiştiğinde (onay, ret, sıfırlama) yayınlanır.
 *
 * İki dinleyicisi var: band görünürlüğünü tazeler, Analytics bileşeni gtag
 * script'lerini yükleyip yüklemeyeceğine karar verir. Farklı ağaçlarda duran
 * bu parçalar için araya context/store koymak yerine tek yönlü bir pencere
 * olayı yeterli.
 */
export const CONSENT_CHANGED_EVENT = "cpas:consent-changed";

export type ConsentValue = "granted" | "denied";

/** Kayıtlı tercih; hiç karar verilmemişse null (band gösterilir). */
export function readStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw === "granted" || raw === "denied" ? raw : null;
  } catch {
    // Private mode / storage kapalı — kararsız kabul et, band gösterilir.
    return null;
  }
}

/**
 * Consent Mode v2'nin dört sinyali de tek onaya bağlı — bant tek bir "Kabul et"
 * sunuyor ve Çerez Politikası da analitik ile reklam çerezlerini tek onayla
 * tarif ediyor. Reklam sinyalleri Google Ads yeniden pazarlama ve dönüşüm
 * ölçümü için gerekli; eksik bırakılırsa etiketler sessizce ölçüm yapamaz.
 *
 * Analytics.tsx'teki `consent default` çağrısı bu listenin aynısını basar —
 * ikisi birlikte değişmeli.
 */
function consentSignals(value: ConsentValue): Record<string, ConsentValue> {
  return {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  };
}

function setConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage yazılamıyorsa tercih kalıcı olmaz; gtag güncellemesi yine de geçerli.
  }
  window.gtag?.("consent", "update", consentSignals(value));
  // Analytics bileşeni bu olaya bakarak gtag script'lerini yükler/kaldırır.
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}

export function grantAnalyticsConsent(): void {
  setConsent("granted");
}

export function denyAnalyticsConsent(): void {
  setConsent("denied");
}

/**
 * Tercihi sıfırlar ve bandı tekrar gösterir.
 *
 * KVKK'da açık rızanın geri alınması, verilmesi kadar kolay olmak zorunda —
 * ziyaretçiyi "tarayıcı ayarlarından site verilerini temizle" adımına yollamak
 * bu ölçütü karşılamıyor. Footer'daki "Çerez Tercihleri" bağlantısı buraya bağlı.
 *
 * Halihazırda yazılmış `_ga`/`_gcl_au` çerezleri BİLEREK silinmiyor: Consent Mode yeni
 * çerez yazılmasını ve mevcutların okunmasını engeller, ziyaretçi tekrar onay
 * verirse de aynı tanımlayıcıyla devam eder. Çerezleri tarayıcı ayarlarından
 * silme yolu Çerez Politikasında ayrıca tarif ediliyor.
 */
export function reopenConsentBanner(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage kapalıysa tercih zaten kalıcı değildi.
  }
  // Yeni karar alınana kadar ölçüm durmalı.
  window.gtag?.("consent", "update", consentSignals("denied"));
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}
