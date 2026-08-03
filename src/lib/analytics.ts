"use client";

/**
 * GA4 istemci tarafı olay katmanı.
 *
 * `purchase` olayı BİLEREK burada yok. Ödeme iyzico tarafında tamamlanıyor ve
 * müşteri callback'ten sonra harici kurulum portalına yönlendirilebiliyor —
 * yani tarayıcıda purchase'ı ateşleyecek güvenilir bir an yok. Satın alma
 * olayı sunucudan, Measurement Protocol ile gönderilir (bkz. lib/ga-server.ts).
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** GA_ID tanımlı değilse (dev/preview) hiçbir şey gönderilmez. */
export const isAnalyticsEnabled = GA_ID.length > 0;

export const GA_CURRENCY = "TRY";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface GaItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant: string;
  price: number;
  quantity: number;
}

export interface CheckoutItemsInput {
  marketplaces: string[];
  /** Kurulum toplamı (KDV hariç net, 2. pazaryeri indirimi dahil). */
  setupNet: number;
  /** Devam ayı eklentisi — seçilmediyse 0. */
  managementAddon: number;
}

/**
 * Sepet kalemlerini üretir. Pazaryeri kombinasyonu `item_variant` olarak
 * taşınır; GA4'te "hangi pazaryeri ikilisi daha çok satıyor" böyle kırılır.
 */
export function buildCheckoutItems(input: CheckoutItemsInput): GaItem[] {
  const variant = [...input.marketplaces].sort().join("+") || "belirsiz";

  const items: GaItem[] = [
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

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  if (!isAnalyticsEnabled) return;
  gtag("event", name, params);
}

export function trackPageView(path: string): void {
  if (!isAnalyticsEnabled || typeof window === "undefined") return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/* ───────────────────────── Checkout funnel ───────────────────────── */

export interface CheckoutEventInput extends CheckoutItemsInput {
  /** Ödenecek KDV dahil tutar. */
  total: number;
  discountCode?: string | null;
}

function checkoutParams(input: CheckoutEventInput): Record<string, unknown> {
  return {
    currency: GA_CURRENCY,
    value: input.total,
    coupon: input.discountCode || undefined,
    marketplace_count: input.marketplaces.length,
    items: buildCheckoutItems(input),
  };
}

/** Checkout sayfası açıldı — teklif ekranı görüntülendi. */
export function trackViewCheckout(input: CheckoutEventInput): void {
  trackEvent("view_item", checkoutParams(input));
}

/** Müşteri formu doldurup ödeme adımına geçti. */
export function trackBeginCheckout(input: CheckoutEventInput): void {
  trackEvent("begin_checkout", checkoutParams(input));
}

/** Ödeme yöntemi seçildi (kart / havale). */
export function trackAddPaymentInfo(
  input: CheckoutEventInput,
  paymentMethod: "card" | "transfer"
): void {
  trackEvent("add_payment_info", {
    ...checkoutParams(input),
    payment_type: paymentMethod === "card" ? "kart" : "havale",
  });
}

/** İndirim kodu doğrulandı. */
export function trackDiscountApplied(code: string): void {
  trackEvent("select_promotion", { promotion_name: code });
}

/** Ödeme başarısız döndü — purchase değil, ayrı bir teşhis olayı. */
export function trackPaymentFailed(reason: string): void {
  trackEvent("payment_failed", { failure_reason: reason });
}
