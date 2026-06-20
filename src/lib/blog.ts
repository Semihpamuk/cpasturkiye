export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  category: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cpas-nedir-trendyol-saticilari-icin-rehber",
    title: "CPAS Nedir? Trendyol Satıcıları İçin Eksiksiz Rehber",
    excerpt:
      "Meta'nın pazaryeri satıcıları için geliştirdiği CPAS çözümünü, Trendyol satıcısı gözünden tüm detaylarıyla anlatıyoruz: nasıl çalışır, kimler kullanabilir, neden önemli?",
    date: "2026-05-12",
    readingMinutes: 7,
    category: "Rehber",
    content: [
      "CPAS (Collaborative Performance Advertising Solution), Meta'nın pazaryerleriyle satıcıları buluşturan iş ortağı reklam çözümüdür. Türkçeye 'İş Birliğine Dayalı Performans Reklam Çözümü' olarak çevrilebilir. Özünde yaptığı şey şudur: Trendyol'daki ürün kataloğunuzu Meta'nın reklam sistemine bağlar ve Facebook/Instagram'da verdiğiniz reklamların doğrudan Trendyol mağazanıza satış olarak dönmesini sağlar.",
      "Normal Meta reklamlarında dönüşüm ölçümü, kendi web sitenize kurduğunuz piksel üzerinden tahmini olarak yapılır. CPAS'te ise durum farklıdır: Trendyol, sipariş verisini Meta ile paylaşır. Yani reklamınıza tıklayan kullanıcı Trendyol'da satın alma yaptığında, bu satış birebir reklamınızla eşleşir. 'Bu kampanya bu ay 240 sipariş getirdi' cümlesini tahminle değil, kesin veriyle söylersiniz.",
      "CPAS kullanabilmek için Trendyol'da aktif bir mağazanızın olması ve Trendyol'dan reklam yetkisi almanız gerekir. Bu yetkilendirme süreci Trendyol Satıcı Paneli üzerinden başlatılır ve onaylandığında ürün kataloğunuz Meta Business Manager hesabınıza bağlanabilir hale gelir.",
      "Peki neden CPAS? Birincisi, kendi e-ticaret siteniz olmasa bile Meta'nın milyonlarca kullanıcısına reklam verebilirsiniz. İkincisi, Trendyol'un yüksek dönüşüm oranından faydalanırsınız: kullanıcı zaten alışveriş alışkanlığı olan bir platforma yönlenir. Üçüncüsü, dinamik katalog reklamlarıyla her kullanıcıya ilgilendiği ürünü gösterirsiniz — el ile kreatif hazırlamanıza gerek kalmaz.",
      "Kurulum tarafında ise Meta Business Manager, katalog segmentleri, piksel eşleştirmesi gibi teknik adımlar vardır. Bu süreç ilk kez yapan biri için karmaşık olabilir; Jale olarak kurulumun tamamını sizin adınıza yönetiyor, sistemi 7 iş gününde teslim ediyoruz.",
    ],
  },
  {
    slug: "trendyol-saticisi-meta-reklamlarina-ne-zaman-gecmeli",
    title: "Trendyol Satıcısı Meta Reklamlarına Ne Zaman Geçmeli?",
    excerpt:
      "Her mağaza CPAS'e hazır değildir. Sipariş hacmi, kâr marjı ve katalog genişliği üzerinden, Meta reklamlarına geçiş için doğru zamanı nasıl anlayacağınızı anlatıyoruz.",
    date: "2026-05-26",
    readingMinutes: 5,
    category: "Strateji",
    content: [
      "Trendyol içi reklamlar (ürün öne çıkarma, mağaza reklamları) belirli bir noktaya kadar işler. Ancak mağazanız büyüdükçe iki sorunla karşılaşırsınız: platform içi rekabette reklam maliyetleri artar ve erişebileceğiniz kitle, o anda Trendyol'da aktif olan kullanıcılarla sınırlı kalır. Meta reklamları bu tavanı kaldırır.",
      "Peki ne zaman geçmelisiniz? İlk kriter sipariş hacmi: son 30 günde en az 100 sipariş almış olmanız gerekir. Bunun nedeni teknik: Meta'nın optimizasyon algoritması, kimin satın alacağını öğrenmek için veri sinyaline ihtiyaç duyar. Düşük hacimli mağazalarda algoritma öğrenme aşamasını tamamlayamaz ve bütçe verimsiz harcanır.",
      "İkinci kriter kâr marjı. Meta reklamlarında başlangıç döneminde ROAS tipik olarak 3-5 bandında seyreder ve optimizasyonla 6-10 bandına çıkar. Ürünlerinizin marjı, bu ROAS seviyelerinde kârlı kalmanıza izin vermelidir. Marjı çok dar ürünlerde reklam matematiği zor kurulur.",
      "Üçüncü kriter katalog genişliği. Dinamik katalog reklamları, Meta'nın en güçlü formatıdır ve en az 10-20 aktif ürünle anlamlı çalışır. Tek ürünlü mağazalar için de yollar vardır ama geniş katalog her zaman avantajdır.",
      "Bu üç kriteri sağlıyorsanız, Meta reklamlarına geçmek için beklemenin maliyeti, geçmenin riskinden büyüktür. Rakipleriniz henüz CPAS'i keşfetmemişken kitle maliyetleri görece düşükken pozisyon almak, önümüzdeki yılların en önemli avantajı olabilir. Mağazanızın hazır olup olmadığından emin değilseniz, iletişim sayfamızdan ücretsiz ön değerlendirme talep edebilirsiniz.",
    ],
  },
  {
    slug: "roas-nasil-yukseltilir-cpas-kampanyalarinda-5-taktik",
    title: "ROAS Nasıl Yükseltilir? CPAS Kampanyalarında 5 Kanıtlanmış Taktik",
    excerpt:
      "Yüzlerce CPAS kampanyasından damıttığımız, reklam getirinizi somut olarak artıran 5 taktik: bütçe disiplininden katalog hijyenine.",
    date: "2026-06-02",
    readingMinutes: 6,
    category: "Optimizasyon",
    content: [
      "ROAS (Return on Ad Spend), harcadığınız her 1 liranın kaç lira ciro döndürdüğünü gösterir. CPAS kampanyalarında ROAS'ı yükseltmenin yolu tek bir sihirli ayardan değil, birkaç disiplinin birleşiminden geçer. İşte sahada tekrar tekrar doğrulanmış 5 taktik.",
      "1) Bütçeyi kazananlara kaydırın. Çoğu mağazada cironun %70-80'i ürünlerin %20'sinden gelir. Reklam bütçeniz de aynı dağılımı izlemelidir. Haftalık olarak ürün bazında ROAS kırılımına bakın: 30 gündür satış getirmeyen ürün setlerini durdurun, şampiyonların bütçesini kademeli (%15-20 adımlarla) artırın. Jale'nin AI bütçe önerileri tam olarak bu analizi her gün otomatik yapar.",
      "2) Katalog hijyenini koruyun. Stokta olmayan, görseli bozuk veya fiyatı güncel olmayan ürünler hem bütçe israfıdır hem de hesap kalitenizi düşürür. Katalog senkronizasyonunuzun günlük çalıştığından emin olun.",
      "3) Geniş hedeflemeye güvenin. CPAS'te en sık yapılan hata, kitleyi aşırı daraltmaktır. Meta'nın algoritması, satın alma sinyali zengin geniş kitlelerde çok daha iyi öğrenir. İlgi alanı hedeflemesiyle mikro segmentler oluşturmak yerine, geniş kitle + dinamik katalog kombinasyonuna izin verin.",
      "4) Yeniden pazarlamayı ihmal etmeyin. Ürününüzü görüntüleyip almayan kullanıcılar, en ucuz dönüşümün adresidir. Görüntüleme ve sepete ekleme kitlelerine ayrı kampanya kurun; bu kampanyaların ROAS'ı genellikle genel kampanyanın 2-3 katıdır.",
      "5) Anomalileri erken yakalayın. ROAS düşüşleri çoğu zaman ani başlar: bir kreatif yorulur, bir rakip agresif fiyat kırar, bir ürün stok sorunu yaşar. Günlük takip eden satıcı, sorunu 1 günde yakalar; haftalık bakan satıcı 7 günlük bütçeyi yakmış olur. Jale'nin anomali motoru bu izlemeyi 7/24 sizin yerinize yapar ve eşik aşıldığında anında bildirim gönderir.",
    ],
  },
  {
    slug: "trendyol-cpas-reklam-yetkisi-nasil-alinir",
    title: "Trendyol CPAS Reklam Yetkisi Nasıl Alınır? Adım Adım 2026 Rehberi",
    excerpt:
      "Trendyol CPAS reklam yetkisi almak için nelere dikkat etmeli, süreç kaç gün sürer, hangi koşullar aranır? Satıcılar için güncel adım adım rehber.",
    date: "2026-06-10",
    readingMinutes: 6,
    category: "Rehber",
    content: [
      "Trendyol CPAS (Collaborative Performance Advertising Solution) kullanabilmek için önce Trendyol'dan reklam yetkisi almanız gerekir. Bu yetki olmadan ürün kataloğunuzu Meta'ya bağlamanız mümkün değildir. Peki bu süreç nasıl işler, kimler başvurabilir?",
      "Temel başvuru koşulları şunlardır: Trendyol'da aktif ve onaylı bir mağazanıza sahip olmanız, mağazanızın en az 3 ay aktif satış geçmişi bulunması ve ürün listeleme kurallarına uyumlu olmanız gerekir. Bazı kategorilerde (kozmetik, sağlık ürünleri) ek belgeler istenebilir. Mağaza puanınızın belirli bir eşiğin üzerinde olması da süreci hızlandıran faktörlerden biridir.",
      "Başvuru süreci şu şekilde ilerler: Trendyol Satıcı Paneli'nde 'Reklam' veya 'CPAS' bölümüne girin. Buradan Meta Business Manager hesabınızı bağlamak için yetkilendirme talebinde bulunabilirsiniz. Trendyol bu talebi inceler ve genellikle 2–5 iş günü içinde yanıt verir. Onay sonrasında ürün kataloğunuz Meta'ya aktarılabilir hale gelir.",
      "En sık karşılaşılan sorunlar şunlardır: Meta Business Manager hesabının doğrulanmamış olması, ödeme yöntemi eklenmemiş reklam hesabı ve katalog segmentlerinin hatalı yapılandırılması. Bu teknik engeller, özellikle ilk kez kurulum yapanlar için saatler hatta günler alabiliyor. Jale, bu sürecin tamamını sizin adınıza yönetiyor ve yetki onayından Meta bağlantısına kadar her adımı takip ediyor.",
      "Yetki aldıktan sonra ne olur? Meta Business Manager'da bir katalog oluşturmanız, bunu Trendyol'un paylaştığı ürün feed'iyle eşleştirmeniz ve ardından dinamik reklam kampanyaları kurmanız gerekir. Bu aşamalar birbirini izler ve her birinde teknik bir hata, bütçenizin boşa gitmesine yol açabilir. Jale, 7 günlük kurulum hizmetiyle tüm bu süreci uçtan uca yönetir.",
    ],
  },
  {
    slug: "trendyol-meta-reklam-entegrasyonu-nedir",
    title: "Trendyol Meta Reklam Entegrasyonu: Facebook ve Instagram'dan Satış",
    excerpt:
      "Trendyol mağazanızı Meta'ya nasıl bağlarsınız? Facebook ve Instagram reklamlarıyla Trendyol'da satışlarınızı artırmanın teknik ve stratejik yolu.",
    date: "2026-06-15",
    readingMinutes: 5,
    category: "Rehber",
    content: [
      "Trendyol satıcıları artık Meta'nın (Facebook ve Instagram) reklam gücünü doğrudan Trendyol mağazaları için kullanabiliyor. Bu entegrasyon, CPAS (Collaborative Performance Advertising Solution) teknolojisiyle mümkün hale geliyor. Peki bu entegrasyon ne işe yarar ve nasıl çalışır?",
      "Normal bir e-ticaret reklamında şu sorunla karşılaşırsınız: kullanıcı reklamı görür, kendi sitenize gelir, satın alır; bu satışı Meta pikseline bildirirsiniz. Ama Trendyol'da satış yapıyorsanız pikseli kuramaz ve gerçek dönüşüm verisine ulaşamazsınız. CPAS bu boşluğu kapatır: Trendyol, sipariş verilerini doğrudan Meta ile paylaşır. Hangi reklamın hangi siparişi getirdiğini net olarak görürsünüz.",
      "Entegrasyonun teknik adımları şöyle sıralanır: (1) Trendyol'dan CPAS reklam yetkisi alınır, (2) Meta Business Manager hesabı oluşturulur veya düzenlenir, (3) Trendyol ürün kataloğu Meta'ya aktarılır, (4) Katalog segmentleri oluşturulur, (5) Dinamik reklam kampanyaları kurulur. Her adımın birbiriyle uyumlu çalışması gerekir; bir hata tüm veri akışını bozar.",
      "Entegrasyon tamamlandığında ne değişir? Facebook ve Instagram'da Trendyol mağazanızın ürünlerini tanıtan otomatik reklamlar yayınlayabilirsiniz. Kullanıcı davranışına göre kişiselleştirilen dinamik reklamlar, kullanıcının önceden incelediği ürünleri ona yeniden gösterir. Bu yeniden pazarlama mekanizması, normal Trendyol içi reklamlara kıyasla genellikle 2–4 kat daha yüksek dönüşüm oranı sağlar.",
      "Hangi mağazalar bu entegrasyondan en çok kazanır? Aylık en az 100 sipariş alan, 20'den fazla ürünü olan ve kâr marjı yeterli mağazalar. Bu kriterleri sağlıyorsanız ve hâlâ CPAS kullanmıyorsanız, her geçen ay rekabette geri kalmaya devam ediyorsunuz demektir. Jale ile kurulumu 7 iş gününde tamamlayın, rakipleriniz fark etmeden avantajı yakalayın.",
    ],
  },
  {
    slug: "cpas-ile-trendyol-ic-reklam-karsilastirma",
    title: "CPAS mi, Trendyol İç Reklam mı? Hangisi Daha Kârlı?",
    excerpt:
      "Trendyol içi reklamlar ile CPAS (Meta) reklamları arasındaki fark nedir? Hangi durumda hangisini kullanmalısınız? ROAS ve maliyet karşılaştırması.",
    date: "2026-06-18",
    readingMinutes: 5,
    category: "Strateji",
    content: [
      "Trendyol satıcılarının önünde iki temel reklam kanalı var: platform içi reklamlar (ürün öne çıkarma, mağaza reklamı) ve platform dışı CPAS reklamları (Meta üzerinden). Bu iki kanal birbirini dışlamaz — doğru strateji ikisini birlikte kullanmaktır. Ama nasıl ve ne zaman?",
      "Trendyol içi reklamların avantajı, satın alma niyetli bir kitleye ulaşmanızdır. Trendyol'da aktif alışveriş yapan kullanıcılar zaten satın almaya hazırdır. Dezavantajı ise rekabetin yüksek olması ve reklam maliyetlerinin giderek artmasıdır. Ayrıca yalnızca Trendyol kullanıcılarına ulaşırsınız — platformun dışındaki potansiyel müşterilere dokunamazsınız.",
      "CPAS (Meta) reklamlarının avantajı ise kitledir: Facebook ve Instagram'ın 35+ milyon Türk kullanıcısına ulaşabilirsiniz. Trendyol'daki ürünlerinizi hiç Trendyol'a girmemiş kitlelere tanıtabilir, farkındalık yaratabilir ve dönüşüm sağlayabilirsiniz. Gerçek satış verisiyle beslenen AI algoritması zamanla kârlı kitleyi öğrenir ve giderek daha verimli çalışır.",
      "Tipik ROAS karşılaştırması: Trendyol içi reklamlar, yüksek rekabetli kategorilerde genellikle ROAS 2–4 aralığında seyreder. CPAS reklamları, iyi optimize edildiğinde 4–10 aralığına çıkabilir. Başlangıçta CPAS öğrenme aşaması nedeniyle düşük başlar ama 4–6 hafta içinde stabilize olup uzun vadede üstün performans gösterir.",
      "Hangi stratejiyi seçmeli? Başlangıç dönemi veya küçük mağazalar için Trendyol içi reklamlar daha güvenlidir. Aylık 100+ sipariş alan mağazalar için CPAS vazgeçilmez bir büyüme motorudur. İdeal kullanım: Trendyol içi reklamlarla sizi arayanları yakalayın, CPAS ile sizi henüz tanımayanlara ulaşın. Jale platformu her iki kanalın verisini birleştirip hangi bütçenin nereye gitmesi gerektiğini size söyler.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
