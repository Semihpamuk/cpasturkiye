import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, MARKETPLACES } from "@/lib/site";
import { getLegalPricing } from "@/lib/legalPricing";

// Yalnızca hizmete açık pazaryerleri metne girer ("soon" olanlar hariç).
const activeMarketplaces = MARKETPLACES.filter((m) => m.status === "active")
  .map((m) => m.label)
  .join(" ve ");

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description:
    "CPAS Türkiye (cpasturkiye.com) mesafeli hizmet satışı ön bilgilendirme formu.",
  alternates: { canonical: "/on-bilgilendirme-formu" },
};

// Bedeller admin panelindeki güncel fiyatlardan okunur; bu yüzden sayfa dinamiktir.
export const dynamic = "force-dynamic";

export default async function PreliminaryInfoPage() {
  const price = await getLegalPricing();

  return (
    <LegalPage
      title="Ön Bilgilendirme Formu"
      updatedAt="3 Ağustos 2026"
      intro={`İşbu form, Mesafeli Sözleşmeler Yönetmeliği uyarınca, siparişinizi tamamlamadan önce bilmeniz gereken hususlarda sizi bilgilendirmek amacıyla hazırlanmıştır. Sipariş adımında bu formu ve Mesafeli Satış Sözleşmesini onayladığınızda, buradaki bilgileri edindiğinizi teyit etmiş olursunuz.`}
      sections={[
        {
          heading: "Satıcı Bilgileri",
          paragraphs: ["Hizmeti sunan satıcıya ilişkin bilgiler aşağıdadır:"],
          list: [
            `Ticaret unvanı: ${SITE.company}`,
            `Adres: ${SITE.address}`,
            `Telefon: ${SITE.phone}`,
            `E-posta: ${SITE.email}`,
            `KEP adresi: ${SITE.kep}`,
            `MERSİS No: ${SITE.mersis}`,
            `Ticaret Sicil No: ${SITE.tradeRegistryNo}`,
            `Vergi Dairesi / No: ${SITE.taxOffice} / ${SITE.taxId}`,
          ],
        },
        {
          heading: "Hizmetin Temel Nitelikleri",
          paragraphs: [
            `Sipariş konusu hizmet, ${activeMarketplaces} mağazanız için Meta CPAS (Collaborative Performance Advertising Solution) reklamlarının kurulumu ve yönetimidir. Fiziksel bir ürün teslimi söz konusu değildir; edim, elektronik ortamda ve uzaktan ifa edilen bir hizmettir.`,
          ],
          list: [
            "Kurulum: pazaryeri reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel ve olay ölçümlemesi, kampanya mimarisinin oluşturulması ve kampanyaların canlıya alınması",
            "Yönetim: haftalık optimizasyon, bütçe yönetimi, performans raporlaması ve strateji görüşmesi",
            "Meta'ya ödenen reklam bütçesi hizmet bedeline dahil değildir; ilgili tutar doğrudan Meta'ya ödenir",
            "Reklam performansı ürün, fiyat, stok ve pazar koşullarına bağlı olduğundan belirli bir satış veya ROAS sonucu taahhüt edilmez",
          ],
        },
        {
          heading: "Toplam Bedel (Tüm Vergiler Dahil)",
          paragraphs: [
            `Aşağıdaki tutarlar %${price.vatPercent} KDV dahil toplam bedellerdir. Sipariş özetinde gösterilen ve ödeme adımında onayladığınız tutar esastır; birden fazla pazaryeri seçimi, indirim kodu ve havale/EFT indirimi gibi kalemler bu tutarı değiştirebilir.`,
          ],
          list: [
            `Kurulum + İlk Ay Yönetim Paketi (tek seferlik): ${price.setupGross} (KDV hariç ${price.setupNet})`,
            `Aylık Yönetim Hizmeti (2. ay ve sonrası, isteğe bağlı): ${price.managementGross}/ay (KDV hariç ${price.managementNet})`,
            "İkinci ve sonraki pazaryerleri kurulum ve yönetim bedellerinde %50 indirimlidir",
            "Meta reklam bütçesi bu tutarlara dahil değildir",
            "Kargo, teslimat veya benzeri ek masraf bulunmamaktadır",
          ],
        },
        {
          heading: "Ödeme Şekli",
          paragraphs: [
            "Ödeme, kredi/banka kartı ile (iyzico altyapısı üzerinden, 9 aya kadar taksit imkânıyla) veya havale/EFT yoluyla yapılabilir. Havale/EFT seçiminde toplam tutara ek indirim uygulanır ve sipariş, ödemenin hesabımıza ulaştığının doğrulanmasının ardından onaylanır. Kart bilgileri Satıcı tarafından saklanmaz; ödeme işlemi lisanslı ödeme kuruluşu altyapısında gerçekleşir.",
            "Kurulum paketi bedeli, kurulum sürecinin başlamasından önce peşin tahsil edilir. Aylık yönetim hizmeti taahhüt içermez ve devam edilmesi halinde her ay fatura karşılığı tahsil edilir. Faturalar elektronik ortamda bildirdiğiniz e-posta adresine iletilir.",
          ],
        },
        {
          heading: "İfa Şekli ve Süresi",
          paragraphs: [
            `Kurulum hizmeti, ödemenin alınmasını (havale/EFT'de ödemenin doğrulanmasını) takiben başlatılır ve ortalama ${price.setupDays} iş günü içinde tamamlanır. Bu süre, pazaryeri ve Meta tarafındaki onay süreçlerine bağlı olarak uzayabilir. Hizmetin ifası için gerekli yetkilendirme ve bilgilerin tarafınızca zamanında sağlanmaması halinde oluşan gecikmelerden Satıcı sorumlu tutulamaz.`,
          ],
        },
        {
          heading: "Cayma Hakkı ve İstisnası",
          paragraphs: [
            "Tüketici sıfatını haiz alıcılar, sözleşmenin kurulmasından itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir. Cayma bildirimi, yukarıdaki e-posta veya adrese yazılı olarak iletilebilir.",
            "Ancak Mesafeli Sözleşmeler Yönetmeliğinin 15. maddesi uyarınca; cayma süresi sona ermeden önce tüketicinin onayı ile ifasına başlanan hizmetlerde ve elektronik ortamda anında ifa edilen hizmetlerde cayma hakkı kullanılamaz. Kurulum hizmetinin onayınızla erken başlatılması halinde, ifa edilen kısma ilişkin bedel iade kapsamı dışındadır. İade koşullarının ayrıntısı İptal ve İade Politikasında düzenlenmiştir.",
            "Alıcının ticari veya mesleki amaçla hareket eden tacir olması halinde tüketici mevzuatının tüketicilere özgülenmiş hükümleri uygulanmaz; bu durumda Hizmet Sözleşmesi hükümleri esas alınır.",
          ],
        },
        {
          heading: "Şikâyet ve İtiraz Başvuruları",
          paragraphs: [
            "Hizmete ilişkin talep ve şikâyetlerinizi yukarıdaki e-posta adresi veya telefon üzerinden iletebilirsiniz. Uyuşmazlık halinde tüketiciler, Ticaret Bakanlığınca her yıl belirlenen parasal sınırlar dahilinde kendi yerleşim yerlerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetine, sınırın üzerindeki uyuşmazlıklarda Tüketici Mahkemelerine başvurabilir. Tacirler arası uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.",
          ],
        },
        {
          heading: "Formun Teyidi ve Saklanması",
          paragraphs: [
            "Sipariş adımında bu formu ve Mesafeli Satış Sözleşmesini onayladığınızda, sözleşme öncesi bilgilendirmenin tarafınıza yapıldığını kabul etmiş olursunuz. Onay kaydınız sipariş bilgileriyle birlikte saklanır ve sipariş onay e-postanızda her iki belgeye erişim bağlantısı yer alır.",
          ],
        },
      ]}
    />
  );
}
