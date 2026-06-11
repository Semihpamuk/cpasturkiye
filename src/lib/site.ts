export const SITE = {
  name: "Jale",
  domain: "cpasturkiye.com",
  url: "https://cpasturkiye.com",
  slogan: "Trendyol reklamlarını Meta'dan yönet.",
  description:
    "Türkiye'nin ilk Trendyol–Meta CPAS reklam yönetim platformu. Trendyol mağazanı Meta'ya bağla, reklamlarını tek panelden yönet, gerçek satış verisiyle büyü.",
  email: "info@cpasturkiye.com",
  phone: "+90 (XXX) XXX XX XX",
  address: "İstanbul, Türkiye",
  company: "Jale Yazılım ve Reklam Hizmetleri",
};

export const PRICING = {
  yearlyDiscount: 0.2,
  starter: 5000,
  extraStore: 3000,
  agencyPerStore: 4000,
  agencyContactThreshold: 7,
  setupFee: 25000,
  setupDays: 7,
};

export const VAT_RATE = 0.2;

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface OrderInput {
  isAgency: boolean;
  storeCount: number;
  billing: "monthly" | "yearly";
  discount?: { type: "percent" | "fixed"; value: number } | null;
  includeSetup?: boolean; // Online ödemede kurulum dahil EDİLMEZ (varsayılan false)
}

export interface OrderQuote {
  monthlySubscription: number;
  subscriptionNet: number; // ilk ödeme dönemi (aylıkta 1 ay, yıllıkta 12 ay indirimli)
  setupNet: number; // ayrıca tahsil edilen kurulum bedeli (toplama dahil değil)
  discountAmount: number;
  netAfterDiscount: number;
  vatAmount: number;
  total: number;
  requiresContact: boolean;
}

export interface PricingValues {
  starter: number;
  extraStore: number;
  agencyPerStore: number;
  agencyContactThreshold: number;
  setupFee: number;
  yearlyDiscount: number;
}

export function computeMonthlySubscription(
  isAgency: boolean,
  storeCount: number,
  pricing: PricingValues = PRICING
): number {
  if (isAgency) return pricing.agencyPerStore * storeCount;
  if (storeCount <= 1) return pricing.starter;
  return pricing.starter + pricing.extraStore * (storeCount - 1);
}

export function computeOrderQuote(
  input: OrderInput,
  pricing: PricingValues = PRICING
): OrderQuote {
  const requiresContact =
    input.isAgency && input.storeCount >= pricing.agencyContactThreshold;

  const monthlySubscription = computeMonthlySubscription(
    input.isAgency,
    input.storeCount,
    pricing
  );

  const subscriptionNet =
    input.billing === "yearly"
      ? Math.round(monthlySubscription * 12 * (1 - pricing.yearlyDiscount))
      : monthlySubscription;

  // Kurulum: müşteri isterse siparişe dahil edilir, istemezse ayrıca tahsil edilir.
  const setupNet = pricing.setupFee;
  const includeSetup = input.includeSetup ?? false;
  const subtotal = subscriptionNet + (includeSetup ? setupNet : 0);

  let discountAmount = 0;
  if (input.discount) {
    discountAmount =
      input.discount.type === "percent"
        ? Math.round(subtotal * (input.discount.value / 100))
        : Math.min(input.discount.value, subtotal);
  }

  const netAfterDiscount = subtotal - discountAmount;
  const vatAmount = Math.round(netAfterDiscount * VAT_RATE);

  return {
    monthlySubscription,
    subscriptionNet,
    setupNet,
    discountAmount,
    netAfterDiscount,
    vatAmount,
    total: netAfterDiscount + vatAmount,
    requiresContact,
  };
}
