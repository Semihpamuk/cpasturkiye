import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "cpas-kampanyasi-neden-satis-getirmiyor",
  title: "CPAS Kampanyam Neden Satış Getirmiyor? 9 Neden ve Çözümü",
  excerpt:
    "Reklam yayında, bütçe harcanıyor ama sipariş yok. Bu yazıda CPAS kampanyalarında satış gelmemesinin 9 gerçek nedenini ve her birinin nasıl teşhis edilip çözüleceğini anlatıyoruz.",
  date: "2026-08-06",
  category: "Optimizasyon",
  keywords: [
    "CPAS satış gelmiyor",
    "CPAS kampanya sorunu",
    "Meta reklam dönüşüm yok",
    "CPAS ROAS düşük",
    "Trendyol reklam dönüşüm sorunu",
  ],
  content: [
    {
      type: "p",
      text: "Kampanya yayında, gösterim geliyor, tıklama geliyor, bütçe düzenli harcanıyor — ama sipariş yok ya da çok az. Bu tabloda panik kararı vermek (bütçeyi kesmek, kampanyayı silip yeniden kurmak) durumu genellikle kötüleştiriyor. Doğru yaklaşım sırayla teşhis etmek.",
    },
    {
      type: "p",
      text: "Aşağıdaki dokuz nedeni, en sık görülenden başlayarak ve teşhis sırasına göre dizdik. Sırayı bozmayın: ilk üç maddeyi kontrol etmeden dördüncüye geçmek, olmayan bir sorunu çözmeye çalışmak demektir.",
    },

    { type: "h2", text: "Teşhise başlamadan önce toplayacağınız veriler" },
    {
      type: "p",
      text: "Teşhis, elinizde karşılaştırma yapacak veri yoksa tahmine dönüşür. Aşağıdaki altı rakamı aynı tarih aralığı için yan yana koyun; sorunun hangi aşamada olduğunu çoğu zaman bu tablo tek başına söyler.",
    },
    {
      type: "table",
      head: ["Veri", "Nereden alınır"],
      rows: [
        ["Gösterim ve frekans", "Meta reklam paneli"],
        ["Tıklama sayısı ve tıklama oranı", "Meta reklam paneli"],
        ["Meta'da görünen dönüşüm sayısı", "Meta reklam paneli"],
        ["Pazaryeri panelindeki sipariş sayısı", "Satıcı paneli, aynı tarih aralığı"],
        ["Ürün sayfası görüntülenme sayısı", "Satıcı paneli"],
        ["Katalog son senkron tarihi", "Meta Ticaret Yöneticisi"],
      ],
    },
    {
      type: "p",
      text: "Okuma kuralı basit: tıklama düşükse sorun reklam tarafında (kreatif, kitle, bütçe), tıklama normal ama sipariş düşükse sorun ürün sayfası veya katalog tarafında, sipariş var ama Meta'da görünmüyorsa sorun ölçüm tarafındadır. Hangi kutuya düştüğünüzü bilmeden yapılan her müdahale rastgeledir.",
    },

    { type: "h2", text: "1. Satış var ama veri akışı kopuk" },
    {
      type: "p",
      text: "İlk kontrol edilecek şey budur ve şaşırtıcı sıklıkta çıkar. Kampanya gerçekten satış getiriyordur; Meta bunu göremediği için panelde sıfır görünür.",
    },
    {
      type: "p",
      text: "Teşhis: pazaryeri panelinizdeki sipariş sayısıyla Meta'daki dönüşüm sayısını aynı tarih aralığında karşılaştırın. Pazaryerinde artış varken Meta'da yoksa sorun satışta değil ölçümdedir. Çözüm: katalog ve olay entegrasyonunu yeniden doğrulayın, test siparişiyle akışı kontrol edin.",
    },
    {
      type: "callout",
      title: "Neden bu kadar tehlikeli?",
      text: "Veri akmadığında algoritma da öğrenemez. Yani ölçüm sorunu bir süre sonra gerçek performans sorununa dönüşür. Bu yüzden listede birinci sıradadır.",
    },

    { type: "h2", text: "2. Öğrenme aşaması henüz bitmedi" },
    {
      type: "p",
      text: "İlk 7–14 gün algoritmanın veri topladığı dönemdir ve bu dönemde performans dalgalıdır. Üçüncü günde “çalışmıyor” hükmü vermek en yaygın hatadır.",
    },
    {
      type: "p",
      text: "Teşhis: reklam seti durumunda “öğreniyor” ibaresi var mı, haftalık dönüşüm sayısı 50'ye ulaştı mı? Çözüm: dokunmayın. Bu dönemde yapılan her bütçe veya hedefleme değişikliği öğrenmeyi sıfırlar ve süreci baştan başlatır.",
    },

    { type: "h2", text: "3. Katalog senkronu kırılmış" },
    {
      type: "p",
      text: "Reklam, stokta olmayan ya da fiyatı değişmiş ürünleri gösteriyordur. Kullanıcı tıklar, ürünü bulamaz veya farklı fiyat görür, çıkar. Tıklama parası harcanır, dönüşüm gelmez.",
    },
    {
      type: "p",
      text: "Teşhis: katalogdaki son senkron tarihine bakın ve rastgele 10 ürünün fiyat/stok bilgisini panelinizle karşılaştırın. Çözüm: senkronu yeniden kurun, stok dışı ürünleri setlerden çıkarın. Bu kontrolü haftalık rutine alın — senkron kırıldığında sistem hata vermez, sessizce eski veriyle yayına devam eder.",
    },

    { type: "h2", text: "4. Ürün sayfası dönüştürmüyor" },
    {
      type: "p",
      text: "Reklam işini yapıyordur: kullanıcıyı ürün sayfasına getiriyordur. Sorun sayfadadır.",
    },
    {
      type: "ul",
      items: [
        "Görseller düşük çözünürlüklü, kolajlı veya tek açılı",
        "Yorum sayısı düşük ya da puan ortalaması zayıf",
        "Kargo süresi rakiplere göre uzun",
        "Fiyat, aynı ürünü satan diğer satıcılardan yüksek",
        "Ürün açıklaması eksik; beden, malzeme, ölçü bilgisi yok",
      ],
    },
    {
      type: "p",
      text: "Teşhis: tıklama oranı normal ama dönüşüm oranı düşükse sorun büyük olasılıkla buradadır. Çözüm: reklam bütçesini artırmadan önce ürün sayfasını düzeltin. Dönüşmeyen bir sayfaya daha çok trafik göndermek, sadece daha hızlı para yakar.",
    },

    { type: "h2", text: "5. Kitle aşırı daraltılmış" },
    {
      type: "p",
      text: "Sekiz ilgi alanı, dar yaş aralığı ve şehir kısıtıyla kurulmuş bir reklam seti mantıklı görünür ama algoritmanın öğrenebileceği örnek sayısını düşürür.",
    },
    {
      type: "p",
      text: "Teşhis: tahmini erişim çok küçükse ve frekans hızla 3'ün üzerine çıkıyorsa kitle dardır. Çözüm: prospecting kampanyalarında yaş/cinsiyet dışında hedefleme kullanmayın; ürün kataloğu zaten güçlü bir sinyaldir.",
    },

    { type: "h2", text: "6. Bütçe eşiğin altında" },
    {
      type: "p",
      text: "Günlük bütçe, sipariş başına maliyetinizin birkaç katı değilse algoritma günde yeterli dönüşüm üretemez ve öğrenme aşaması hiç bitmez.",
    },
    {
      type: "p",
      text: "Teşhis: haftalık dönüşüm sayınız 50'nin çok altındaysa ve bütçe artırma imkânınız yoksa, kampanya sayısını azaltıp bütçeyi tek kampanyada yoğunlaştırın. Beş kampanyaya bölünmüş 20.000 ₺, tek kampanyadaki 20.000 ₺'den belirgin biçimde kötü çalışır.",
    },

    { type: "h2", text: "7. Kreatif yorulmuş" },
    {
      type: "p",
      text: "Başlangıçta iyi çalışan kampanya, birkaç hafta sonra düşüşe geçer. Neden genellikle kitlenin aynı görseli defalarca görmesidir.",
    },
    {
      type: "p",
      text: "Teşhis: frekans 3'ün üzerindeyse ve tıklama oranı zaman içinde düşüyorsa kreatif yorgunluğu vardır. Çözüm: görsel ve metinleri yenileyin, kitleyi genişletin. Katalog reklamlarında da kart tasarımı, çerçeve ve fiyat rozeti gibi öğeler yenilenebilir.",
    },

    { type: "h2", text: "8. Yeniden pazarlama katmanı kurulmamış" },
    {
      type: "p",
      text: "Tek bir prospecting kampanyasıyla çalışan hesaplar, en kolay dönüşümü kaçırır: ürünü görmüş ama almamış kullanıcı.",
    },
    {
      type: "p",
      text: "Teşhis: hesapta sepet terk ve ürün görüntüleme kitlelerine ayrı kampanya var mı? Yoksa toplam ROAS'ın belirgin biçimde altındasınız demektir. Çözüm: sepete ekleyip almayan (7 gün), ürün görüntüleyen (14 gün) ve geçmiş müşteri (180 gün) katmanlarını ayrı kampanyalar olarak kurun.",
    },

    { type: "h2", text: "9. Ürün-kitle uyumsuzluğu" },
    {
      type: "p",
      text: "En az konuşulan ama en gerçek neden. Bazı ürünler keşif kanalında satmaz: kullanıcı o ürünü ancak ihtiyacı doğduğunda arar, Instagram akışında görünce satın almaz.",
    },
    {
      type: "p",
      text: "Teşhis: sekiz maddeyi de temizlediyseniz ve dönüşüm hâlâ yoksa, ürün kategorinizin keşif kanalına uygunluğunu sorgulayın. Yedek parça, teknik sarf malzemesi, standart beyaz eşya gibi kategoriler tipik olarak arama kanalında iyi, keşif kanalında zayıf çalışır. Çözüm: bütçeyi görsel olarak güçlü ve dürtüsel satın almaya açık ürünlere kaydırın; kalan kategorilerde platform içi reklama ağırlık verin.",
    },

    { type: "h2", text: "Sorun düzeldikten sonra: toparlanma dönemi" },
    {
      type: "p",
      text: "Nedeni bulup düzelttiğinizde performans ertesi gün eski seviyesine dönmez. Kampanya, sorun sürerken kötü sinyal biriktirmiştir ve algoritmanın bunu telafi etmesi zaman alır.",
    },
    {
      type: "p",
      text: "Beklenmesi gereken tipik toparlanma süresi 5–10 gündür. Bu dönemde iki hata sık yapılır: düzeltmenin işe yaramadığını düşünüp yeni bir müdahaleye girişmek, ya da kaybı telafi etmek için bütçeyi aniden yükseltmek. İkisi de öğrenmeyi tekrar sıfırlar ve toparlanmayı uzatır.",
    },
    {
      type: "p",
      text: "Ölçüm hatası kaynaklı bir sorunu düzelttiyseniz bir ek nokta daha var: geçmiş dönem verisi kalıcı olarak eksik kalır, geriye dönük dolmaz. Yani düzeltme öncesi haftaların raporunu gerçek performans olarak okumayın; kıyaslama tabanınızı düzeltme tarihinden sonrasına kurun.",
    },

    { type: "h2", text: "Teşhis ederken yapılmaması gerekenler" },
    {
      type: "p",
      text: "Sorunun nedeni kadar, teşhis sırasında verilen refleks kararlar da zarar veriyor. Aşağıdakiler yaygın ve hepsi durumu kötüleştiriyor.",
    },
    {
      type: "ul",
      items: [
        "Kampanyayı silip yeniden kurmak: Biriken öğrenme verisini sıfırlar. Sorun kurulumda değilse yeni kampanya aynı noktaya, sadece iki hafta geç varır.",
        "Aynı gün birden fazla değişiklik yapmak: Hangi müdahalenin işe yaradığını bir daha ölçemezsiniz. Tek seferde tek değişiklik, sonra 4–5 gün bekleme.",
        "Bütçeyi aniden yarıya indirmek: Günlük dönüşüm sayısı öğrenme eşiğinin altına düşer ve kampanya kalıcı olarak öğrenme aşamasına takılır.",
        "Hedeflemeyi daraltmak: Sonuç gelmeyince kitleyi daraltmak sezgisel bir hamledir ama algoritmanın öğrenebileceği örnek sayısını düşürerek durumu kötüleştirir.",
        "Yeni kreatifleri aynı anda yüklemek: Beş görseli birden devreye almak, hangisinin çalıştığını ölçmeyi imkânsız kılar ve bütçeyi böler.",
      ],
    },
    {
      type: "callout",
      title: "Altın kural",
      text: "Bir değişiklik yapın, 4–5 gün bekleyin, ölçün. CPAS'te sabırsızlık, yanlış kararlardan daha çok bütçe yakar — çünkü her acele müdahale, öğrenme saatini sıfırlar.",
    },

    { type: "h2", text: "Teşhis sırası — özet" },
    {
      type: "table",
      head: ["Sıra", "Kontrol", "Belirti"],
      rows: [
        ["1", "Veri akışı", "Panelde sipariş var, Meta'da yok"],
        ["2", "Öğrenme aşaması", "Kampanya 14 günden yeni"],
        ["3", "Katalog senkronu", "Son senkron eski, fiyat/stok tutmuyor"],
        ["4", "Ürün sayfası", "Tıklama normal, dönüşüm düşük"],
        ["5", "Kitle genişliği", "Erişim küçük, frekans hızla yükseliyor"],
        ["6", "Bütçe eşiği", "Haftalık dönüşüm 50'nin çok altında"],
        ["7", "Kreatif yorgunluğu", "Frekans 3+, tıklama oranı düşüyor"],
        ["8", "Yeniden pazarlama", "Sadece prospecting kampanyası var"],
        ["9", "Ürün-kitle uyumu", "Diğer sekizi temiz, sonuç yok"],
      ],
    },
    {
      type: "p",
      text: "Bu sırayı takip eden bir teşhis genellikle ilk üç maddede sonuçlanır. Kendi hesabınızda kaybolduysanız CPAS Türkiye'nin ücretsiz ön değerlendirmesiyle mevcut kurulumunuzu inceleyip hangi maddede takıldığınızı söyleyebiliriz — sorun kurulumda değilse bunu da açıkça belirtiriz.",
    },
  ],
  faq: [
    {
      question: "CPAS kampanyam gösterim alıyor ama satış yok, ilk ne kontrol etmeliyim?",
      answer:
        "Veri akışını. Pazaryeri panelinizdeki sipariş sayısıyla Meta'daki dönüşüm sayısını aynı tarih aralığında karşılaştırın. Pazaryerinde satış varken Meta'da görünmüyorsa sorun satışta değil ölçümdedir ve önce o düzeltilmelidir.",
    },
    {
      question: "Kampanyayı kaç gün sonra değerlendirmeliyim?",
      answer:
        "En az 14 gün. İlk 7–14 gün öğrenme aşamasıdır ve performans dalgalıdır. Bu dönemde yapılan bütçe veya hedefleme değişiklikleri öğrenmeyi sıfırlar; anlamlı değerlendirme için haftalık dönüşüm sayısının 50'ye ulaşmasını bekleyin.",
    },
    {
      question: "Tıklama geliyor ama sipariş gelmiyor, neden?",
      answer:
        "Genellikle ürün sayfası kaynaklıdır: görsel kalitesi, yorum sayısı, fiyat rekabeti veya kargo süresi. İkinci olasılık katalog senkronunun kırılmasıdır — kullanıcı stokta olmayan veya fiyatı değişmiş bir ürüne gidiyordur.",
    },
    {
      question: "Bütçeyi artırmak sorunu çözer mi?",
      answer:
        "Yalnızca sorun bütçe eşiğiyse. Ürün sayfası dönüştürmüyorsa veya katalog senkronu kırıksa bütçe artışı sadece daha hızlı para yakar. Bütçe artırmadan önce teşhis sırasındaki ilk dört maddeyi temizleyin.",
    },
  ],
};

export default post;
