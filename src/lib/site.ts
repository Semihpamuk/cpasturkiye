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

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
