import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "CPAS Türkiye (cpasturkiye.com) gizlilik politikası.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      updatedAt="10 Haziran 2026"
      intro={`İşbu Gizlilik Politikası, ${SITE.company} ("Şirket") tarafından işletilen ${SITE.domain} alan adlı web sitesi ve CPAS Türkiye hizmetleri ("Platform") aracılığıyla toplanan kişisel verilerin işlenmesine ilişkin esasları açıklamaktadır.`}
      sections={[
        {
          heading: "Toplanan Veriler",
          paragraphs: [
            "Platformu kullanımınız sırasında aşağıdaki veri kategorileri toplanabilir:",
          ],
          list: [
            "Kimlik ve iletişim bilgileri: ad, soyad, e-posta adresi, telefon numarası",
            "Mağaza bilgileri: Trendyol mağaza adı ve bağlantısı, sipariş hacmi aralığı",
            "Hesap ve kullanım verileri: oturum bilgileri, panel kullanım istatistikleri",
            "Entegrasyon verileri: yetkilendirme kapsamında erişilen reklam ve katalog verileri",
            "Teknik veriler: IP adresi, tarayıcı türü, cihaz bilgileri, çerez verileri",
          ],
        },
        {
          heading: "Verilerin Kullanım Amaçları",
          paragraphs: ["Toplanan veriler aşağıdaki amaçlarla kullanılır:"],
          list: [
            "Platform hizmetlerinin sunulması, hesabınızın oluşturulması ve yönetilmesi",
            "Trendyol ve Meta entegrasyonlarının kurulması ve sürdürülmesi",
            "Reklam performans raporlarının oluşturulması",
            "Destek taleplerinin yanıtlanması ve müşteri iletişimi",
            "Hizmet kalitesinin ölçülmesi ve geliştirilmesi",
            "Yasal yükümlülüklerin yerine getirilmesi",
          ],
        },
        {
          heading: "Verilerin Paylaşımı",
          paragraphs: [
            "Kişisel verileriniz; açık rızanız bulunan haller, hizmetin gerektirdiği entegrasyonlar (Meta, Trendyol, barındırma ve altyapı sağlayıcıları) ve yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz. Veriler hiçbir koşulda üçüncü taraflara satılmaz.",
          ],
        },
        {
          heading: "Veri Güvenliği",
          paragraphs: [
            "Verileriniz endüstri standardı güvenlik önlemleriyle korunur: tüm bağlantılar SSL/TLS ile şifrelenir, API erişim anahtarları veritabanında AES-256 ile şifreli saklanır, erişimler yetki bazlı olarak sınırlandırılır ve düzenli olarak gözden geçirilir.",
          ],
        },
        {
          heading: "Çerezler",
          paragraphs: [
            "Platform; oturum yönetimi, tercihlerin hatırlanması ve anonim kullanım istatistikleri için çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz; ancak bu durumda Platformun bazı işlevleri çalışmayabilir.",
          ],
        },
        {
          heading: "Saklama Süresi",
          paragraphs: [
            "Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır. Abonelik iptali sonrasında hesap verileri 30 gün içinde anonimleştirilir veya silinir; yasal saklama yükümlülüğüne tabi kayıtlar (fatura vb.) mevzuatta öngörülen süre boyunca muhafaza edilir.",
          ],
        },
        {
          heading: "Haklarınız",
          paragraphs: [
            `6698 sayılı KVKK kapsamındaki haklarınız için KVKK Aydınlatma Metnimizi inceleyebilir, taleplerinizi ${SITE.email} adresine iletebilirsiniz.`,
          ],
        },
        {
          heading: "Değişiklikler",
          paragraphs: [
            "Şirket, işbu politikayı güncelleyebilir. Güncel sürüm her zaman bu sayfada yayımlanır; önemli değişiklikler kayıtlı kullanıcılara ayrıca bildirilir.",
          ],
        },
      ]}
    />
  );
}
