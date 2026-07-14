export const SITE = {
  name: "CPAS Türkiye",
  domain: "cpasturkiye.com",
  url: "https://cpasturkiye.com",
  slogan: "Pazaryeri reklamlarınızı Meta'da biz yönetiyoruz.",
  description:
    "Trendyol, Hepsiburada ve Amazon mağazanız için Meta CPAS reklamlarını uçtan uca kuruyor ve yönetiyoruz. Profesyonel kurulum, haftalık optimizasyon, gerçek satış verisiyle raporlama.",
  email: "info@cpasturkiye.com",
  // Gerçek telefon numarasını .env.local veya aşağıdan güncelleyin
  phone: process.env.NEXT_PUBLIC_SITE_PHONE ?? "+90 (212) 000 00 00",
  address:
    "Balmumcu Mah. Gazi Umur Paşa Sk. İBA Blokları Sitesi No:19/2 Beşiktaş / İstanbul",
  company: "Brother Hustle Danışmanlık ve Tic. Ltd. Şti.",
  // iyzico başvurusu ve yasal uyumluluk için gerekli şirket bilgileri
  mersis: process.env.NEXT_PUBLIC_SITE_MERSIS ?? "0187173437300001",
  taxOffice: process.env.NEXT_PUBLIC_SITE_TAX_OFFICE ?? "Beşiktaş Vergi Dairesi",
  taxId: process.env.NEXT_PUBLIC_SITE_TAX_ID ?? "1871734373",
  tradeRegistryNo: process.env.NEXT_PUBLIC_SITE_TRADE_REGISTRY ?? "1086253",
  kep: process.env.NEXT_PUBLIC_SITE_KEP ?? "jale@hs01.kep.tr",
};

// Desteklenen pazaryerleri — sitede her yerde bu liste kullanılır.
export const MARKETPLACES = [
  { key: "trendyol", label: "Trendyol", color: "#f27a1a", status: "active" },
  { key: "hepsiburada", label: "Hepsiburada", color: "#ff6000", status: "active" },
  { key: "amazon", label: "Amazon", color: "#ff9900", status: "soon" },
] as const;

export type MarketplaceKey = (typeof MARKETPLACES)[number]["key"];

// Tek paket hizmet modeli:
// 1. ay  → kurulum + ilk ay yönetim (setupFee)
// 2. ay+ → aylık yönetim (managementFee)
// Tüm tutarlar KDV hariç net tutardır.
export const PRICING = {
  setupFee: 25000,
  managementFee: 17000,
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
  discount?: { type: "percent" | "fixed"; value: number } | null;
}

export interface OrderQuote {
  setupNet: number; // 1. ay paketi (kurulum + ilk ay yönetim), KDV hariç
  managementMonthly: number; // 2. aydan itibaren aylık yönetim (bilgi amaçlı)
  discountAmount: number;
  netAfterDiscount: number;
  vatAmount: number;
  total: number; // online tahsil edilen tutar (1. ay paketi, KDV dahil)
}

export interface PricingValues {
  setupFee: number;
  managementFee: number;
  setupDays: number;
}

export function computeOrderQuote(
  input: OrderInput,
  pricing: PricingValues = PRICING
): OrderQuote {
  const setupNet = pricing.setupFee;

  let discountAmount = 0;
  if (input.discount) {
    discountAmount =
      input.discount.type === "percent"
        ? Math.round(setupNet * (input.discount.value / 100))
        : Math.min(input.discount.value, setupNet);
  }

  const netAfterDiscount = setupNet - discountAmount;
  const vatAmount = Math.round(netAfterDiscount * VAT_RATE);

  return {
    setupNet,
    managementMonthly: pricing.managementFee,
    discountAmount,
    netAfterDiscount,
    vatAmount,
    total: netAfterDiscount + vatAmount,
  };
}
