import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Jale (cpasturkiye.com) 6698 sayılı KVKK kapsamında aydınlatma metni.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="Kişisel Verilerin Korunması Hakkında Aydınlatma Metni"
      updatedAt="10 Haziran 2026"
      intro={`İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla hareket eden ${SITE.company} ("Şirket") tarafından kişisel verilerinizin işlenmesine ilişkin olarak sizleri bilgilendirmek amacıyla hazırlanmıştır.`}
      sections={[
        {
          heading: "Veri Sorumlusu",
          paragraphs: [
            `Kişisel verileriniz, veri sorumlusu sıfatıyla ${SITE.company} tarafından aşağıda açıklanan kapsamda işlenmektedir. İletişim: ${SITE.email}`,
          ],
        },
        {
          heading: "İşlenen Kişisel Veriler",
          paragraphs: [""],
          list: [
            "Kimlik verileri: ad, soyad",
            "İletişim verileri: e-posta adresi, telefon numarası, adres",
            "Müşteri işlem verileri: abonelik ve fatura bilgileri, talep ve şikayet kayıtları",
            "İşlem güvenliği verileri: IP adresi, oturum kayıtları, log kayıtları",
            "Pazarlama verileri: açık rızanız olması halinde iletişim tercihleri",
          ],
        },
        {
          heading: "Kişisel Verilerin İşlenme Amaçları",
          paragraphs: ["Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:"],
          list: [
            "Sözleşmenin kurulması ve ifası (hizmetin sunulması, hesap yönetimi)",
            "Finans ve muhasebe işlerinin yürütülmesi (faturalandırma)",
            "Müşteri ilişkileri yönetimi ve destek süreçlerinin yürütülmesi",
            "Bilgi güvenliği süreçlerinin yürütülmesi",
            "Yetkili kişi, kurum ve kuruluşlara bilgi verilmesi",
            "Açık rıza bulunması halinde pazarlama ve tanıtım faaliyetleri",
          ],
        },
        {
          heading: "İşlemenin Hukuki Sebepleri",
          paragraphs: [
            "Kişisel verileriniz; KVKK md. 5/2 kapsamında 'sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması', 'veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması', 'ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için zorunlu olması' hukuki sebeplerine; pazarlama faaliyetleri bakımından ise açık rızanıza dayanılarak işlenmektedir.",
          ],
        },
        {
          heading: "Kişisel Verilerin Aktarılması",
          paragraphs: [
            "Kişisel verileriniz; hizmetin sunulabilmesi için iş birliği yapılan teknoloji sağlayıcılarına (barındırma, bulut altyapı, ödeme kuruluşları), entegrasyon kapsamında Meta Platforms ve Trendyol'a, hukuki yükümlülükler kapsamında yetkili kamu kurum ve kuruluşlarına KVKK md. 8 ve 9'da öngörülen şartlara uygun olarak aktarılabilir. Yurt dışına veri aktarımı, KVKK'da öngörülen güvencelere uygun şekilde gerçekleştirilir.",
          ],
        },
        {
          heading: "Toplama Yöntemi",
          paragraphs: [
            "Kişisel verileriniz; web sitesi formları, üyelik ve abonelik işlemleri, e-posta ve telefon iletişimi, platform kullanımı ve çerezler aracılığıyla tamamen veya kısmen otomatik yollarla toplanmaktadır.",
          ],
        },
        {
          heading: "KVKK Madde 11 Kapsamındaki Haklarınız",
          paragraphs: ["KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:"],
          list: [
            "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
            "İşlenmişse buna ilişkin bilgi talep etme",
            "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
            "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
            "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
            "KVKK md. 7 çerçevesinde silinmesini veya yok edilmesini isteme",
            "Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme",
            "Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
            "Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme",
          ],
        },
        {
          heading: "Başvuru Yöntemi",
          paragraphs: [
            `Haklarınıza ilişkin taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun olarak yazılı şekilde veya kayıtlı elektronik posta (KEP), güvenli elektronik imza ya da ${SITE.email} adresine e-posta yoluyla iletebilirsiniz. Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
          ],
        },
      ]}
    />
  );
}
