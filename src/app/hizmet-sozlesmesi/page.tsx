import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hizmet Sözleşmesi",
  description: "CPAS Türkiye (cpasturkiye.com) reklam kurulum ve yönetim hizmet sözleşmesi.",
  alternates: { canonical: "/hizmet-sozlesmesi" },
};

export default function ServiceAgreementPage() {
  return (
    <LegalPage
      title="Hizmet Sözleşmesi"
      updatedAt="14 Temmuz 2026"
      intro={`İşbu Hizmet Sözleşmesi ("Sözleşme"), ${SITE.company} ("Sağlayıcı") ile Meta CPAS kurulum ve reklam yönetim hizmetini satın alan müşteri ("Müşteri") arasında akdedilmiştir. Müşteri, hizmeti satın almakla işbu Sözleşmeyi kabul etmiş sayılır.`}
      sections={[
        {
          heading: "Hizmetin Kapsamı",
          paragraphs: [
            "Sağlayıcı, Müşteriye aşağıdaki hizmetleri sunar:",
          ],
          list: [
            `Kurulum + İlk Ay Yönetim Paketi (${formatTRY(PRICING.setupFee)} + KDV, tek seferlik): pazaryeri (Trendyol/Hepsiburada) reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel/event ölçümleme kurulumu, kampanya mimarisinin oluşturulması, test yayını ve kampanyaların canlıya alınması ile ilk ayın yönetimi`,
            `Aylık Yönetim Hizmeti (${formatTRY(PRICING.managementFee)} + KDV/ay, 2. aydan itibaren): kampanyaların haftalık optimizasyonu, bütçe yönetimi, stok/fiyat senkron takibi, anomali izleme, haftalık raporlama ve aylık strateji görüşmesi`,
            "Hizmet süresince e-posta ve telefon üzerinden destek",
          ],
        },
        {
          heading: "Müşterinin Yükümlülükleri",
          paragraphs: [""],
          list: [
            "Kurulum ve yönetim için gerekli yetkilendirmeleri (pazaryeri reklam yetkisi, Meta Business erişimi) zamanında ve doğru şekilde sağlamak",
            "Hesap bilgilerinin gizliliğini korumak",
            "Hizmeti yürürlükteki mevzuata, pazaryerlerinin ve Meta'nın kural ve politikalarına uygun kullanmak",
            "Hizmet bedellerini zamanında ödemek",
            "Reklam içeriklerinin ve satışa sunulan ürünlerin hukuka uygunluğundan münhasıran sorumlu olmak",
          ],
        },
        {
          heading: "Reklam Bütçesi ve Üçüncü Taraf Platformlar",
          paragraphs: [
            "Meta'ya ödenen reklam harcamaları hizmet bedellerine dahil değildir ve doğrudan Müşterinin kendi Meta reklam hesabından tahsil edilir. Sağlayıcı; Meta, Trendyol, Hepsiburada veya Amazon'un hizmet kesintileri, politika değişiklikleri, hesap kısıtlamaları veya API değişikliklerinden kaynaklanan aksaklıklardan sorumlu tutulamaz; ancak bu durumların çözümü için makul ticari çabayı gösterir.",
          ],
        },
        {
          heading: "Hizmet Seviyesi",
          paragraphs: [
            "Sağlayıcı, hizmeti işbu Sözleşmeye uygun, özenli ve profesyonel standartlarda sunmak için makul çabayı gösterir. Belirli bir reklam performansı, ROAS seviyesi veya satış sonucu garanti edilmez; reklam sonuçları ürün, fiyat, pazar koşulları ve bütçe gibi Sağlayıcının kontrolü dışındaki etkenlere bağlıdır.",
          ],
        },
        {
          heading: "Ücretler ve Ödeme",
          paragraphs: [
            "Güncel hizmet ücretleri fiyatlandırma sayfasında ilan edilir. Kurulum + İlk Ay Yönetim Paketi peşin tahsil edilir; aylık yönetim bedeli her ay fatura karşılığı ödenir. Sağlayıcı, ücretlerde değişiklik yapma hakkını saklı tutar; değişiklikler mevcut hizmet döneminin sonunda yürürlüğe girer ve Müşteriye en az 30 gün önceden bildirilir. Ödemenin gecikmesi halinde Sağlayıcı, hizmeti askıya alma hakkına sahiptir.",
          ],
        },
        {
          heading: "Hesapların Mülkiyeti",
          paragraphs: [
            "Meta Business Manager, reklam hesabı, katalog bağlantısı ve kampanya yapıları Müşterinin mülkiyetindedir. Müşterinin kendi verileri (mağaza, ürün ve satış verileri) Müşteriye aittir. Hizmetin sonlanması halinde Sağlayıcı erişimlerini kaldırır ve talep edilmesi durumunda devir sürecine destek olur.",
          ],
        },
        {
          heading: "Gizlilik ve Veri Koruma",
          paragraphs: [
            "Taraflar, işbu Sözleşme kapsamında edindikleri ticari sırları ve gizli bilgileri korumakla yükümlüdür. Kişisel verilerin işlenmesine ilişkin esaslar Gizlilik Politikası ve KVKK Aydınlatma Metninde düzenlenmiştir.",
          ],
        },
        {
          heading: "Sorumluluğun Sınırlandırılması",
          paragraphs: [
            "Sağlayıcının işbu Sözleşmeden doğan toplam sorumluluğu, her halükârda Müşterinin sorumluluğu doğuran olaydan önceki son 12 ay içinde Sağlayıcıya ödediği hizmet bedeli toplamı ile sınırlıdır. Sağlayıcı; dolaylı zararlardan, kâr kaybından ve veri kaybından (kasıt veya ağır ihmal halleri hariç) sorumlu değildir.",
          ],
        },
        {
          heading: "Süre ve Fesih",
          paragraphs: [
            "Sözleşme, hizmet süresince yürürlükte kalır; aylık yönetim hizmeti dönem sonlarında yenilenir. Müşteri, dönem sonunda yenilememe hakkına sahiptir. Taraflardan biri, diğer tarafın esaslı ihlalini 15 gün içinde gidermemesi halinde Sözleşmeyi feshedebilir. Fesih halinde devir ve veri silme süreçleri İptal ve İade Politikasındaki esaslara göre yürütülür.",
          ],
        },
        {
          heading: "Uygulanacak Hukuk ve Yetki",
          paragraphs: [
            "İşbu Sözleşme Türk hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir; tüketici sıfatını haiz müşteriler bakımından tüketici mevzuatının emredici hükümleri saklıdır.",
          ],
        },
      ]}
    />
  );
}
