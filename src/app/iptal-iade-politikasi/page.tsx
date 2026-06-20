import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası",
  description: "Jale (cpasturkiye.com) abonelik iptal ve iade koşulları.",
  alternates: { canonical: "/iptal-iade-politikasi" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="İptal ve İade Politikası"
      updatedAt="10 Haziran 2026"
      intro={`İşbu politika, ${SITE.company} tarafından sunulan Jale platformu abonelikleri ile kurulum hizmetine ilişkin iptal ve iade koşullarını düzenler.`}
      sections={[
        {
          heading: "Abonelik İptali",
          paragraphs: [
            "Aylık abonelikler taahhüt içermez. Müşteri, mevcut ödeme döneminin sonunda yürürlüğe girmek üzere aboneliğini dilediği zaman iptal edebilir. İptal talebi; panel üzerinden veya " + SITE.email + " adresine e-posta ile iletilebilir.",
            "İptal sonrasında hizmet, ödenmiş dönemin sonuna kadar kullanılmaya devam edilebilir. Kıst dönem (kullanılmayan gün) iadesi yapılmaz.",
          ],
        },
        {
          heading: "Yıllık Aboneliklerde İptal",
          paragraphs: [
            "Yıllık abonelikler %20 indirimli olarak peşin tahsil edilir. Yıllık aboneliğin ilk 14 günü içinde yapılan iptallerde, kullanılan süreye karşılık gelen bedel indirimsiz aylık fiyat üzerinden hesaplanarak düşülür ve kalan tutar iade edilir. 14 günden sonra yapılan iptallerde dönem sonuna kadar hizmet sunulur; iade yapılmaz.",
          ],
        },
        {
          heading: "Kurulum Hizmetinde İade",
          paragraphs: [
            `Kurulum hizmeti (${formatTRY(PRICING.setupFee)} + KDV), kişiye özel olarak ifa edilen bir hizmettir ve süreç başlamadan önce tahsil edilir.`,
          ],
          list: [
            "Kurulum süreci henüz başlamadıysa: bedelin tamamı iade edilir",
            "Süreç başladıktan sonra (Trendyol yetkilendirme talebinin açılması ile süreç başlamış sayılır): ifa edilen aşamalara karşılık gelen bedel düşülerek kalan kısım iade edilir",
            "Kurulum tamamlandıktan sonra: iade yapılmaz",
            "Kurulumun Sağlayıcıdan kaynaklanan nedenlerle tamamlanamaması halinde: bedelin tamamı iade edilir",
          ],
        },
        {
          heading: "Cayma Hakkı (Tüketiciler)",
          paragraphs: [
            "Tüketici sıfatını haiz müşteriler, Mesafeli Sözleşmeler Yönetmeliği uyarınca 14 günlük cayma hakkına sahiptir. Ancak tüketicinin onayı ile ifasına başlanan hizmetlerde ve elektronik ortamda anında ifa edilen hizmetlerde cayma hakkı, ifa edilen kısım bakımından kullanılamaz. Cayma bildirimleri yazılı olarak veya e-posta yoluyla yapılabilir.",
          ],
        },
        {
          heading: "İade Süreci",
          paragraphs: [
            "Onaylanan iadeler, iade talebinin onaylanmasından itibaren 14 gün içinde, ödemenin yapıldığı yönteme (kredi kartı/havale) iade edilir. Kredi kartına yapılan iadelerin hesaba yansıma süresi bankaya göre değişebilir.",
          ],
        },
        {
          heading: "Verileriniz",
          paragraphs: [
            "Abonelik iptali sonrasında hesap verileriniz 30 gün boyunca saklanır; bu süre içinde raporlarınızı dışa aktarabilirsiniz. 30 günün sonunda veriler silinir veya anonimleştirilir. Talep halinde verileriniz daha erken de silinebilir.",
          ],
        },
        {
          heading: "İletişim",
          paragraphs: [
            `İptal ve iade talepleriniz için: ${SITE.email}`,
          ],
        },
      ]}
    />
  );
}
