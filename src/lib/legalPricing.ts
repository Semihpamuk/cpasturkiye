import { getSettings } from "./db";
import { VAT_RATE, formatTRY } from "./site";

// Yasal metinlerde geçen bedeller admin panelindeki güncel fiyatlardan beslenir;
// koddaki varsayılanlar donup kalmasın diye sayfalar bu yardımcıyı kullanır.
// Mesafeli Sözleşmeler Yönetmeliği tüm vergiler dahil toplam bedeli istediği için
// birincil gösterim KDV dahildir, KDV hariç tutar parantezde verilir.

export interface LegalPricing {
  /** KDV dahil kurulum paketi bedeli — "30.000 ₺" */
  setupGross: string;
  /** KDV hariç kurulum paketi bedeli */
  setupNet: string;
  /** KDV dahil aylık yönetim bedeli */
  managementGross: string;
  /** KDV hariç aylık yönetim bedeli */
  managementNet: string;
  setupDays: number;
  vatPercent: number;
}

function gross(net: number): number {
  return Math.round(net * (1 + VAT_RATE));
}

export async function getLegalPricing(): Promise<LegalPricing> {
  const { pricing } = await getSettings();
  return {
    setupGross: formatTRY(gross(pricing.setupFee)),
    setupNet: formatTRY(pricing.setupFee),
    managementGross: formatTRY(gross(pricing.managementFee)),
    managementNet: formatTRY(pricing.managementFee),
    setupDays: pricing.setupDays,
    vatPercent: Math.round(VAT_RATE * 100),
  };
}
