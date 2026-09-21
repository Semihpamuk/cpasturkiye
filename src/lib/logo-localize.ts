import { generateId, saveLogo } from "./db";
import { LOGO_MIME_EXT, MAX_LOGO_BYTES, logoPathFor, type ReferenceItem } from "./references";

// Panelden adres olarak yapıştırılmış uzak logoları (ör. Trendyol'un
// cdn.dsmcdn.com'u) sunucuya kopyalar. Neden: hotlink her ziyarette dış istek
// + üçüncü taraf çerezi (Lighthouse uyarısı) demek; kaynak site görseli
// değiştirir/silerse şerit bozulur. Yerel kopya data/logos'ta (kalıcı disk,
// yedeğe dahil) durur.

const FETCH_TIMEOUT_MS = 10_000;

export interface LocalizeResult {
  localized: string[];
  skipped: string[];
  failed: { name: string; reason: string }[];
  references: ReferenceItem[];
}

/** Sunucunun keyfi adrese istek atmasını sınırlar: yalnızca https, IP/yerel ad değil. */
export function isFetchableLogoUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return false; // IPv4/IPv6 literal
  return true;
}

export type LogoFetcher = (url: string) => Promise<{ data: Buffer; ext: string }>;

async function fetchLogo(url: string): Promise<{ data: Buffer; ext: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const ext = LOGO_MIME_EXT[type];
    if (!ext) throw new Error(`desteklenmeyen içerik tipi: ${type || "bilinmiyor"}`);
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > MAX_LOGO_BYTES) throw new Error("2 MB üstü");
    const data = Buffer.from(await res.arrayBuffer());
    if (data.byteLength === 0) throw new Error("boş yanıt");
    if (data.byteLength > MAX_LOGO_BYTES) throw new Error("2 MB üstü");
    return { data, ext };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Uzak logolu referansları indirip yerel yola çevirir; diğerleri olduğu gibi
 * kalır. Hata alan referansın logosu DEĞİŞTİRİLMEZ (şerit bozulmasın).
 */
export async function localizeReferenceLogos(
  references: ReferenceItem[],
  fetchImpl: LogoFetcher = fetchLogo,
  store: (name: string, data: Buffer) => Promise<void> = saveLogo
): Promise<LocalizeResult> {
  const result: LocalizeResult = { localized: [], skipped: [], failed: [], references: [] };
  for (const ref of references) {
    if (!/^https?:\/\//i.test(ref.logo)) {
      result.skipped.push(ref.name);
      result.references.push(ref);
      continue;
    }
    if (!isFetchableLogoUrl(ref.logo)) {
      result.failed.push({ name: ref.name, reason: "yalnızca https ve alan adı kabul edilir" });
      result.references.push(ref);
      continue;
    }
    try {
      const { data, ext } = await fetchImpl(ref.logo);
      const storedName = `${generateId()}.${ext}`;
      await store(storedName, data);
      result.localized.push(ref.name);
      result.references.push({ ...ref, logo: logoPathFor(storedName) });
    } catch (err) {
      result.failed.push({ name: ref.name, reason: err instanceof Error ? err.message : String(err) });
      result.references.push(ref);
    }
  }
  return result;
}
