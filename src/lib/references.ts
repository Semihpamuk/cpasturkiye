// Referans mağaza modeli — hem sunucu (db, API) hem istemci (useSettings, bar)
// tarafından kullanılır. Saf fonksiyonlar; fs veya React bağımlılığı yoktur.

export interface ReferenceItem {
  name: string;
  /** Mağazanın Trendyol vb. sayfası (isteğe bağlı) */
  url: string;
  /** Logo görseli: https URL, /public altındaki yol veya data:image (isteğe bağlı) */
  logo: string;
}

const MAX_NAME = 80;
const MAX_URL = 300;
const MAX_LOGO = 500;

/**
 * Logo kaynağını güvenli şemalarla sınırlar. Kabul edilmeyen değer boş döner,
 * bu durumda barda mağaza adı yazıyla gösterilir.
 */
export function safeLogoSrc(value: string): string {
  const src = value.trim();
  if (src.length === 0 || src.length > MAX_LOGO) return "";
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  if (/^https?:\/\/./i.test(src)) return src;
  if (/^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);/i.test(src)) return src;
  return "";
}

/** Ayarlardan gelen ham kaydı (eski format: düz string) normalize eder. */
export function normalizeReference(raw: unknown): ReferenceItem {
  if (typeof raw === "string") {
    return { name: raw.trim().slice(0, MAX_NAME), url: "", logo: "" };
  }
  const item = (raw ?? {}) as Partial<Record<keyof ReferenceItem, unknown>>;
  return {
    name: String(item.name ?? "").trim().slice(0, MAX_NAME),
    url: String(item.url ?? "").trim().slice(0, MAX_URL),
    logo: safeLogoSrc(String(item.logo ?? "")),
  };
}

/** Ham listeyi normalize eder, adsız kayıtları eler ve üst sınırı uygular. */
export function normalizeReferences(raw: unknown, limit = 50): ReferenceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeReference)
    .filter((item) => item.name.length > 0)
    .slice(0, limit);
}
