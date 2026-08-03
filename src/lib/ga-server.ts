import { cookies } from "next/headers";

/**
 * GA4 Measurement Protocol — sunucu tarafı olay gönderimi.
 *
 * Neden gerekli: ödeme iyzico'da tamamlanıyor, callback bir 303 redirect ile
 * dönüyor ve müşteri çoğu zaman harici kurulum portalına gidiyor. Tarayıcıda
 * `purchase` ateşleyecek güvenilir bir an yok. Ayrıca reklam engelleyiciler
 * istemci olaylarının bir kısmını düşürüyor; ciro verisi bundan etkilenmemeli.
 *
 * Bu modüldeki hiçbir fonksiyon HATA FIRLATMAZ. Ödeme akışının içinden
 * çağrılıyorlar — analytics arızası müşteriyi asla etkilememeli.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const GA_API_SECRET = process.env.GA_API_SECRET ?? "";
const MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const MP_TIMEOUT_MS = 4000;

export const isServerAnalyticsEnabled = Boolean(GA_ID && GA_API_SECRET);

export interface GaIdentity {
  clientId: string;
  sessionId?: string;
  /** Cookie okunamadığında üretilmiş kimlik mi — GA4'te ayırt edebilmek için. */
  isFallback: boolean;
}

/**
 * `_ga` cookie formatı: `GA1.1.1234567890.1700000000`
 * client_id = son iki segment: `1234567890.1700000000`
 */
export function parseGaCookie(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length < 4) return null;
  const clientId = `${parts[2]}.${parts[3]}`;
  return /^\d+\.\d+$/.test(clientId) ? clientId : null;
}

/**
 * `_ga_<SUFFIX>` cookie formatı: `GS1.1.<session_id>.<session_number>...`
 * session_id = 3. segment.
 */
export function parseGaSessionCookie(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length < 3) return null;
  return /^\d+$/.test(parts[2]) ? parts[2] : null;
}

/** `G-ABC123` → `_ga_ABC123` */
function sessionCookieName(): string | null {
  const suffix = GA_ID.replace(/^G-/, "");
  return suffix && suffix !== GA_ID ? `_ga_${suffix}` : null;
}

export interface StoredGaIds {
  gaClientId?: string;
  gaSessionId?: string;
}

/**
 * Gelen isteğin cookie'lerinden GA kimliğini okur. Cookie yoksa `null` döner —
 * sipariş kaydına uydurma kimlik yazmamak için bilinçli olarak burada fallback
 * üretilmez.
 */
export async function readGaCookies(): Promise<StoredGaIds | null> {
  try {
    const store = await cookies();
    const clientId = parseGaCookie(store.get("_ga")?.value);
    if (!clientId) return null;

    const sessionCookie = sessionCookieName();
    const sessionId = sessionCookie
      ? parseGaSessionCookie(store.get(sessionCookie)?.value)
      : null;

    return { gaClientId: clientId, gaSessionId: sessionId ?? undefined };
  } catch (err) {
    console.error("[ga-server] cookie okunamadı:", err);
    return null;
  }
}

/**
 * Siparişte saklanan GA kimliğini olay gönderimi için kimliğe çevirir.
 *
 * Kimlik yoksa (reklam engelleyici, çerez reddi, GA henüz yüklenmemiş) sipariş
 * anahtarından türetilmiş bir yedek client_id üretilir. Gerekçe: az sayıda ama
 * yüksek tutarlı sipariş alan bir işte, ciroyu hiç görmemek kullanıcı sayısının
 * bir miktar şişmesinden daha kötü. Yedek kimlikler `ga_identity: "fallback"`
 * parametresiyle işaretlenir, GA4'te filtrelenebilir.
 */
export function gaIdentityFrom(
  stored: StoredGaIds | null | undefined,
  fallbackKey: string
): GaIdentity {
  if (stored?.gaClientId) {
    return {
      clientId: stored.gaClientId,
      sessionId: stored.gaSessionId,
      isFallback: false,
    };
  }
  return { clientId: buildFallbackClientId(fallbackKey), isFallback: true };
}

function buildFallbackClientId(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return `${hash}.${Math.floor(Date.now() / 1000)}`;
}

export interface GaServerEvent {
  name: string;
  params: Record<string, unknown>;
}

/** Tek bir olayı Measurement Protocol ile gönderir. Asla throw etmez. */
export async function sendGaServerEvent(
  identity: GaIdentity,
  event: GaServerEvent
): Promise<void> {
  if (!isServerAnalyticsEnabled) return;

  const url = `${MP_ENDPOINT}?measurement_id=${encodeURIComponent(
    GA_ID
  )}&api_secret=${encodeURIComponent(GA_API_SECRET)}`;

  const payload = {
    client_id: identity.clientId,
    events: [
      {
        name: event.name,
        params: {
          ...event.params,
          // session_id olmadan olay mevcut oturuma bağlanmaz ve trafik
          // kaynağı (organic/paid) kaybolur.
          session_id: identity.sessionId,
          // GA4 bu parametre olmadan olayı "engagement"a saymaz.
          engagement_time_msec: 1,
          ga_identity: identity.isFallback ? "fallback" : "cookie",
        },
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(MP_TIMEOUT_MS),
    });
    // MP başarılı isteklerde 204 döner; gövde yok.
    if (!res.ok) {
      console.error(
        `[ga-server] ${event.name} gönderilemedi: HTTP ${res.status}`
      );
    }
  } catch (err) {
    console.error(`[ga-server] ${event.name} gönderilemedi:`, err);
  }
}

export interface GaPurchaseInput {
  /** GA4'te işlem kimliği — aynı id tekrar gönderilirse GA4 yinelemeyi eler. */
  transactionId: string;
  /** Ödenen KDV DAHİL tutar. */
  total: number;
  vatAmount: number;
  discountAmount: number;
  discountCode: string | null;
  marketplaces: string[];
  setupNet: number;
  managementAddon: number;
  paymentMethod: "card" | "transfer";
}

function purchaseItems(input: GaPurchaseInput) {
  const variant = [...input.marketplaces].sort().join("+") || "belirsiz";

  const items = [
    {
      item_id: "setup-package",
      item_name: "CPAS Kurulum + İlk Ay Yönetim",
      item_category: "kurulum",
      item_variant: variant,
      price: input.setupNet,
      quantity: 1,
    },
  ];

  if (input.managementAddon > 0) {
    items.push({
      item_id: "management-addon",
      item_name: "Devam Ayı Yönetim (peşin)",
      item_category: "yonetim",
      item_variant: variant,
      price: input.managementAddon,
      quantity: 1,
    });
  }

  return items;
}

/** GA4 `purchase` olayı. Ödeme kesinleştikten SONRA çağrılmalı. */
export async function sendGaPurchase(
  identity: GaIdentity,
  input: GaPurchaseInput
): Promise<void> {
  await sendGaServerEvent(identity, {
    name: "purchase",
    params: {
      currency: "TRY",
      transaction_id: input.transactionId,
      value: input.total,
      tax: input.vatAmount,
      shipping: 0,
      coupon: input.discountCode || undefined,
      payment_type: input.paymentMethod === "card" ? "kart" : "havale",
      marketplace_count: input.marketplaces.length,
      discount_amount: input.discountAmount,
      items: purchaseItems(input),
    },
  });
}
