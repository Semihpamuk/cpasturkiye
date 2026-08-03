import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "CPAS Türkiye (cpasturkiye.com) çerez kullanımı ve tarayıcı ayarlarıyla yönetimi.",
  alternates: { canonical: "/cerez-politikasi" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      updatedAt="3 Ağustos 2026"
      intro={`İşbu Çerez Politikası, ${SITE.company} tarafından işletilen ${SITE.domain} alan adlı web sitesinde çerezlerin nasıl kullanıldığını açıklar. Politika, Gizlilik Politikası ve KVKK Aydınlatma Metni ile birlikte değerlendirilmelidir.`}
      sections={[
        {
          heading: "Çerez Nedir?",
          paragraphs: [
            "Çerez (cookie), ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır. Çerezler; oturumun sürdürülmesi, güvenliğin sağlanması, tercihlerin hatırlanması veya ziyaretçi davranışının ölçülmesi gibi amaçlarla kullanılabilir.",
          ],
        },
        {
          heading: "Sitemizde Kullanılan Çerezler",
          paragraphs: [
            "Sitemizde yalnızca hizmetin çalışması için gerekli olan zorunlu çerezler kullanılmaktadır. Ziyaretçi davranışını izleyen reklam, pazarlama veya profilleme çerezleri kullanılmamaktadır.",
          ],
          list: [
            "Yönetim paneli oturum çerezi: yalnızca yetkili yöneticiler panele giriş yaptığında oluşturulur; imzalı bir oturum bilgisi taşır ve süre sonunda geçersiz hale gelir. Site ziyaretçileri için oluşturulmaz.",
            "Site ziyaretçileri için reklam, hedefleme veya profilleme amaçlı çerez kullanılmaz.",
            "Üçüncü taraf izleme ve ölçümleme araçları (ör. reklam pikselleri, ısı haritası araçları) sitemizde yer almaz.",
          ],
        },
        {
          heading: "Ödeme Sırasında Üçüncü Taraf Çerezleri",
          paragraphs: [
            "Kart ile ödeme adımında ödeme formu, lisanslı ödeme kuruluşu iyzico altyapısı üzerinden sunulur. Bu adımda ödemenin güvenli şekilde tamamlanabilmesi için iyzico kendi zorunlu çerezlerini kullanabilir. Söz konusu çerezler ödeme kuruluşunun kendi politikalarına tabidir; kart bilgileriniz tarafımızca görüntülenmez ve saklanmaz.",
          ],
        },
        {
          heading: "Açık Rıza Gerekmemesi",
          paragraphs: [
            "Kişisel Verileri Koruma Kurulu rehberleri uyarınca, yalnızca hizmetin sunulabilmesi için zorunlu olan çerezler açık rıza olmaksızın kullanılabilir. Sitemizde bu kapsam dışında çerez kullanılmadığından ayrıca çerez onay penceresi gösterilmemektedir. İleride analitik veya pazarlama çerezleri kullanılması halinde bu politika güncellenecek ve gerekli açık rıza mekanizması sunulacaktır.",
          ],
        },
        {
          heading: "Çerezleri Yönetme ve Silme",
          paragraphs: [
            "Tarayıcınızın ayarlar bölümünden çerezleri görüntüleyebilir, silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemeniz halinde yönetim paneline giriş gibi işlevler çalışmayabilir; sitenin bilgi amaçlı sayfalarını görüntülemeniz ise etkilenmez.",
          ],
        },
        {
          heading: "Haklarınız ve İletişim",
          paragraphs: [
            `Kişisel verilerinize ilişkin KVKK kapsamındaki haklarınız ve başvuru yöntemi KVKK Aydınlatma Metninde açıklanmıştır. Çerez kullanımına dair sorularınız için ${SITE.email} adresinden bize ulaşabilirsiniz.`,
          ],
        },
      ]}
    />
  );
}
