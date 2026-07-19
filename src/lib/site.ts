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

/* ─────────────────────────── Fiyat modeli ───────────────────────────
 *
 * Kurulum paketi (tek seferlik, online/havale ile ödenir):
 *   - Kurulum + İLK AY yönetim dahildir.
 *   - Liste fiyatı 39.000₺, kampanyalı 25.000₺ (çapa fiyat gösterimi).
 *
 * Aylık yönetim (devam) İSTEĞE BAĞLIDIR — taahhüt yok:
 *   - Müşteri sadece kurulumu alıp bırakabilir.
 *   - Dilerse checkout'ta "devam ödemesi" eklentisiyle bir sonraki ayı
 *     %10 indirimle peşin kilitler (2 ayı birden alma mantığı).
 *
 * Birden fazla pazaryeri (ikili alım):
 *   - İlk pazaryeri tam fiyat.
 *   - Sonraki her pazaryeri kurulum + yönetimde %50 indirimli.
 *
 * Ödeme yöntemi:
 *   - Kart (iyzico): 9'a kadar taksit. İndirim kodu geçerli.
 *   - Havale/EFT: net toplama %5 indirim + dekont yükleme. İndirim kodu geçersiz.
 *
 * İndirimler üst üste biner. Sıra:
 *   2. pazaryeri %50 → devam %10 → (indirim kodu VEYA havale %5) → KDV %20.
 * ------------------------------------------------------------------- */

export const PRICING = {
  /** Kurulum paketi liste (çapa) fiyatı — üstü çizili gösterilir. */
  listSetupFee: 39000,
  /** Kurulum paketi kampanyalı fiyatı (kurulum + ilk ay yönetim). */
  setupFee: 25000,
  /** Aylık yönetim (devam) bedeli — pazaryeri başına. */
  managementFee: 16000,
  setupDays: 7,
};

export const VAT_RATE = 0.2;
/** İlk pazaryerinden sonraki her pazaryeri için indirim oranı. */
export const SECOND_MARKETPLACE_RATE = 0.5;
/** Checkout'ta devam ödemesi eklentisine uygulanan peşin indirim. */
export const MANAGEMENT_ADDON_DISCOUNT = 0.1;
/** Havale/EFT ile ödemede net toplama uygulanan indirim. */
export const TRANSFER_DISCOUNT = 0.05;

export type PaymentMethod = "card" | "transfer";

/**
 * Havale/EFT ekranında gösterilen banka hesapları.
 * Mock veri — gerçek IBAN'lar geldiğinde bu liste güncellenir
 * (ileride .env / admin ayarlarına taşınabilir).
 */
export const BANK_ACCOUNTS = [
  {
    bank: "Ziraat Bankası",
    holder: "Brother Hustle Danışmanlık ve Tic. Ltd. Şti.",
    iban: "TR83 0001 0021 5898 1005 2450 01",
  },
  {
    bank: "VakıfBank",
    holder: "Brother Hustle Danışmanlık ve Tic. Ltd. Şti.",
    iban: "TR81 0001 5001 5800 7360 8558 03",
  },
  {
    bank: "QNB",
    holder: "Brother Hustle Danışmanlık ve Tic. Ltd. Şti.",
    iban: "TR79 0011 1000 0000 0165 3447 04",
  },
  {
    bank: "İş Bankası",
    holder: "Brother Hustle Danışmanlık ve Tic. Ltd. Şti.",
    iban: "TR49 0006 4000 0011 1351 3963 37",
  },
] as const;

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface PricingValues {
  listSetupFee: number;
  setupFee: number;
  managementFee: number;
  setupDays: number;
}

export interface OrderInput {
  /** Seçilen pazaryeri sayısı (en az 1). İlk tam, sonrakiler %50. */
  marketplaceCount: number;
  /** Devam ödemesi (bir sonraki ay yönetim) eklendi mi. */
  addManagement: boolean;
  /** Ödeme yöntemi — havale net toplama %5 indirim uygular. */
  paymentMethod: PaymentMethod;
  /** İndirim kodu — yalnızca kart ödemesinde uygulanır. */
  discount?: { type: "percent" | "fixed"; value: number } | null;
}

export interface OrderQuote {
  marketplaceCount: number;
  /** Kurulum toplamı (2. pazaryeri %50 dahil), KDV hariç net. */
  setupNet: number;
  /** Kurulum liste (çapa) toplamı — üstü çizili gösterim için. */
  listSetupNet: number;
  /** Devam edilirse aylık yönetim (2. pazaryeri %50 dahil), bilgi amaçlı. */
  managementMonthly: number;
  /** Devam ödemesi eklentisi (%10 indirimli). Eklenmediyse 0. */
  managementAddon: number;
  addManagement: boolean;
  paymentMethod: PaymentMethod;
  /** setupNet + managementAddon (indirim öncesi net). */
  baseNet: number;
  /** İndirim kodundan gelen indirim (yalnızca kart). */
  codeDiscount: number;
  /** Havale indirimi (yalnızca havale). */
  transferDiscount: number;
  /** Tüm indirimlerin toplamı. */
  discountAmount: number;
  /** İndirimler sonrası net tutar (KDV hariç). */
  netAfterDiscount: number;
  vatAmount: number;
  /** Bugün ödenecek tutar (KDV dahil). */
  total: number;
}

/** Kurulum net toplamı: ilk pazaryeri tam, sonrakiler %50. */
function tieredTotal(perUnit: number, count: number): number {
  if (count <= 0) return 0;
  const rest = count - 1;
  return Math.round(perUnit + rest * perUnit * SECOND_MARKETPLACE_RATE);
}

export function computeOrderQuote(
  input: OrderInput,
  pricing: PricingValues = PRICING
): OrderQuote {
  const count = Math.max(1, Math.floor(input.marketplaceCount || 1));

  const setupNet = tieredTotal(pricing.setupFee, count);
  const listSetupNet = tieredTotal(pricing.listSetupFee, count);
  const managementMonthly = tieredTotal(pricing.managementFee, count);

  const managementAddon = input.addManagement
    ? Math.round(managementMonthly * (1 - MANAGEMENT_ADDON_DISCOUNT))
    : 0;

  const baseNet = setupNet + managementAddon;

  // İndirim kodu yalnızca kart ödemesinde geçerli.
  let codeDiscount = 0;
  if (input.paymentMethod === "card" && input.discount) {
    codeDiscount =
      input.discount.type === "percent"
        ? Math.round(baseNet * (input.discount.value / 100))
        : Math.min(input.discount.value, baseNet);
  }

  const afterCode = baseNet - codeDiscount;

  // Havale indirimi yalnızca havale ödemesinde, kod indirimi sonrası tutara.
  const transferDiscount =
    input.paymentMethod === "transfer"
      ? Math.round(afterCode * TRANSFER_DISCOUNT)
      : 0;

  const netAfterDiscount = afterCode - transferDiscount;
  const vatAmount = Math.round(netAfterDiscount * VAT_RATE);

  return {
    marketplaceCount: count,
    setupNet,
    listSetupNet,
    managementMonthly,
    managementAddon,
    addManagement: input.addManagement,
    paymentMethod: input.paymentMethod,
    baseNet,
    codeDiscount,
    transferDiscount,
    discountAmount: codeDiscount + transferDiscount,
    netAfterDiscount,
    vatAmount,
    total: netAfterDiscount + vatAmount,
  };
}
