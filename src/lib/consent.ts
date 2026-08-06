"use client";

/**
 * Çerez rızası (KVKK).
 *
 * Analitik çerezler "zorunlu çerez" sayılmaz — KVKK Kurulu'nun çerez rehberine
 * göre açık rıza gerektirir. Bu yüzden `analytics_storage` varsayılanı `denied`
 * ve `_ga` çerezleri ziyaretçi onay verene kadar oluşmaz.
 *
 * Tercih localStorage'da tutulur; gtag consent durumunu kendisi hatırlamaz,
 * her sayfa yüklemesinde biz vermek zorundayız. Bu okuma Analytics bileşenindeki
 * inline init script'in İÇİNDE, `consent default` çağrısından önce yapılır —
 * React efektiyle sonradan `update` çekmek yarış koşulu yaratır.
 */

export const CONSENT_STORAGE_KEY = "cpas_cookie_consent";

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

function setConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage yazılamıyorsa tercih kalıcı olmaz; gtag güncellemesi yine de geçerli.
  }
  window.gtag?.("consent", "update", { analytics_storage: value });
}

export function grantAnalyticsConsent(): void {
  setConsent("granted");
}

export function denyAnalyticsConsent(): void {
  setConsent("denied");
}
