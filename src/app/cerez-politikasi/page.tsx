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
            "Sitemizde hizmetin çalışması için gerekli olan zorunlu çerezler ile ziyaret istatistiklerinin ölçülmesi amacıyla analitik çerezler ve reklam performansının ölçülmesi amacıyla reklam (pazarlama) çerezleri kullanılmaktadır. Analitik ve reklam çerezleri yalnızca onayınız halinde çalışır; onay vermediğiniz sürece hiçbiri oluşturulmaz.",
          ],
          list: [
            "Yönetim paneli oturum çerezi (zorunlu): yalnızca yetkili yöneticiler panele giriş yaptığında oluşturulur; imzalı bir oturum bilgisi taşır ve süre sonunda geçersiz hale gelir. Site ziyaretçileri için oluşturulmaz.",
            "Çerez tercihi kaydı (zorunlu): çerez onay bandındaki seçiminiz, her ziyarette tekrar sorulmaması için tarayıcınızın yerel deposunda saklanır.",
            "_ga (analitik, azami 2 yıl): Google Analytics 4 tarafından ziyaretçilerin birbirinden ayırt edilmesi amacıyla kullanılır. Sağlayıcı: Google Ireland Limited.",
            "_ga_<ölçüm-kimliği> (analitik, azami 2 yıl): Google Analytics 4 tarafından oturum durumunun sürdürülmesi amacıyla kullanılır. Sağlayıcı: Google Ireland Limited.",
            "_fbp (reklam, azami 3 ay): Meta Pixel tarafından tarayıcınızın Meta (Facebook/Instagram) reklam sistemleriyle eşleştirilmesi ve reklam performansının ölçülmesi amacıyla kullanılır. Sağlayıcı: Meta Platforms Ireland Limited.",
            "Google Analytics'in reklam sinyalleri (ad_storage, ad_user_data, ad_personalization) tarafımızca ayrıca kapalı tutulmaktadır; Google üzerinden reklam/hedefleme amaçlı çerez kullanılmaz.",
          ],
        },
        {
          heading: "Analitik ve Reklam Çerezleri ile Yurt Dışına Aktarım",
          paragraphs: [
            "Analitik ölçüm, Google Ireland Limited tarafından sunulan Google Analytics 4 hizmeti ile yapılmaktadır. Bu kapsamda ziyaret edilen sayfa, yaklaşık konum, tarayıcı ve cihaz bilgisi gibi veriler ile çerez üzerinden atanan rastgele bir tanımlayıcı işlenir.",
            "Reklam performansı ölçümü, Meta Platforms Ireland Limited tarafından sunulan Meta Pixel hizmeti ile yapılmaktadır. Bu kapsamda ziyaret edilen sayfa, tarayıcı ve cihaz bilgisi ile çerez üzerinden atanan rastgele bir tanımlayıcı işlenir; hâlihazırda yalnızca sayfa görüntüleme (PageView) olayı gönderilmektedir.",
            "Her iki araç için de adınız, e-posta adresiniz, telefonunuz veya fatura bilgileriniz gibi sizi doğrudan tanımlayan veriler tarafımızca aktarılmaz. Söz konusu veriler hizmetin doğası gereği yurt dışında bulunan sunucularda işlenebilmektedir; bu aktarım, ilgili çerez kategorisini onaylamanız halinde açık rızanıza dayanılarak gerçekleştirilir, onay vermediğiniz takdirde ilgili çerez hiç oluşturulmaz.",
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
            "Kişisel Verileri Koruma Kurulu rehberleri uyarınca, yalnızca hizmetin sunulabilmesi için zorunlu olan çerezler açık rıza olmaksızın kullanılabilir. Analitik ve reklam çerezleri bu kapsamda değildir; bu nedenle siteye ilk girişinizde bir çerez onay bandı gösterilir ve bu çerezler yalnızca \"Kabul et\" seçeneğini işaretlemeniz halinde, tek bir onayla birlikte çalıştırılır.",
            "Onay vermediğiniz sürece _ga, _ga_<ölçüm-kimliği> ve _fbp çerezleri tarayıcınızda oluşturulmaz. Tercihiniz tarayıcınızın yerel deposunda saklanır ve sonraki ziyaretlerinizde band tekrar gösterilmez.",
            "Verdiğiniz onayı dilediğiniz zaman geri alabilirsiniz: sayfanın altındaki \"Yasal\" başlığı içinde yer alan \"Çerez Tercihleri\" bağlantısına tıklamanız yeterlidir. Bu işlem kayıtlı tercihinizi sıfırlar, analitik ve reklam ölçümünü durdurur ve onay bandını yeniden gösterir. Daha önce oluşturulmuş çerezler tarayıcınızda kalmaya devam eder; onay geri alındığı sürece okunmaz ve yeni çerez oluşturulmaz. Bu çerezleri tamamen kaldırmak isterseniz tarayıcınızın ayarlarından site verilerini (çerezler ve yerel depolama) temizleyebilirsiniz.",
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
