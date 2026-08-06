import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "trendyol-meta-reklam-entegrasyonu-nedir",
  title: "Trendyol Meta Reklam Entegrasyonu: Facebook ve Instagram'dan Satış",
  excerpt:
    "Trendyol mağazanızı Meta'ya nasıl bağlarsınız? Entegrasyonun teknik bileşenleri, veri akışı, kurulum adımları ve Facebook/Instagram reklamlarıyla Trendyol satışlarını artırmanın yolu.",
  date: "2026-06-15",
  updated: "2026-08-06",
  category: "Rehber",
  keywords: [
    "Trendyol Meta entegrasyonu",
    "Trendyol Facebook reklam",
    "Trendyol Instagram reklam",
    "Meta katalog bağlantısı",
    "pazaryeri Meta reklamı",
  ],
  content: [
    {
      type: "p",
      text: "Trendyol satıcıları artık Meta'nın reklam altyapısını doğrudan Trendyol mağazaları için kullanabiliyor. Bunu mümkün kılan şey CPAS entegrasyonu: Trendyol'daki ürün kataloğunuz ve sipariş veriniz, Meta'nın reklam sistemiyle resmi bir kanal üzerinden konuşuyor.",
    },
    {
      type: "p",
      text: "Bu yazıda entegrasyonun teknik olarak nelerden oluştuğunu, verinin hangi yönde aktığını ve kurulumun hangi adımlardan geçtiğini anlatıyoruz. Amaç, sistemi bir kara kutu olmaktan çıkarıp neyi neden yaptığınızı görebileceğiniz hale getirmek.",
    },

    { type: "h2", text: "Entegrasyon hangi problemi çözüyor?" },
    {
      type: "p",
      text: "Klasik e-ticaret reklamcılığında döngü şöyle işler: kullanıcı reklamı görür, sitenize gelir, sitenizdeki piksel davranışını kaydeder, satın alma gerçekleşince piksel bunu Meta'ya bildirir ve algoritma öğrenir.",
    },
    {
      type: "p",
      text: "Trendyol'da satıyorsanız bu döngünün ortası kopuktur: Trendyol'un sitesine kendi pikselinizi kuramazsınız. Reklam verirsiniz, satış olur, ama Meta hangi reklamın hangi satışı getirdiğini bilemez. Bilemeyince optimize edemez; optimize edemeyince bütçeniz rastgele harcanır.",
    },
    {
      type: "callout",
      title: "Entegrasyonun özü",
      text: "Piksel yerine pazaryerinin kendi sipariş verisi kullanılır. Trendyol, satın alma olayını Meta'ya iletir; böylece kopuk halka kapanır ve algoritma gerçek satışla öğrenmeye başlar.",
    },

    { type: "h2", text: "Entegrasyonun dört bileşeni" },
    { type: "h3", text: "1. Ürün feed'i" },
    {
      type: "p",
      text: "Trendyol, mağazanızdaki ürünleri yapılandırılmış bir feed olarak Meta'ya aktarır: ürün adı, görsel, güncel fiyat, stok durumu, kategori ve ürün sayfası bağlantısı. Feed günlük yenilenir; stoğu biten ürün reklamdan otomatik olarak düşer.",
    },
    { type: "h3", text: "2. Katalog segmenti" },
    {
      type: "p",
      text: "Trendyol'un tüm kataloğu içinden yalnızca sizin ürünleriniz izole edilerek size özel bir segment oluşturulur. Bu, hem rekabet güvenliği sağlar (rakipler sizin ürünlerinizi reklam veremez) hem de bütçenizin yalnızca kendi ürünlerinize gitmesini garanti eder.",
    },
    { type: "h3", text: "3. Olay akışı" },
    {
      type: "p",
      text: "Trendyol'daki ürün görüntüleme, sepete ekleme ve satın alma olayları Meta'ya iletilir. Bu akış, yeniden pazarlama kitlelerinizin hammaddesidir: “ürünü gördü ama almadı” ya da “sepete ekledi ama tamamlamadı” kitlelerini bu veriyle kurarsınız.",
    },
    { type: "h3", text: "4. Dönüşüm eşleştirmesi" },
    {
      type: "p",
      text: "Reklamınıza tıklayan kullanıcı Trendyol'da satın alma yaptığında, sipariş ilgili kampanya ve reklam setiyle eşleştirilir. ROAS'ı tahminle değil gerçek ciroyla raporlarsınız.",
    },

    { type: "h2", text: "Veri hangi yöne akıyor? Gizlilik notu" },
    {
      type: "p",
      text: "Satıcıların en sık sorduğu sorulardan biri: “Müşteri verim Meta'ya mı gidiyor?” Kısa cevap: kişisel veriler size açık şekilde aktarılmaz. Trendyol ile Meta arasındaki eşleştirme, platformlar arası şifreli bir eşleştirme protokolüyle yapılır; siz reklam panelinde bireysel müşteri kimliği değil, toplulaştırılmış performans verisi görürsünüz.",
    },
    {
      type: "p",
      text: "Pratik sonucu şudur: kampanya optimizasyonu için ihtiyacınız olan tüm veriye (hangi ürün, kaç sipariş, ne kadar ciro) erişirsiniz; müşterinin kimliğine erişmezsiniz. Bu, KVKK uyumu açısından da doğru tasarımdır.",
    },

    { type: "h2", text: "Entegrasyonun sınırları: neyi yapamazsınız?" },
    {
      type: "p",
      text: "Beklentiyi doğru kurmak için sistemin yapamadıklarını da bilmek gerekir. Entegrasyon güçlüdür ama sınırsız değildir.",
    },
    {
      type: "ul",
      items: [
        "Ürün sayfasını değiştiremezsiniz: Reklam kullanıcıyı pazaryeri sayfasına götürür. Sayfanın tasarımı, sepet akışı ve ödeme deneyimi pazaryerinin kontrolündedir.",
        "Müşteri iletişim bilgisine erişemezsiniz: E-posta listesi kuramaz, doğrudan pazarlama yapamazsınız. İlişki pazaryeriyle müşteri arasındadır.",
        "Rakip ürünleri hedefleyemezsiniz: Yalnızca kendi katalog segmentinizle reklam verirsiniz.",
        "Fiyatı reklam üzerinden değiştiremezsiniz: Katalogdaki fiyat pazaryeri panelinden gelir; reklamda farklı fiyat gösteremezsiniz.",
        "Kupon ve indirimleri reklamdan tanımlayamazsınız: Kampanya pazaryeri tarafında kurulur, reklam yalnızca mevcut fiyatı yansıtır.",
      ],
    },
    {
      type: "p",
      text: "İkinci madde stratejik olarak en önemlisidir: CPAS ile büyürken müşteri ilişkisi pazaryerinde kalır. Uzun vadede kendi kanalınızı da kurmak istiyorsanız CPAS'i tek kanal olarak değil, büyüme motoru olarak konumlandırın.",
    },

    { type: "h2", text: "Kurulum adımları" },
    {
      type: "ol",
      items: [
        "Trendyol Satıcı Paneli'nden CPAS reklam yetkisi alınır (2–5 iş günü).",
        "Meta Business Manager hesabı kurulur veya mevcut hesabın işletme doğrulaması tamamlanır.",
        "Reklam hesabına ödeme yöntemi tanımlanır ve hesap aktif hale getirilir.",
        "Trendyol'un paylaştığı katalog segmenti Ticaret Yöneticisi'nde kabul edilir.",
        "Ürün setleri oluşturulur — kategori ve kâr marjı bazlı ayrım önerilir.",
        "Ölçümleme test siparişiyle doğrulanır.",
        "Kampanya mimarisi kurulur ve reklamlar canlıya alınır.",
      ],
    },
    {
      type: "p",
      text: "Adımların sırası önemlidir: yetkilendirme onayı gelmeden katalog bağlamaya, katalog gelmeden kampanya kurmaya çalışmak yaygın bir zaman kaybıdır. Doğru sırayla yürütüldüğünde toplam süre ortalama 7 iş günüdür.",
    },

    { type: "h2", text: "Entegrasyon çalışıyor mu? Doğrulama kontrolleri" },
    {
      type: "p",
      text: "Entegrasyonun en tehlikeli özelliği, yarım çalıştığında hata vermemesidir. Panel yeşil görünür, kampanya yayındadır, bütçe harcanır — ama veri akışının bir ucu kopuktur. Aşağıdaki dört kontrol, yayına almadan önce bunu yakalar.",
    },
    {
      type: "ol",
      items: [
        "Ürün sayısı doğrulaması: Meta'daki katalogda görünen ürün sayısını pazaryeri panelinizdeki aktif ürün sayısıyla karşılaştırın. Ciddi fark varsa reddedilen ürünleri tanılama ekranından listeleyin.",
        "Fiyat ve stok tutarlılığı: Rastgele 10 ürün seçip Meta katalogundaki fiyat ve stok bilgisinin panelle aynı olduğunu doğrulayın.",
        "Test siparişi: Küçük bütçeli bir kampanya açıp kendi reklamınıza tıklayarak bir sipariş oluşturun. Dönüşümün Meta'ya düştüğünü gördükten sonra asıl bütçeyi açın.",
        "Olay akışı: Etkinlikler ekranında görüntüleme, sepete ekleme ve satın alma olaylarının son 24 saatte kaydedildiğini kontrol edin. Yalnızca görüntüleme geliyorsa yeniden pazarlama katmanlarınız çalışmayacaktır.",
      ],
    },
    {
      type: "callout",
      title: "Üçüncü adımı atlamayın",
      text: "Test siparişi olmadan açılan bütçe, ölçüm hatası varsa haftalarca fark edilmez. Satışlar gelir ama Meta göremez; algoritma öğrenemez ve siz kampanyayı başarısız sanarak kapatırsınız. Bu, kurulumdaki en pahalı tek hatadır.",
    },

    { type: "h2", text: "Entegrasyon sonrası ne değişir?" },
    {
      type: "table",
      head: ["Önce", "Sonra"],
      rows: [
        ["Yalnızca Trendyol'da gezinen kullanıcıya ulaşım", "Facebook ve Instagram'ın Türkiye kitlesine erişim"],
        ["Reklamın satışa etkisi tahmini", "Sipariş bazlı birebir ölçüm"],
        ["Her ürün için ayrı kreatif üretimi", "Katalogdan otomatik dinamik reklam"],
        ["Yeniden pazarlama yok", "Görüntüleme / sepet / müşteri katmanları"],
        ["Bütçe kararı sezgisel", "Ürün bazlı ROAS kırılımıyla veriye dayalı"],
      ],
    },
    {
      type: "p",
      text: "En büyük operasyonel fark dinamik reklamlardır. 200 ürünlü bir katalog için 200 ayrı görsel hazırlamanız gerekmez; Meta her kullanıcıya ilgilendiği ürünü katalogdan seçip gösterir. Kreatif üretim yükü ciddi biçimde düşer.",
    },

    { type: "h2", text: "Entegrasyonun bakımı: kurulum bir defalık değil" },
    {
      type: "p",
      text: "Kurulum tamamlandığında iş bitmiş sayılmaz. Entegrasyon, üzerinde iki ayrı sistemin (pazaryeri ve Meta) sürekli değiştiği canlı bir bağlantıdır ve bakımsız kaldığında sessizce bozulur. Bozulmanın tipik belirtisi, kimsenin bir şey değiştirmediği bir haftada performansın düşmesidir.",
    },
    {
      type: "table",
      head: ["Bakım kalemi", "Sıklık", "Bozulduğunda ne olur"],
      rows: [
        ["Katalog senkron tarihi kontrolü", "Haftalık", "Eski fiyat ve stokla reklam döner"],
        ["Reddedilen ürün listesi taraması", "Haftalık", "Yeni eklenen ürünler reklamda hiç görünmez"],
        ["Olay akışı doğrulaması", "İki haftalık", "Yeniden pazarlama kitleleri küçülmeye başlar"],
        ["Ödeme yöntemi geçerlilik kontrolü", "Aylık", "Kart süresi dolunca kampanyalar durur"],
        ["Yetki ve erişim gözden geçirmesi", "Üç aylık", "Ayrılan çalışanın erişimi açık kalır"],
      ],
    },
    {
      type: "p",
      text: "İkinci satır özellikle önemlidir çünkü kataloğa yeni eklediğiniz ürünlerle ilgilidir. Mevcut ürünleriniz sorunsuz dönerken, yeni eklenen ürünler görsel veya fiyat alanı nedeniyle reddedilmiş olabilir. Kampanya çalışıyor göründüğü için kimse bakmaz; yeni ürünlerin reklamdan hiç pay almadığı aylar sonra fark edilir.",
    },

    { type: "h2", text: "Hangi mağazalar en çok kazanıyor?" },
    {
      type: "ul",
      items: [
        "Aylık 100+ sipariş alan mağazalar: algoritmanın öğrenmesi için yeterli sinyal üretirler.",
        "20+ aktif ürünü olan mağazalar: dinamik format tam kapasite çalışır.",
        "Görsel olarak güçlü kategoriler (moda, ev dekorasyon, kozmetik, aksesuar): Instagram'da doğal performans avantajı vardır.",
        "Tekrar alım oranı yüksek kategoriler (kozmetik, gıda takviyesi, bebek): mevcut müşteriye yeniden satış ROAS'ı yukarı çeker.",
        "Katkı marjı %25 üzerindeki ürünler: öğrenme dönemini rahat finanse ederler.",
      ],
    },
    {
      type: "p",
      text: "Bu profile uyuyor ve hâlâ entegrasyonu kurmadıysanız, kaybınız yalnızca bugünkü ciro değil: hesabınızın biriktireceği dönüşüm verisi de gecikiyor. CPAS'te geçmiş veri, gelecekteki performansın girdisidir — geç başlayan mağaza, aynı bütçeyle daha düşük verimle başlar.",
    },
    {
      type: "p",
      text: "CPAS Türkiye, bu entegrasyonun tamamını uçtan uca kuruyor ve ortalama 7 iş gününde reklamlarınızı yayına alıyor. Kurulumdan sonra devam etmek isterseniz haftalık optimizasyon döngüsüyle yönetiyoruz; istemezseniz kurduğumuz yapı sizin hesaplarınızda kalıyor ve kendiniz yönetmeye devam ediyorsunuz.",
    },
  ],
  faq: [
    {
      question: "Trendyol Meta entegrasyonu için kendi sitem gerekiyor mu?",
      answer:
        "Hayır. Entegrasyon Trendyol ürün sayfalarınız üzerinden çalışır; trafik Trendyol'a gider, dönüşüm Trendyol'un sipariş verisiyle ölçülür. Kendi siteniz veya kendi piksel kurulumunuz gerekmez.",
    },
    {
      question: "Müşteri verilerim Meta ile paylaşılıyor mu?",
      answer:
        "Eşleştirme platformlar arası şifreli bir protokolle yapılır ve reklam panelinde bireysel müşteri kimliği görünmez. Yalnızca toplulaştırılmış performans verisine (ürün, sipariş sayısı, ciro) erişirsiniz.",
    },
    {
      question: "Katalogdaki fiyat ve stok ne sıklıkla güncelleniyor?",
      answer:
        "Feed günlük olarak yenilenir; stoğu biten ürünler reklam dönüşünden otomatik olarak çıkar. Senkronun çalıştığını haftada bir doğrulamak önemlidir, çünkü senkron kırıldığında sistem hata vermez, eski veriyle yayına devam eder.",
    },
    {
      question: "Entegrasyon kurulumu ne kadar sürer?",
      answer:
        "Adımlar paralel yürütüldüğünde ortalama 7 iş günü. Sırayla ve kesintili ilerlerse aynı iş 3–4 haftaya çıkabilir; süreyi uzatan genellikle Trendyol'un onay hızı değil, adımlar arası bekleme süreleridir.",
    },
  ],
};

export default post;
