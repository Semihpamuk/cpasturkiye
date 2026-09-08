import { createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { SITE } from "@/lib/site";

/**
 * Meta Conversions API — sunucu tarafı `Purchase` olayı gönderimi.
 *
 * ga-server.ts ile birebir aynı gerekçe: ödeme iyzico'da tamamlanıyor,
 * callback bir 303 redirect ile dönüyor ve müşteri çoğu zaman harici kurulum
 * portalına yönlendiriliyor — tarayıcıda güvenilir bir Purchase anı yok.
 * Reklam engelleyiciler ve Safari/ITP çerez kısıtlamaları da istemci tarafı
 * Pixel olaylarının bir kısmını düşürüyor; CAPI bu kaybı sunucudan telafi eder.
 *
 * Bu modüldeki hiçbir fonksiyon HATA FIRLATMAZ. Ödeme akışının içinden
 * çağrılıyorlar — analytics arızası müşteriyi asla etkilememeli.
 */

// NEXT_PUBLIC_META_PIXEL_ID build zamanında gömülür ve Docker build arg'ı
// unutulursa bu modülde de boş kalır (aynı ifade her yerde literal olarak
// değiştirilir, sunucu tarafı da dahil) — o yüzden GA_MEASUREMENT_ID'deki gibi
// ayrı bir runtime-only değişkene öncelik veriyoruz: META_PIXEL_ID unutulmazsa
// build arg unutulsa da sunucudan giden Purchase çalışmaya devam eder.
const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? "";
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE ?? "";
const GRAPH_VERSION = "v21.0";
const CAPI_TIMEOUT_MS = 4000;

export const isServerPixelEnabled = Boolean(PIXEL_ID && ACCESS_TOKEN);

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Meta'nın beklediği biçim: ülke koduyla birlikte yalnız rakam (örn. 905551234567). */
function normalizePhone(phone: string): string {
  const last10 = phone.replace(/\D/g, "").slice(-10);
  return `90${last10}`;
}

export interface MetaIdentity {
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Gelen isteğin `_fbp`/`_fbc` çerezlerini ve IP/User-Agent'ını okur.
 *
 * initialize/transfer route'larında, YANIT dönmeden önce çağrılmalı — iyzico
 * callback'i server-to-server geldiği için orada ziyaretçinin çerezi/IP'si
 * olmaz. Sonuç siparişe kaydedilip callback/admin onayında oradan okunur
 * (bkz. db.ts Order.fbp/fbc/clientIp/userAgent).
 */
export async function readMetaIdentity(): Promise<MetaIdentity> {
  try {
    const [store, h] = await Promise.all([cookies(), headers()]);
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      undefined;
    return {
      fbp: store.get("_fbp")?.value,
      fbc: store.get("_fbc")?.value,
      ip,
      userAgent: h.get("user-agent") ?? undefined,
    };
  } catch (err) {
    console.error("[meta-capi] identity okunamadı:", err);
    return {};
  }
}

export interface MetaPurchaseInput extends MetaIdentity {
  /** Sipariş kimliği — event_id olarak kullanılır (Meta yinelenen event_id'yi eler). */
  eventId: string;
  value: number;
  currency: string;
  email?: string;
  phone?: string;
}

/** Meta CAPI `Purchase` olayı. Ödeme kesinleştikten SONRA çağrılmalı. */
export async function sendMetaPurchase(input: MetaPurchaseInput): Promise<void> {
  if (!isServerPixelEnabled) return;

  // KVKK: `_fbp` yalnızca ziyaretçi çerez onayı verdiyse oluşur (Pixel script'i
  // Analytics.tsx'te `hasConsent` arkasında yüklenir). Onay yoksa `_fbp` de
  // yoktur — bu durumda CAPI'yi HİÇ göndermiyoruz. GA4'ün sunucu tarafı
  // purchase'ının aksine (orada sentetik bir client_id'ye düşülür, bkz.
  // ga-server.ts `gaIdentityFrom`), burada senkron fallback YOK: hashlenmiş
  // de olsa e-posta/telefon içeren bu olay reklam eşleştirmesi için kullanılır
  // ve rıza olmadan gönderilmesi Çerez Politikasındaki taahhütle çelişir.
  if (!input.fbp) return;

  // Eşleşme kalitesini artırmak için kimlik verileri SHA-256 ile hashlenir —
  // Meta'ya ham e-posta/telefon hiçbir zaman gönderilmez.
  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [sha256(normalizeEmail(input.email))];
  if (input.phone) userData.ph = [sha256(normalizePhone(input.phone))];
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.ip) userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: `${SITE.url}/satin-al`,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: input.currency,
          value: input.value,
        },
      },
    ],
  };
  // Yalnızca Events Manager → Test Events ile doğrulama yaparken kullanılır;
  // tanımlı değilse gönderilmez (canlı olayları test kuyruğuna düşürmemek için).
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CAPI_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[meta-capi] Purchase gönderilemedi: HTTP ${res.status} ${text}`);
    }
  } catch (err) {
    console.error("[meta-capi] Purchase gönderilemedi:", err);
  }
}
