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
      updatedAt="6 Ağustos 2026"
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
            "Sitemizde hizmetin çalışması için gerekli olan zorunlu çerezler ile ziyaret istatistiklerinin ölçülmesi amacıyla analitik çerezler kullanılmaktadır. Analitik çerezler yalnızca onayınız halinde çalışır. Ziyaretçi davranışını izleyen reklam, pazarlama veya profilleme çerezleri kullanılmamaktadır.",
          ],
          list: [
            "Yönetim paneli oturum çerezi (zorunlu): yalnızca yetkili yöneticiler panele giriş yaptığında oluşturulur; imzalı bir oturum bilgisi taşır ve süre sonunda geçersiz hale gelir. Site ziyaretçileri için oluşturulmaz.",
            "Çerez tercihi kaydı (zorunlu): çerez onay bandındaki seçiminiz, her ziyarette tekrar sorulmaması için tarayıcınızın yerel deposunda saklanır.",
            "_ga (analitik, azami 2 yıl): Google Analytics 4 tarafından ziyaretçilerin birbirinden ayırt edilmesi amacıyla kullanılır. Sağlayıcı: Google Ireland Limited.",
            "_ga_<ölçüm-kimliği> (analitik, azami 2 yıl): Google Analytics 4 tarafından oturum durumunun sürdürülmesi amacıyla kullanılır. Sağlayıcı: Google Ireland Limited.",
            "Site ziyaretçileri için reklam, hedefleme veya profilleme amaçlı çerez kullanılmaz; Google Analytics'in reklam sinyalleri (ad_storage, ad_user_data, ad_personalization) tarafımızca kapalı tutulmaktadır.",
          ],
        },
        {
          heading: "Analitik Çerezler ve Yurt Dışına Aktarım",
          paragraphs: [
            "Analitik ölçüm, Google Ireland Limited tarafından sunulan Google Analytics 4 hizmeti ile yapılmaktadır. Bu kapsamda ziyaret edilen sayfa, yaklaşık konum, tarayıcı ve cihaz bilgisi gibi veriler ile çerez üzerinden atanan rastgele bir tanımlayıcı işlenir. Adınız, e-posta adresiniz, telefonunuz veya fatura bilgileriniz gibi sizi doğrudan tanımlayan veriler Google Analytics'e aktarılmaz.",
            "Söz konusu veriler hizmetin doğası gereği yurt dışında bulunan sunucularda işlenebilmektedir. Analitik çerezleri onaylamanız halinde bu aktarım açık rızanıza dayanılarak gerçekleştirilir; onay vermediğiniz takdirde analitik çerez oluşturulmaz.",
          ],
        },
        {
          heading: "Ödeme Sırasında Üçüncü Taraf Çerezleri",
          paragraphs: [
            "Kart ile ödeme adımında ödeme formu, lisanslı ödeme kuruluşu iyzico altyapısı üzerinden sunulur. Bu adımda ödemenin güvenli şekilde tamamlanabilmesi için iyzico kendi zorunlu çerezlerini kullanabilir. Söz konusu çerezler ödeme kuruluşunun kendi politikalarına tabidir; kart bilgileriniz tarafımızca görüntülenmez ve saklanmaz.",
          ],
        },
        {
          heading: "Çerez Tercihleriniz",
          paragraphs: [
            "Kişisel Verileri Koruma Kurulu rehberleri uyarınca, yalnızca hizmetin sunulabilmesi için zorunlu olan çerezler açık rıza olmaksızın kullanılabilir. Analitik çerezler bu kapsamda değildir; bu nedenle siteye ilk girişinizde bir çerez onay bandı gösterilir ve analitik çerezler yalnızca \"Kabul et\" seçeneğini işaretlemeniz halinde çalıştırılır.",
            "Onay vermediğiniz sürece _ga ve _ga_<ölçüm-kimliği> çerezleri tarayıcınızda oluşturulmaz. Tercihiniz tarayıcınızın yerel deposunda saklanır ve sonraki ziyaretlerinizde band tekrar gösterilmez. Tercihinizi değiştirmek isterseniz tarayıcınızın site verilerini (çerezler ve yerel depolama) temizlemeniz yeterlidir; band yeniden gösterilir ve mevcut analitik çerezler silinir.",
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
