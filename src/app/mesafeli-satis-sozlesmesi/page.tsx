import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE, PRICING, formatTRY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Jale (cpasturkiye.com) mesafeli satış sözleşmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalPage
      title="Mesafeli Satış Sözleşmesi"
      updatedAt="10 Haziran 2026"
      intro={`İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), ${SITE.company} ("Satıcı") ile ${SITE.domain} üzerinden hizmet satın alan gerçek veya tüzel kişi ("Alıcı") arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca elektronik ortamda kurulmuştur.`}
      sections={[
        {
          heading: "Taraflar",
          paragraphs: [
            `Satıcı: ${SITE.company} — ${SITE.address} — ${SITE.email}`,
            "Alıcı: Sipariş/abonelik formunda bilgileri yer alan gerçek veya tüzel kişi.",
            "Alıcının ticari veya mesleki amaçla hareket eden tacir olması halinde, tüketici mevzuatının yalnızca tüketicilere özgülenmiş hükümleri uygulanmaz; bu durumda taraflar arasındaki Hizmet Sözleşmesi hükümleri esas alınır.",
          ],
        },
        {
          heading: "Sözleşmenin Konusu",
          paragraphs: [
            "Sözleşmenin konusu; Alıcının, Satıcıya ait Jale platformu üzerinden elektronik ortamda sipariş verdiği aşağıda nitelikleri ve satış fiyatı belirtilen hizmetlerin satışı ve ifası ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.",
          ],
        },
        {
          heading: "Hizmet Bilgileri ve Bedeli",
          paragraphs: ["Platformda sunulan hizmetler ve güncel bedelleri şunlardır:"],
          list: [
            `Tek seferlik kurulum hizmeti: ${formatTRY(PRICING.setupFee)} + KDV (Trendyol yetkilendirme, Meta Business kurulumu, CPAS bağlantısı, eğitim — yaklaşık ${PRICING.setupDays} iş günü)`,
            `Starter abonelik (1 mağaza): ${formatTRY(PRICING.starter)}/ay + KDV`,
            `Ek mağaza: ${formatTRY(PRICING.extraStore)}/ay + KDV (mağaza başına)`,
            `Agency planı: mağaza başına ${formatTRY(PRICING.agencyPerStore)}/ay + KDV; ${PRICING.agencyContactThreshold} ve üzeri mağaza için özel teklif`,
            "Yıllık peşin ödemelerde abonelik bedellerine %20 indirim uygulanır",
          ],
        },
        {
          heading: "Ödeme ve Faturalandırma",
          paragraphs: [
            "Ödemeler; kredi kartı, banka kartı veya havale/EFT yoluyla tahsil edilir. Abonelik bedelleri seçilen döneme göre (aylık/yıllık) peşin olarak faturalandırılır. Kurulum bedeli, kurulum sürecinin başlamasından önce tahsil edilir. Faturalar elektronik ortamda Alıcının bildirdiği e-posta adresine iletilir.",
          ],
        },
        {
          heading: "Hizmetin İfası",
          paragraphs: [
            "Kurulum hizmeti, ödemenin alınmasını takiben başlatılır ve ortalama 7 iş günü içinde tamamlanır; süre, Trendyol ve Meta tarafındaki onay süreçlerine bağlı olarak uzayabilir. Platform aboneliği, kurulumun tamamlanıp hesabın aktifleştirilmesiyle başlar. Hizmet, elektronik ortamda anında ifa edilen sürekli edimli bir hizmettir.",
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
            "Satıcı, hizmeti sözleşmeye uygun şekilde sunmakla; Alıcı, kurulum ve entegrasyon için gerekli yetkilendirme ve bilgileri doğru ve eksiksiz sağlamakla yükümlüdür. Alıcının gerekli erişimleri sağlamaması nedeniyle yaşanan gecikmelerden Satıcı sorumlu tutulamaz.",
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
            "Alıcı, sipariş/abonelik işlemini tamamlamakla işbu Sözleşmenin tüm koşullarını kabul etmiş sayılır. Sözleşme, elektronik ortamda onaylandığı tarihte yürürlüğe girer.",
          ],
        },
      ]}
    />
  );
}
