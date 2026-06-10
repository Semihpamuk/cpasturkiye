import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hizmet Sözleşmesi",
  description: "Jale (cpasturkiye.com) platform hizmet sözleşmesi (SaaS kullanım koşulları).",
};

export default function ServiceAgreementPage() {
  return (
    <LegalPage
      title="Hizmet Sözleşmesi"
      updatedAt="10 Haziran 2026"
      intro={`İşbu Hizmet Sözleşmesi ("Sözleşme"), ${SITE.company} ("Sağlayıcı") ile Jale platformunu ("Platform") kullanan müşteri ("Müşteri") arasında akdedilmiştir. Müşteri, Platforma kaydolmak veya hizmeti satın almakla işbu Sözleşmeyi kabul etmiş sayılır.`}
      sections={[
        {
          heading: "Hizmetin Kapsamı",
          paragraphs: [
            "Sağlayıcı, Müşteriye aşağıdaki hizmetleri sunar:",
          ],
          list: [
            "Trendyol–Meta CPAS entegrasyonu üzerinden reklam yönetim paneli erişimi",
            "Kampanya oluşturma, düzenleme ve raporlama araçları",
            "Otomatik katalog senkronizasyonu",
            "Yapay zeka destekli bütçe önerileri ve anomali bildirimleri",
            "Seçilen plana göre destek hizmetleri",
            `Talep edilmesi halinde tek seferlik profesyonel kurulum hizmeti (${formatTRY(PRICING.setupFee)} + KDV)`,
          ],
        },
        {
          heading: "Müşterinin Yükümlülükleri",
          paragraphs: [""],
          list: [
            "Kurulum ve entegrasyon için gerekli yetkilendirmeleri (Trendyol reklam yetkisi, Meta Business erişimi) zamanında ve doğru şekilde sağlamak",
            "Hesap bilgilerinin gizliliğini korumak; hesabı üçüncü kişilerle paylaşmamak",
            "Platformu yürürlükteki mevzuata, Trendyol ve Meta'nın kural ve politikalarına uygun kullanmak",
            "Abonelik bedellerini zamanında ödemek",
            "Reklam içeriklerinin ve satışa sunulan ürünlerin hukuka uygunluğundan münhasıran sorumlu olmak",
          ],
        },
        {
          heading: "Reklam Bütçesi ve Üçüncü Taraf Platformlar",
          paragraphs: [
            "Meta'ya ödenen reklam harcamaları abonelik bedeline dahil değildir ve doğrudan Müşterinin kendi Meta reklam hesabından tahsil edilir. Sağlayıcı; Meta veya Trendyol'un hizmet kesintileri, politika değişiklikleri, hesap kısıtlamaları veya API değişikliklerinden kaynaklanan aksaklıklardan sorumlu tutulamaz; ancak bu durumların çözümü için makul ticari çabayı gösterir.",
          ],
        },
        {
          heading: "Hizmet Seviyesi",
          paragraphs: [
            "Sağlayıcı, Platformun kesintisiz çalışması için makul çabayı gösterir; planlı bakım çalışmaları önceden duyurulur. Platform 'olduğu gibi' sunulur; belirli bir reklam performansı, ROAS seviyesi veya satış sonucu garanti edilmez. Reklam sonuçları; ürün, fiyat, pazar koşulları ve bütçe gibi Sağlayıcının kontrolü dışındaki etkenlere bağlıdır.",
          ],
        },
        {
          heading: "Ücretler ve Ödeme",
          paragraphs: [
            "Güncel abonelik ücretleri Platformun fiyatlandırma sayfasında ilan edilir. Sağlayıcı, ücretlerde değişiklik yapma hakkını saklı tutar; değişiklikler mevcut ödeme döneminin sonunda yürürlüğe girer ve Müşteriye en az 30 gün önceden bildirilir. Ödemenin gecikmesi halinde Sağlayıcı, hizmeti askıya alma hakkına sahiptir.",
          ],
        },
        {
          heading: "Fikri Mülkiyet",
          paragraphs: [
            "Platforma ilişkin tüm fikri ve sınai mülkiyet hakları Sağlayıcıya aittir. Müşteriye, abonelik süresiyle sınırlı, münhasır olmayan ve devredilemez bir kullanım lisansı tanınır. Müşterinin kendi verileri (mağaza, ürün ve satış verileri) Müşteriye aittir.",
          ],
        },
        {
          heading: "Gizlilik ve Veri Koruma",
          paragraphs: [
            "Taraflar, işbu Sözleşme kapsamında edindikleri ticari sırları ve gizli bilgileri korumakla yükümlüdür. Kişisel verilerin işlenmesine ilişkin esaslar Gizlilik Politikası ve KVKK Aydınlatma Metninde düzenlenmiştir. API erişim anahtarları şifreli olarak saklanır.",
          ],
        },
        {
          heading: "Sorumluluğun Sınırlandırılması",
          paragraphs: [
            "Sağlayıcının işbu Sözleşmeden doğan toplam sorumluluğu, her halükârda Müşterinin sorumluluğu doğuran olaydan önceki son 12 ay içinde Sağlayıcıya ödediği abonelik bedeli toplamı ile sınırlıdır. Sağlayıcı; dolaylı zararlardan, kâr kaybından ve veri kaybından (kasıt veya ağır ihmal halleri hariç) sorumlu değildir.",
          ],
        },
        {
          heading: "Süre ve Fesih",
          paragraphs: [
            "Sözleşme, abonelik süresince yürürlükte kalır ve dönem sonlarında yenilenir. Müşteri, dönem sonunda yenilememe hakkına sahiptir. Taraflardan biri, diğer tarafın esaslı ihlalini 15 gün içinde gidermemesi halinde Sözleşmeyi feshedebilir. Fesih halinde veri taşınabilirliği ve silme süreçleri İptal ve İade Politikasındaki esaslara göre yürütülür.",
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
