import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "hepsiburada-cpas-kurulumu-adim-adim",
  title: "Hepsiburada CPAS Kurulumu: Adım Adım Rehber (2026)",
  excerpt:
    "Hepsiburada mağazanız için Meta CPAS kurulumunu adım adım anlatıyoruz: reklam yetkisi başvurusu, katalog bağlantısı, kampanya mimarisi ve Trendyol kurulumundan ayrışan kritik noktalar.",
  date: "2026-08-06",
  category: "Rehber",
  keywords: [
    "Hepsiburada CPAS",
    "Hepsiburada CPAS kurulumu",
    "Hepsiburada Meta reklam",
    "Hepsiburada Facebook reklam",
    "Hepsiburada reklam yönetimi",
  ],
  content: [
    {
      type: "p",
      text: "CPAS denince akla önce Trendyol geliyor ama Hepsiburada da Meta ile iş birliği yapan pazaryerlerinden biri. Hepsiburada satıcısıysanız aynı mantık sizin için de geçerli: ürün kataloğunuzu Meta'ya bağlayıp Facebook ve Instagram'dan doğrudan Hepsiburada mağazanıza satış yapabilirsiniz.",
    },
    {
      type: "p",
      text: "Bu rehberde Hepsiburada tarafındaki kurulumu adım adım anlatıyor, Trendyol kurulumundan farklılaştığı noktaları özellikle işaretliyoruz — çünkü iki platformun akışını aynı sanıp takılan çok satıcı var.",
    },

    { type: "h2", text: "Hepsiburada CPAS kimler için uygun?" },
    {
      type: "ul",
      items: [
        "Hepsiburada'da aktif ve onaylı satıcı hesabı olanlar",
        "Son 30 günde en az 100 sipariş alan mağazalar (algoritmanın öğrenme eşiği)",
        "En az 20 aktif ürünü bulunanlar — dinamik katalog reklamı bu havuzla anlamlı çalışır",
        "Komisyon, kargo ve iade düşüldükten sonra %25 üzeri katkı marjı kalanlar",
        "Aylık en az 25.000–30.000 ₺ reklam bütçesi ayırabilenler",
      ],
    },
    {
      type: "p",
      text: "Bu eşiklerin altındaysanız kurulumu ertelemek, hazır olmadan başlayıp öğrenme aşamasında bütçe yakmaktan daha ucuzdur.",
    },

    { type: "h2", text: "Başlamadan önce hazırlanacak belgeler" },
    {
      type: "p",
      text: "Kurulumun ilk gününde yarım kalan işlerin çoğu belge eksikliğinden kaynaklanır. Aşağıdakileri süreci başlatmadan önce dijital ortamda hazır edin; ikisi de hem pazaryeri hem Meta tarafında istenir.",
    },
    {
      type: "ul",
      items: [
        "Vergi levhası (tam sayfa, okunaklı PDF)",
        "Faaliyet belgesi veya ticaret sicil gazetesi",
        "İşletme adına düzenlenmiş güncel bir fatura (adres doğrulaması için)",
        "Kategoriye göre marka tescil belgesi veya yetkili satıcı/distribütör belgesi",
        "Meta Business Manager kimlik numarası (BM ID)",
      ],
    },
    {
      type: "p",
      text: "İşletme adının belgelerde geçtiği şekliyle birebir aynı yazılması önemlidir — Ltd. Şti., A.Ş. gibi ekler dahil. Ad uyuşmazlığı, Meta işletme doğrulamasında en sık görülen red nedenidir ve her red turu ek gün demektir.",
    },

    { type: "h2", text: "Kurulum adımları" },
    {
      type: "ol",
      items: [
        "Hepsiburada satıcı panelinden reklam/pazarlama bölümüne girip Meta iş birliği yetkilendirme talebi oluşturun. Talep sırasında Meta Business Manager kimlik numaranız (BM ID) istenir.",
        "Meta Business Manager tarafında işletme doğrulamasını tamamlayın: vergi levhası ve faaliyet belgesi gerekir. Bu adımı yetkilendirme talebiyle paralel yürütün, sırayla değil.",
        "Reklam hesabınıza ödeme yöntemi tanımlayın ve hesabın aktif olduğunu doğrulayın. Ödeme yöntemi tanımsız hesaplarda katalog paylaşımı tamamlanmaz.",
        "Yetkilendirme onaylandığında Hepsiburada, katalog segmentinizi Meta tarafında paylaşır. Ticaret Yöneticisi'ne (Commerce Manager) girip paylaşımı kabul edin.",
        "Katalogdaki ürün sayısını panelinizle karşılaştırın. Sayı tutmuyorsa aradaki fark neredeyse her zaman stok dışı ya da eksik görselli ürünlerdir.",
        "Ürün setlerini oluşturun. Kategori ve kâr marjı bazlı ayrım, bütçe kontrolünü baştan mümkün kılar.",
        "Test siparişiyle ölçümlemeyi doğrulayın. Dönüşümün Meta'ya düştüğünü görmeden bütçe açmayın.",
        "Kampanya mimarisini kurun ve reklamları canlıya alın.",
      ],
    },

    { type: "h2", text: "Trendyol kurulumundan farklı olan noktalar" },
    {
      type: "table",
      head: ["Konu", "Pratikte anlamı"],
      rows: [
        ["Panel akışı", "Yetkilendirme menüsünün konumu ve adlandırması farklı; aynı yeri aramayın"],
        ["Katalog alan eşleşmesi", "Ürün başlığı ve kategori alanları farklı gelir; set kurallarını buna göre yazın"],
        ["Feed yenileme davranışı", "Stok/fiyat güncellemesinin yansıma süresi farklı olabilir, ilk hafta günlük doğrulayın"],
        ["Kategori belge talepleri", "İstenen belgeler kategori bazında farklılık gösterebilir"],
        ["Raporlama kırılımı", "Ürün bazlı kırılımda alan adları farklı; rapor şablonunuzu ayrı kurun"],
      ],
    },
    {
      type: "callout",
      title: "En sık yapılan hata",
      text: "Trendyol için yazılmış ürün seti kurallarını Hepsiburada kataloğuna kopyalamak. Alan adları ve kategori etiketleri farklı olduğu için kurallar hiçbir ürünü yakalamaz; set boş kalır, kampanya yayına girmez ve neden olduğu günlerce anlaşılmaz.",
    },

    { type: "h2", text: "Katalog kalite kontrolü: yayına almadan önce" },
    {
      type: "p",
      text: "Hepsiburada kataloğu Meta'ya aktarıldığında ürünlerin bir kısmı reklam verilebilir durumda olmaz. Meta bu ürünleri sessizce dışarıda bırakır; siz kampanyayı kurar, bütçeyi açar ve beklediğiniz ürünlerin hiç dönmediğini haftalar sonra fark edersiniz.",
    },
    {
      type: "p",
      text: "Yayına almadan önce Ticaret Yöneticisi'ndeki katalog tanılama ekranını açın ve aşağıdaki kalemleri tek tek temizleyin.",
    },
    {
      type: "table",
      head: ["Kontrol", "Neden önemli"],
      rows: [
        ["Katalogdaki ürün sayısı panelinizle uyuşuyor mu", "Fark neredeyse her zaman stok dışı veya eksik görselli ürünlerdir"],
        ["Görsel çözünürlüğü en az 500x500", "Altındaki ürünler dinamik reklamda gösterilmez"],
        ["Ürün başlığında kategori ifadesi var mı", "Dinamik eşleştirme başlık metnini kullanır"],
        ["Fiyat alanı boş veya sıfır olan ürün var mı", "Bu ürünler otomatik olarak reddedilir"],
        ["Ürün linki doğrudan ürün sayfasına gidiyor mu", "Arama sonucuna giden linkler dönüşümü düşürür"],
        ["Varyantlar tek üründe mi toplanmış", "Ayrı kayıtlar bütçeyi kendi içinde böler"],
      ],
    },
    {
      type: "p",
      text: "Bu kontrol tipik olarak yarım gün alır ve kurulumun getirisi en yüksek yarım günüdür: reddedilen ürünleri yayına almadan düzeltmek, sonradan düşük performansı teşhis etmeye çalışmaktan çok daha ucuzdur.",
    },

    { type: "h2", text: "Kampanya mimarisi: kaç kampanya, hangi ayrım?" },
    {
      type: "p",
      text: "Hepsiburada kurulumlarında en sık gördüğümüz hata, tüm kataloğu tek bir kampanyaya koymaktır. Bu kurgu ilk bakışta sade görünür ama bütçe kontrolünü imkânsız hale getirir: yüksek marjlı ürünle düşük marjlı ürün aynı havuzda yarışır ve algoritma kâra göre değil, dönüşüm kolaylığına göre seçim yapar.",
    },
    {
      type: "p",
      text: "Önerdiğimiz asgari yapı dört kampanyadır ve her birinin ayrı bütçesi olur.",
    },
    {
      type: "ol",
      items: [
        "Prospecting — yüksek marjlı ürün seti: bütçenin en büyük payı buraya gider, ölçekleme buradan yapılır.",
        "Prospecting — geniş katalog: marka farkındalığı ve kitle genişletme amacı taşır, daha düşük ROAS beklenir.",
        "Yeniden pazarlama — sepete ekleyip almayanlar (7 gün): en yüksek ROAS'lı kampanya, bütçesi kitle büyüklüğüyle sınırlıdır.",
        "Yeniden pazarlama — ürün görüntüleyenler (14 gün): ikinci en verimli katman, kitle daha geniş olduğu için daha fazla bütçe kaldırır.",
      ],
    },
    {
      type: "p",
      text: "Kitle çakışmasına dikkat edin: yeniden pazarlama kitlelerini prospecting kampanyalarından hariç tutun. Aksi halde aynı kullanıcıya iki kampanyanızdan aynı anda reklam çıkarsınız, kendi açık artırmanızda kendinizle yarışır ve gösterim maliyetini yükseltirsiniz.",
    },

    { type: "h2", text: "İki pazaryerinde birden satıyorsanız" },
    {
      type: "p",
      text: "Hem Trendyol hem Hepsiburada mağazanız varsa iki ayrı katalog, iki ayrı ölçüm hattı ve iki ayrı kampanya seti yönetiyorsunuz demektir. Burada iki temel yaklaşım var.",
    },
    {
      type: "ol",
      items: [
        "Ayrı bütçe, ayrı kampanya: Her pazaryeri kendi bütçesiyle yarışır. Ölçüm temizdir, hangi platformun daha verimli olduğunu net görürsünüz. Yönetim yükü daha yüksektir.",
        "Ağırlıklı bütçe: Ana platform (genellikle sipariş hacmi yüksek olan) bütçenin çoğunu alır, ikincisi test bütçesiyle yürür. 6–8 hafta sonra artımsal katkıya göre denge kurulur.",
      ],
    },
    {
      type: "p",
      text: "Hangi yaklaşımı seçerseniz seçin, aynı ürünü iki platformda aynı kitleye aynı anda reklam etmekten kaçının: kendi reklamlarınız açık artırmada birbiriyle yarışır ve gösterim maliyetini yukarı çekersiniz. Kitle ayrıştırması kurulumun en teknik ama en getirili kısmıdır.",
    },

    { type: "h2", text: "Kurulum sonrası ilk 6 hafta" },
    {
      type: "table",
      head: ["Hafta", "Odak"],
      rows: [
        ["1–2", "Öğrenme aşaması. Kampanyaya dokunmayın, yalnızca veri akışını doğrulayın"],
        ["3–4", "Kazanan ürün setleri belirginleşir; kaybeden setler durdurulur"],
        ["5–6", "Yeniden pazarlama katmanları devreye alınır, bütçe kademeli artırılır"],
      ],
    },
    {
      type: "p",
      text: "İlk iki haftada performans kötü görünür — bu normaldir, algoritma veri topluyordur. Bu dönemde kampanyayı kapatıp yeniden kurmak, öğrenmeyi sıfırlayıp süreci baştan başlatmak demektir. CPAS'ten vazgeçen mağazaların çoğu tam olarak burada vazgeçer.",
    },

    { type: "h2", text: "Hepsiburada satıcısına özel üç not" },
    { type: "h3", text: "Kategori dinamiklerini hesaba katın" },
    {
      type: "p",
      text: "Hepsiburada'nın kullanıcı profili ve güçlü olduğu kategoriler Trendyol'dan farklıdır. Elektronik, beyaz eşya ve teknoloji ürünlerinde platformun konumu güçlüdür; buna karşılık bu kategoriler keşif kanalında (Instagram akışı) daha zayıf çalışır çünkü kullanıcı bu ürünleri dürtüsel değil araştırarak satın alır. Bu kategorilerde CPAS'in ağırlığını yeniden pazarlamaya kaydırmak, prospecting'e yüklenmekten daha verimlidir.",
    },
    { type: "h3", text: "Sepet ortalaması yüksekse öğrenme uzar" },
    {
      type: "p",
      text: "Yüksek fiyatlı ürünlerde satın alma kararı günlere yayılır. Bu, dönüşüm sayısının yavaş birikmesi ve öğrenme aşamasının uzaması demektir. 6 hafta yerine 8 haftalık bir öğrenme penceresi planlayın ve dördüncü haftadaki rakamlara bakıp karar vermeyin.",
    },
    { type: "h3", text: "Kargo ve teslimat vaadi dönüşümü belirler" },
    {
      type: "p",
      text: "Reklamdan gelen kullanıcı, ürün sayfasındaki teslimat süresini rakiplerle karşılaştırır. Reklam bütçesini artırmadan önce teslimat sürenizin kategori ortalamasının altında olduğundan emin olun; aksi halde tıklama satın alır ama satın alma satın almazsınız.",
    },

    { type: "h2", text: "Kurulumu devretmek isterseniz" },
    {
      type: "p",
      text: "CPAS Türkiye, Hepsiburada ve Trendyol için CPAS kurulumunu uçtan uca yürütüyor: yetkilendirme takibi, Meta işletme doğrulaması, katalog bağlantısı, ürün seti mimarisi, ölçümleme doğrulaması ve kampanya kurulumu dahil. Ortalama 7 iş gününde reklamlarınız yayında oluyor. İki pazaryerinde birden satıyorsanız ikinci pazaryeri kurulum ve yönetimde %50 indirimli ekleniyor.",
    },
  ],
  faq: [
    {
      question: "Hepsiburada CPAS destekliyor mu?",
      answer:
        "Evet. Hepsiburada, Meta ile iş birliği yapan pazaryerlerinden biridir; satıcılar ürün kataloglarını Meta'ya bağlayıp Facebook ve Instagram üzerinden Hepsiburada mağazalarına satış yapabilir.",
    },
    {
      question: "Hepsiburada CPAS kurulumu Trendyol'dan farklı mı?",
      answer:
        "Mantık aynı, uygulama detayları farklı. Panel akışı, katalog alan adları, feed yenileme davranışı ve kategori belge talepleri değişiyor. Trendyol için yazılmış ürün seti kurallarını olduğu gibi kopyalamak en sık yapılan hatadır.",
    },
    {
      question: "Hem Trendyol hem Hepsiburada'da CPAS kullanabilir miyim?",
      answer:
        "Evet, ancak iki ayrı katalog ve iki ayrı kampanya seti yönetmeniz gerekir. Aynı ürünü aynı kitleye iki platformdan aynı anda reklam etmemeye dikkat edin — kendi reklamlarınız açık artırmada birbiriyle yarışır ve maliyeti yükseltir.",
    },
    {
      question: "Hepsiburada CPAS kurulumu ne kadar sürer?",
      answer:
        "Yetkilendirme onayı ve Meta doğrulaması paralel yürütüldüğünde toplam süre ortalama 7 iş günüdür. Adımlar sırayla ve kesintili ilerlerse 3–4 haftaya kadar uzayabilir.",
    },
  ],
};

export default post;
