import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "cpas-nedir-trendyol-saticilari-icin-rehber",
  title: "CPAS Nedir? Trendyol Satıcıları İçin Eksiksiz Rehber (2026)",
  excerpt:
    "CPAS, Meta'nın pazaryeri satıcılarını Facebook ve Instagram reklamlarıyla buluşturan ortak reklam modelidir. Nasıl çalışır, kimler kullanabilir, ne kadar bütçe ister? Trendyol satıcısı gözünden sade bir rehber.",
  date: "2026-05-12",
  updated: "2026-08-06",
  category: "Rehber",
  keywords: [
    "CPAS nedir",
    "CPAS ne demek",
    "Trendyol CPAS",
    "Collaborative Ads",
    "Meta CPAS",
    "pazaryeri Meta reklamı",
    "Trendyol Facebook reklamı",
  ],
  content: [
    {
      type: "p",
      text: "Trendyol'da satış yapıyorsanız reklam bütçenizin neredeyse tamamı büyük ihtimalle platform içinde harcanıyor: ürün öne çıkarma, mağaza reklamı, kategori sponsorluğu. Bu kanalların hepsinin ortak bir tavanı var — yalnızca o anda Trendyol'da gezinen kullanıcıya ulaşabiliyorsunuz. CPAS, tam olarak bu tavanı kaldırmak için var.",
    },
    {
      type: "p",
      text: "Bu rehberde CPAS'in ne olduğunu, teknik olarak nasıl çalıştığını, hangi mağazalar için mantıklı olduğunu ve sahada en sık hangi hataların bütçe yaktığını tek tek anlatıyoruz. Amacımız sözlük tanımı vermek değil; okuduktan sonra kendi mağazanız için karar verebilecek duruma gelmeniz.",
    },

    { type: "h2", text: "CPAS nedir, açılımı ne?" },
    {
      type: "p",
      text: "CPAS, Collaborative Performance Advertising Solution ifadesinin kısaltmasıdır. Meta'nın (Facebook ve Instagram'ın sahibi) pazaryerleriyle o pazaryerinde satan markaları aynı reklam hesabında buluşturan çözümüdür. Türkçede genellikle “iş birliğine dayalı performans reklamları” ya da kısaca “ortak reklam modeli” olarak geçer. Meta'nın kendi dokümantasyonunda son yıllarda “Collaborative Ads” adıyla da anılıyor — ikisi aynı şeydir.",
    },
    {
      type: "p",
      text: "Modelin çözdüğü problem şu: siz Trendyol'da satıyorsunuz ama Trendyol'un sitesine kendi Meta pikselinizi kuramazsınız. Piksel olmayınca Meta, reklamınızın satışa dönüp dönmediğini göremez. Göremeyince de optimize edemez. CPAS bu kopukluğu, pazaryerinin sipariş verisini Meta'ya iletmesiyle kapatır.",
    },
    {
      type: "callout",
      title: "Tek cümlelik özet",
      text: "CPAS, Trendyol'daki ürün kataloğunuzu Meta reklam hesabınıza bağlayan ve Facebook/Instagram reklamlarınızın getirdiği Trendyol siparişlerini birebir eşleştiren resmi entegrasyondur.",
    },

    { type: "h2", text: "CPAS teknik olarak nasıl çalışır?" },
    {
      type: "p",
      text: "Süreç dışarıdan bakınca sihirli görünür, aslında dört bileşenden oluşur. Bu dördünün de doğru kurulması gerekir; biri eksik kalırsa sistem çalışır gibi görünüp yanlış veri üretir.",
    },
    {
      type: "ol",
      items: [
        "Katalog aktarımı: Trendyol, mağazanızdaki ürünleri (başlık, görsel, fiyat, stok durumu, ürün linki) bir ürün feed'i olarak Meta'ya aktarır. Bu feed günlük güncellenir; stoğu biten ürün reklamdan otomatik düşer.",
        "Katalog segmenti: Meta tarafında size özel bir katalog segmenti açılır. Trendyol'un dev kataloğunun içinden yalnızca sizin ürünleriniz izole edilir — rakiplerinizin ürünlerini reklam veremezsiniz, onlar da sizinkini veremez.",
        "Olay (event) paylaşımı: Trendyol'daki görüntüleme, sepete ekleme ve satın alma olayları Meta'ya iletilir. Yeniden pazarlama kitlelerinizin hammaddesi budur.",
        "Dönüşüm eşleştirmesi: Reklamınıza tıklayan kullanıcı Trendyol'da satın aldığında, sipariş ilgili reklam setiyle eşleştirilir. ROAS'ı tahminle değil gerçek ciroyla görürsünüz.",
      ],
    },
    {
      type: "p",
      text: "Kritik nokta dördüncü maddede. Klasik Meta reklamlarında dönüşüm, kendi sitenize kurduğunuz pikselin modellemesiyle tahmin edilir; iOS gizlilik değişikliklerinden sonra bu tahmin ciddi biçimde bulanıklaştı. CPAS'te ise veri kaynağı pazaryerinin kendi sipariş kaydıdır. “Bu kampanya bu ay 240 sipariş getirdi” cümlesini modelleme değil muhasebe olarak söylersiniz.",
    },

    { type: "h2", text: "CPAS ile normal Meta reklamı arasındaki fark" },
    {
      type: "table",
      head: ["Kriter", "Klasik Meta reklamı", "CPAS"],
      rows: [
        ["Kendi web siteniz", "Zorunlu", "Gerekmez"],
        ["Dönüşüm ölçümü", "Piksel + modelleme (tahmini)", "Pazaryeri sipariş verisi (birebir)"],
        ["Trafik nereye gider", "Kendi siteniz", "Trendyol ürün sayfanız"],
        ["Ödeme altyapısı", "Sizin kurmanız gerekir", "Trendyol'un altyapısı"],
        ["Katalog kaynağı", "Kendi ürün feed'iniz", "Trendyol ürün feed'i (otomatik)"],
        ["Kurulum karmaşıklığı", "Orta", "Yüksek (yetkilendirme zinciri var)"],
      ],
    },
    {
      type: "p",
      text: "Tablodaki en önemli satır ilki. Kendi e-ticaret siteniz yoksa klasik Meta reklamı sizin için pratikte kapalıdır — reklamı verirsiniz ama kullanıcıyı yönlendirecek dönüşüm noktanız olmaz. CPAS, site kurmadan Meta'nın kitlesine erişmenin tek resmi yoludur.",
    },

    { type: "h2", text: "Kimler CPAS kullanabilir? Ön koşullar" },
    {
      type: "p",
      text: "Herkes başvurabilir ama herkes için mantıklı değil. İkisini ayırmak lazım: teknik uygunluk ve ekonomik uygunluk.",
    },
    { type: "h3", text: "Teknik ön koşullar" },
    {
      type: "ul",
      items: [
        "Trendyol'da aktif ve onaylı bir satıcı hesabı",
        "Trendyol Satıcı Paneli üzerinden alınmış CPAS reklam yetkisi",
        "Doğrulanmış bir Meta Business Manager hesabı",
        "Ödeme yöntemi tanımlı bir Meta reklam hesabı",
        "Marka tescili veya yetkili satıcı belgesi (bazı kategorilerde isteniyor)",
      ],
    },
    { type: "h3", text: "Ekonomik ön koşullar" },
    {
      type: "ul",
      items: [
        "Son 30 günde en az ~100 sipariş: Meta'nın optimizasyon algoritması öğrenme aşamasını tamamlamak için haftalık dönüşüm sinyaline ihtiyaç duyar. Sinyal azsa algoritma öğrenemez, bütçe rastgele harcanır.",
        "Reklam sonrası kâr marjı: Kampanyalar tipik olarak 4–8 ROAS bandında oturur. Ürün marjınız bu bantta kâr bırakmıyorsa CPAS ciroyu artırır ama kârı artırmaz.",
        "En az 10–20 aktif ürün: Dinamik katalog reklamları Meta'nın en güçlü formatıdır ve seçim yapabileceği bir havuz ister.",
        "Aylık en az 25.000–30.000 ₺ reklam bütçesi: Bunun altındaki bütçelerde günlük harcama, öğrenme aşamasını tamamlayacak hıza ulaşmaz.",
      ],
    },
    {
      type: "p",
      text: "Bu eşiklerin altındaysanız yapılacak şey CPAS'i zorlamak değil, önce Trendyol içi reklamlarla sipariş hacmini büyütmektir. Erken başlayan mağazaların çoğu, öğrenme aşamasını tamamlayamadan bütçesi bitmiş ve “CPAS işe yaramıyor” sonucuna varmış mağazalardır.",
    },

    { type: "h2", text: "Kurulum süreci adım adım" },
    {
      type: "ol",
      items: [
        "Trendyol Satıcı Paneli'nden CPAS reklam yetkilendirme talebi açılır. Onay genellikle 2–5 iş günü sürer.",
        "Meta Business Manager hesabı kurulur veya mevcut hesap doğrulanır. İşletme doğrulaması (business verification) yapılmamışsa süreç burada takılır — vergi levhası ve faaliyet belgesi hazır olsun.",
        "Trendyol'un paylaştığı katalog segmenti, Meta Business Manager'daki Ticaret Yöneticisi'ne bağlanır.",
        "Kampanya mimarisi kurulur: geniş kitle prospecting, ürün görüntüleyip almayanlar için retargeting, sepeti terk edenler için ayrı bir set.",
        "Ölçümleme doğrulanır. Bu adım en sık atlanan adımdır: test siparişiyle dönüşümün Meta'ya düştüğünü görmeden bütçe açmayın.",
        "Kampanyalar canlıya alınır ve 4–6 haftalık öğrenme dönemi boyunca haftalık optimize edilir.",
      ],
    },
    {
      type: "p",
      text: "Baştan sona ortalama 7 iş günü süren bir süreçtir — tek şartla: adımlar paralel değil doğru sırayla yürütülürse. Yetkilendirme onayı gelmeden katalog bağlamaya çalışmak, en sık görülen zaman kaybıdır.",
    },

    { type: "h2", text: "Bütçe yakan 5 klasik hata" },
    { type: "h3", text: "1. Kitleyi aşırı daraltmak" },
    {
      type: "p",
      text: "Klasik reklamcılık refleksiyle ilgi alanı üstüne ilgi alanı eklemek CPAS'te ters teper. Meta'nın algoritması, satın alma sinyali zengin geniş kitlelerde çok daha hızlı öğrenir. Daraltılmış kitlede hem öğrenme uzar hem kişi başı maliyet artar.",
    },
    { type: "h3", text: "2. Katalog hijyenini ihmal etmek" },
    {
      type: "p",
      text: "Stokta olmayan, görseli düşük çözünürlüklü veya fiyatı panelle uyuşmayan ürünler bütçeyi doğrudan yakar. Kullanıcı reklamı tıklar, ürünü bulamaz; hem para gider hem hesap kalite skoru düşer. Katalog senkronizasyonunun günlük çalıştığı doğrulanmalıdır.",
    },
    { type: "h3", text: "3. Öğrenme aşamasında kampanyayı kurcalamak" },
    {
      type: "p",
      text: "İlk 7–14 gün algoritmanın veri topladığı dönemdir. Bu dönemde bütçeyi veya hedeflemeyi her değiştirdiğinizde öğrenme sıfırlanır. En sık görülen senaryo: üçüncü gün ROAS düşük diye kampanyayı kapatıp yeniden kurmak — ve bunu her hafta tekrarlamak.",
    },
    { type: "h3", text: "4. Yeniden pazarlamayı atlamak" },
    {
      type: "p",
      text: "Ürünü görüntüleyip almayan kullanıcı, elinizdeki en ucuz dönüşümdür. Bu kitleye ayrı kampanya kurmayan mağazalar, tipik olarak toplam ROAS'ın 2–3 katına çıkabilecek bir kaldıracı boş bırakır.",
    },
    { type: "h3", text: "5. Bütçeyi eşit dağıtmak" },
    {
      type: "p",
      text: "Çoğu mağazada cironun %70–80'i ürünlerin %20'sinden gelir. Reklam bütçesinin de bu dağılımı izlemesi gerekir. Tüm kataloğa eşit bütçe vermek, kazanan ürünleri aç bırakıp kaybedenleri beslemek demektir.",
    },

    { type: "h2", text: "Gerçekçi beklenti: ilk 90 gün nasıl geçer?" },
    {
      type: "table",
      head: ["Dönem", "Ne olur", "Tipik ROAS"],
      rows: [
        ["1–2. hafta", "Öğrenme aşaması, veri toplanır, maliyetler yüksek görünür", "1–3"],
        ["3–6. hafta", "Algoritma kârlı kitleyi bulur, retargeting devreye girer", "3–6"],
        ["7–12. hafta", "Kreatif ve bütçe optimizasyonu, ölçekleme", "4–8"],
      ],
    },
    {
      type: "p",
      text: "Bu bantlar kategoriye, sepet ortalamasına ve rekabete göre değişir. Ama şablon hep aynıdır: ilk iki hafta kötü görünür, altıncı haftadan sonra anlamlı hale gelir. CPAS'ten vazgeçen mağazaların çoğu ikinci haftada vazgeçmiştir.",
    },

    { type: "h2", text: "CPAS'i kendiniz mi kurmalısınız, ajansla mı?" },
    {
      type: "p",
      text: "Dürüst cevap: teknik ekibiniz varsa ve Meta Business Manager'a hâkimseniz kendiniz kurabilirsiniz. Süreç imkânsız değil, sadece hata toleransı düşük. Kurulumda yapılan bir ölçümleme hatası haftalarca fark edilmeden yanlış veriyle karar almanıza yol açabilir — ki bunun maliyeti kurulum ücretinden yüksektir.",
    },
    {
      type: "p",
      text: "CPAS Türkiye olarak yaptığımız iş tam olarak bu: yetkilendirmeden kampanya mimarisine kadar tüm kurulumu üstlenip reklamlarınızı ortalama 7 iş gününde canlıya alıyor, sonrasında haftalık optimizasyon döngüsüyle yönetiyoruz. Panel öğrenmeniz gerekmez; haftalık raporu okumanız yeterli.",
    },
  ],
  faq: [
    {
      question: "CPAS'in açılımı nedir?",
      answer:
        "CPAS, Collaborative Performance Advertising Solution ifadesinin kısaltmasıdır. Meta'nın pazaryeri satıcıları için sunduğu ortak reklam çözümüdür ve son dönemde Collaborative Ads adıyla da anılır.",
    },
    {
      question: "CPAS için kendi web sitem olması gerekiyor mu?",
      answer:
        "Hayır. CPAS'in en önemli avantajı budur: trafik doğrudan Trendyol ürün sayfanıza gider, dönüşüm Trendyol'un sipariş verisiyle ölçülür. Kendi siteniz ya da kendi piksel kurulumunuz gerekmez.",
    },
    {
      question: "CPAS için minimum kaç sipariş gerekiyor?",
      answer:
        "Teknik bir zorunluluk olmasa da pratikte son 30 günde en az 100 sipariş öneriyoruz. Bunun altındaki hacimlerde Meta'nın optimizasyon algoritması öğrenme aşamasını tamamlayacak dönüşüm sinyalini toplayamaz.",
    },
    {
      question: "CPAS kurulumu ne kadar sürer?",
      answer:
        "Trendyol yetkilendirme onayı 2–5 iş günü sürer. Yetkilendirme sonrası katalog bağlantısı, ölçümleme ve kampanya kurulumu ile birlikte toplam süre ortalama 7 iş günüdür.",
    },
    {
      question: "CPAS reklamlarında ROAS ne kadar olur?",
      answer:
        "İlk 4–6 haftalık öğrenme döneminden sonra ROAS tipik olarak 4–8 bandında oturur. Yeniden pazarlama kampanyaları genellikle 8–15 bandına çıkar. Rakamlar kategoriye, kâr marjına ve sepet ortalamasına göre değişir.",
    },
  ],
};

export default post;
