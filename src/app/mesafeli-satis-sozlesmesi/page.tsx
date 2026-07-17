import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "CPAS Türkiye (cpasturkiye.com) mesafeli satış sözleşmesi.",
  alternates: { canonical: "/mesafeli-satis-sozlesmesi" },
};

export default function DistanceSalesPage() {
  return (
    <LegalPage
      title="Mesafeli Satış Sözleşmesi"
      updatedAt="14 Temmuz 2026"
      intro={`İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), ${SITE.company} ("Satıcı") ile ${SITE.domain} üzerinden hizmet satın alan gerçek veya tüzel kişi ("Alıcı") arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca elektronik ortamda kurulmuştur.`}
      sections={[
        {
          heading: "Taraflar",
          paragraphs: [
            `Satıcı: ${SITE.company} — ${SITE.address} — ${SITE.email}`,
            "Alıcı: Sipariş formunda bilgileri yer alan gerçek veya tüzel kişi.",
            "Alıcının ticari veya mesleki amaçla hareket eden tacir olması halinde, tüketici mevzuatının yalnızca tüketicilere özgülenmiş hükümleri uygulanmaz; bu durumda taraflar arasındaki Hizmet Sözleşmesi hükümleri esas alınır.",
          ],
        },
        {
          heading: "Sözleşmenin Konusu",
          paragraphs: [
            "Sözleşmenin konusu; Alıcının, Satıcıya ait cpasturkiye.com sitesi üzerinden elektronik ortamda sipariş verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen Meta CPAS reklam kurulum ve yönetim hizmetlerinin satışı ve ifası ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.",
          ],
        },
        {
          heading: "Hizmet Bilgileri ve Bedeli",
          paragraphs: ["Sunulan hizmetler ve güncel bedelleri şunlardır:"],
          list: [
            `Kurulum + İlk Ay Yönetim Paketi: ${formatTRY(PRICING.setupFee)} + KDV (tek seferlik) — pazaryeri reklam yetkilendirmesi, Meta Business Manager kurulumu, CPAS katalog bağlantısı, piksel/event ölçümleme, kampanya mimarisi, canlıya alma ve ilk ayın yönetimi; kurulum ortalama ${PRICING.setupDays} iş günü sürer`,
            `Aylık Yönetim Hizmeti (2. ay ve sonrası): ${formatTRY(PRICING.managementFee)} + KDV/ay — haftalık optimizasyon, bütçe yönetimi, raporlama ve strateji görüşmesi`,
            "Meta'ya ödenen reklam bütçesi hizmet bedellerine dahil değildir; Alıcı tarafından doğrudan Meta'ya ödenir",
          ],
        },
        {
          heading: "Ödeme ve Faturalandırma",
          paragraphs: [
            "Kurulum + İlk Ay Yönetim Paketi bedeli; kredi kartı, banka kartı veya havale/EFT yoluyla, kurulum sürecinin başlamasından önce peşin tahsil edilir. Havale/EFT ile ödemede dekont ibrazı ve teyidi sonrası sipariş onaylanır. Aylık yönetim isteğe bağlıdır; Alıcının devam etmeyi tercih etmesi halinde 2. aydan itibaren her ay fatura karşılığı tahsil edilir. Faturalar elektronik ortamda Alıcının bildirdiği e-posta adresine iletilir.",
          ],
        },
        {
          heading: "Hizmetin İfası",
          paragraphs: [
            `Kurulum hizmeti, ödemenin alınmasını takiben başlatılır ve ortalama ${PRICING.setupDays} iş günü içinde tamamlanır; süre, pazaryeri ve Meta tarafındaki onay süreçlerine bağlı olarak uzayabilir. Aylık yönetim hizmeti, kurulumun tamamlanmasını takip eden aydan itibaren aylık dönemler halinde sunulan sürekli edimli bir hizmettir.`,
          ],
        },
        {
          heading: "Cayma Hakkı",
          paragraphs: [
            "Tüketici sıfatını haiz Alıcı, Mesafeli Sözleşmeler Yönetmeliği uyarınca 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir. Ancak Yönetmeliğin 15. maddesi uyarınca; (a) cayma süresi sona ermeden önce tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmelerde ve (b) elektronik ortamda anında ifa edilen hizmetlerde cayma hakkı kullanılamaz. Kurulum hizmetinin Alıcının onayı ile süresinden önce başlatılması halinde, ifa edilen kısma ilişkin bedel iade kapsamı dışındadır. Detaylar İptal ve İade Politikasında düzenlenmiştir.",
          ],
        },
        {
          heading: "Tarafların Yükümlülükleri",
          paragraphs: [
            "Satıcı, hizmeti sözleşmeye uygun şekilde sunmakla; Alıcı, kurulum ve entegrasyon için gerekli yetkilendirme ve bilgileri doğru ve eksiksiz sağlamakla yükümlüdür. Alıcının gerekli erişimleri sağlamaması nedeniyle yaşanan gecikmelerden Satıcı sorumlu tutulamaz. Reklam performansı; ürün, fiyat, stok ve pazar koşullarına bağlı olduğundan Satıcı belirli bir satış veya ROAS sonucunu taahhüt etmez.",
          ],
        },
        {
          heading: "Uyuşmazlıkların Çözümü",
          paragraphs: [
            "İşbu Sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca her yıl belirlenen parasal sınırlar dahilinde Alıcının veya Satıcının yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir. Tacirler arası uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.",
          ],
        },
        {
          heading: "Yürürlük",
          paragraphs: [
            "Alıcı, sipariş işlemini tamamlamakla işbu Sözleşmenin tüm koşullarını kabul etmiş sayılır. Sözleşme, elektronik ortamda onaylandığı tarihte yürürlüğe girer.",
          ],
        },
      ]}
    />
  );
}
