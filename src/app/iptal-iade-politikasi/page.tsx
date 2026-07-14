import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası",
  description: "CPAS Türkiye (cpasturkiye.com) hizmet iptal ve iade koşulları.",
  alternates: { canonical: "/iptal-iade-politikasi" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="İptal ve İade Politikası"
      updatedAt="14 Temmuz 2026"
      intro={`İşbu politika, ${SITE.company} tarafından sunulan Meta CPAS kurulum ve aylık reklam yönetim hizmetlerine ilişkin iptal ve iade koşullarını düzenler.`}
      sections={[
        {
          heading: "Aylık Yönetim Hizmetinin İptali",
          paragraphs: [
            "Aylık yönetim hizmeti taahhüt içermez. Müşteri, mevcut hizmet döneminin sonunda yürürlüğe girmek üzere hizmeti dilediği zaman durdurabilir. İptal talebi " + SITE.email + " adresine e-posta ile veya hesap yöneticisine iletilebilir.",
            "İptal sonrasında hizmet, ödenmiş dönemin sonuna kadar sunulmaya devam eder. Kıst dönem (kullanılmayan gün) iadesi yapılmaz.",
            "Hizmetin sonlandırılması halinde; Meta Business Manager, reklam hesabı, katalog bağlantısı ve kampanya yapıları müşterinin mülkiyetinde kalır. Talep edilmesi halinde erişim devri yapılır.",
          ],
        },
        {
          heading: "Kurulum + İlk Ay Yönetim Paketinde İade",
          paragraphs: [
            `Kurulum + İlk Ay Yönetim Paketi (${formatTRY(PRICING.setupFee)} + KDV), müşteriye özel olarak ifa edilen bir hizmettir ve süreç başlamadan önce tahsil edilir.`,
          ],
          list: [
            "Kurulum süreci henüz başlamadıysa: bedelin tamamı iade edilir",
            "Süreç başladıktan sonra (pazaryeri reklam yetkilendirme talebinin açılması ile süreç başlamış sayılır): ifa edilen aşamalara karşılık gelen bedel düşülerek kalan kısım iade edilir",
            "Kurulum tamamlanıp kampanyalar canlıya alındıktan sonra: iade yapılmaz",
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
            "Hizmetin sonlandırılması sonrasında raporlarınız ve hesap kayıtlarınız 30 gün boyunca saklanır; bu süre içinde kopyalarını talep edebilirsiniz. 30 günün sonunda veriler silinir veya anonimleştirilir. Talep halinde verileriniz daha erken de silinebilir.",
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
