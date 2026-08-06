import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "trendyol-saticisi-meta-reklamlarina-ne-zaman-gecmeli",
  title: "Trendyol Satıcısı Meta Reklamlarına Ne Zaman Geçmeli?",
  excerpt:
    "Her mağaza CPAS'e hazır değildir. Sipariş hacmi, kâr marjı, katalog genişliği ve nakit akışı üzerinden Meta reklamlarına geçiş için doğru zamanı nasıl anlayacağınızı rakamlarla anlatıyoruz.",
  date: "2026-05-26",
  updated: "2026-08-06",
  category: "Strateji",
  keywords: [
    "Trendyol Meta reklam",
    "CPAS ne zaman başlanmalı",
    "Trendyol reklam stratejisi",
    "pazaryeri reklam bütçesi",
  ],
  content: [
    {
      type: "p",
      text: "CPAS'e geçiş kararı çoğu satıcıda duygusal veriliyor: bir rakip başladı, bir eğitimde duyuldu, ya da platform içi reklamlarda maliyetler sıkıştı. Oysa bu karar tamamen aritmetik bir karardır. Bu yazıda hazır olup olmadığınızı ölçen dört eşiği ve her eşiğin arkasındaki nedeni anlatıyoruz.",
    },
    {
      type: "callout",
      title: "Kısa cevap",
      text: "Son 30 günde 100+ sipariş, reklam sonrası %25+ katkı marjı, 20+ aktif ürün ve 3 aylık reklam bütçesini önden karşılayabilecek nakit akışı. Dördü de varsa geçin; biri eksikse önce onu düzeltin.",
    },

    { type: "h2", text: "Neden platform içi reklamın bir tavanı var?" },
    {
      type: "p",
      text: "Trendyol içi reklamlar (ürün öne çıkarma, mağaza reklamı) niyeti yüksek bir kitleye ulaşır — kullanıcı zaten alışveriş modundadır. Bu büyük bir avantajdır ama iki yapısal sınırı vardır.",
    },
    {
      type: "p",
      text: "Birincisi kitle sınırı: erişebileceğiniz maksimum kişi, o an platformda o kategoriye bakan kullanıcı sayısıdır. Bu havuz sabittir ve siz büyüdükçe genişlemez. İkincisi rekabet sınırı: aynı havuz için aynı kategorideki tüm satıcılarla açık artırmadasınız. Kategori büyüdükçe tıklama maliyeti artar, sizin verimliliğiniz aynı kalsa bile maliyetiniz yükselir.",
    },
    {
      type: "p",
      text: "Meta tarafında ise havuz Türkiye'de 50 milyonu aşan aktif kullanıcıdır ve bu kitlenin büyük kısmı sizi hiç aramamıştır. Yani platform içi reklam “sizi arayanı yakalama”, CPAS ise “sizi tanımayana ulaşma” işidir. İkisi rakip değil, ardışıktır.",
    },

    { type: "h2", text: "Eşik 1: Son 30 günde en az 100 sipariş" },
    {
      type: "p",
      text: "Bu, kanaat değil teknik bir eşiktir. Meta'nın satın alma optimizasyonu, bir reklam setinin öğrenme aşamasından çıkması için haftada yaklaşık 50 dönüşüm ister. Aylık 100 sipariş, CPAS'e aktarılabilecek payla birlikte bu eşiğe yaklaşmanızı sağlar.",
    },
    {
      type: "p",
      text: "Altında kalırsanız ne olur? Algoritma öğrenme aşamasında takılı kalır. Bu durumda maliyetler dalgalanır, ROAS haftadan haftaya sıçrar ve hangi kararın işe yaradığını ayırt edemezsiniz. Bütçe harcanır ama öğrenilen bir şey olmaz — en pahalı senaryo budur.",
    },
    {
      type: "callout",
      title: "Hacim düşükse ne yapmalı?",
      text: "Önce Trendyol içi reklamlar ve fiyat/görsel optimizasyonuyla aylık sipariş sayısını 100'ün üzerine çıkarın. CPAS'i 2–3 ay geciktirmek, hazır olmadan başlayıp bütçe yakmaktan ucuzdur.",
    },

    { type: "h2", text: "Eşik 2: Reklam sonrası katkı marjı" },
    {
      type: "p",
      text: "En çok atlanan hesap budur. Satıcılar brüt marja bakıp karar veriyor, oysa doğru metrik Trendyol komisyonu, kargo, iade ve paketleme düşüldükten sonra kalan katkı marjıdır.",
    },
    {
      type: "table",
      head: ["Kalem", "Örnek (400 ₺'lik ürün)"],
      rows: [
        ["Satış fiyatı", "400 ₺"],
        ["Ürün maliyeti", "180 ₺"],
        ["Trendyol komisyonu (~%18)", "72 ₺"],
        ["Kargo + paketleme", "45 ₺"],
        ["İade karşılığı (~%8)", "32 ₺"],
        ["Kalan katkı marjı", "71 ₺ (%17,8)"],
      ],
    },
    {
      type: "p",
      text: "Bu örnekte başabaş ROAS 400 / 71 ≈ 5,6'dır. Yani kampanya 5,6 ROAS'ın altında kaldığı sürece ciro artar ama kâr azalır. CPAS'in ilk aylarda 3–5 bandında seyrettiğini düşünürsek bu mağaza, öğrenme dönemini zararına finanse etmeye hazır olmalıdır.",
    },
    {
      type: "p",
      text: "Pratik kural: katkı marjınız %25'in üzerindeyse rahat başlarsınız. %15–25 arasındaysa yalnızca yüksek marjlı ürünlerle sınırlı bir katalogla başlayın. %15'in altındaysa önce fiyatlandırma veya maliyet tarafını düzeltin — reklam bu sorunu çözmez, büyütür.",
    },

    { type: "h2", text: "Eşik 3: Katalog genişliği ve derinliği" },
    {
      type: "p",
      text: "CPAS'in en güçlü formatı dinamik katalog reklamıdır: Meta, her kullanıcıya ilgilendiği ürünü otomatik gösterir. Bu formatın çalışması için algoritmanın seçim yapabileceği bir havuz gerekir.",
    },
    {
      type: "ul",
      items: [
        "20+ aktif ürün: dinamik reklamlar anlamlı çalışır, kreatif üretim yükü ortadan kalkar.",
        "10–20 ürün: çalışır ama tek tek kreatif desteği gerekir.",
        "10'un altında: dinamik format zayıflar; statik kreatif ağırlıklı bir kurgu gerekir ve maliyet artar.",
        "Ürün görsellerinin kalitesi ürün sayısından önemlidir. Beyaz fonlu, tek ürünlü, yüksek çözünürlüklü görseller dönüşümü doğrudan etkiler.",
      ],
    },
    {
      type: "p",
      text: "Derinlik de önemli: 200 ürününüz varsa ama 190'ının stoğu tükenmişse, kataloğunuz pratikte 10 ürünlüktür. Reklam öncesi stok temizliği yapılmalıdır.",
    },

    { type: "h2", text: "Eşik 4: Nakit akışı ve sabır penceresi" },
    {
      type: "p",
      text: "CPAS'te reklam bütçesini bugün ödersiniz, Trendyol hakedişiniz ise satış sonrası belirli bir vadede yatar. Bu makas, hızlı büyüyen mağazalarda nakit sıkışması yaratır — büyüdükçe daha çok nakit gerekir.",
    },
    {
      type: "p",
      text: "Bu yüzden pratik kuralımız şu: en az 3 aylık reklam bütçesini önden karşılayabiliyor olun. Öğrenme dönemi 4–6 hafta sürüyor; ikinci ayda kapatılan bir kampanya, yatırımın tam da geri dönmeye başladığı noktada durdurulmuş demektir.",
    },
    {
      type: "table",
      head: ["Aylık sipariş", "Önerilen başlangıç bütçesi", "Beklenen ilk sonuç"],
      rows: [
        ["100–250", "25.000–40.000 ₺/ay", "6. hafta sonunda stabil ROAS"],
        ["250–750", "40.000–90.000 ₺/ay", "4. hafta sonunda stabil ROAS"],
        ["750+", "90.000 ₺+/ay", "3. hafta sonunda stabil ROAS"],
      ],
    },

    { type: "h2", text: "Yılın hangi döneminde başlamalı?" },
    {
      type: "p",
      text: "Dört eşiği de sağlıyorsanız sıradaki soru zamanlama. CPAS'in 4–6 haftalık bir öğrenme dönemi olduğu için başlangıç tarihi, bu dönemin nereye denk geldiğine göre seçilmelidir.",
    },
    {
      type: "table",
      head: ["Başlangıç zamanı", "Değerlendirme"],
      rows: [
        ["Yoğun kampanya döneminin 6–8 hafta öncesi", "İdeal — öğrenme, talebin zirve yaptığı döneme yetişir"],
        ["Kampanya döneminin tam içinde", "Kötü — en pahalı haftalarda öğrenme finanse edilir"],
        ["Sezon dışı ölü dönem", "İyi — kitle maliyeti düşük, öğrenme ucuza tamamlanır"],
        ["Stok belirsizliği olan dönem", "Kötü — stok tükenmesi öğrenmeyi bozar"],
      ],
    },
    {
      type: "p",
      text: "En yaygın zamanlama hatası ikinci satırdır: satıcılar kampanya dönemi yaklaşınca aciliyet hisseder ve tam o hafta CPAS'e başlar. Sonuç, açık artırma maliyetlerinin zirvede olduğu haftalarda öğrenme aşamasını finanse etmektir — aynı öğrenme, altı hafta önce başlansaydı belirgin biçimde ucuza tamamlanacaktı.",
    },
    {
      type: "p",
      text: "Üçüncü satır ise en az kullanılan fırsattır. Ölü sezonda rekabet gevşer, kitle maliyeti düşer ve öğrenme dönemi ucuza tamamlanır. Sezon açıldığında hazır ve öğrenmiş bir hesapla girersiniz. Çoğu satıcının tam tersini yaptığı — ölü sezonda bütçeyi tamamen kestiği — düşünülürse, bu dönem aynı zamanda rekabetin en zayıf olduğu dönemdir.",
    },

    { type: "h2", text: "Geciktirmenin görünmeyen maliyeti" },
    {
      type: "p",
      text: "Dört eşiği de sağlıyorsanız beklemenin bir bedeli var. CPAS kullanan Trendyol satıcısı oranı hâlâ düşük; bu, Meta tarafındaki açık artırmada kategorinizde rekabetin az olduğu anlamına geliyor. Kitle maliyetleri, kategoriye giren satıcı sayısıyla birlikte artıyor.",
    },
    {
      type: "p",
      text: "Ayrıca CPAS'in bir birikim etkisi var: hesabınızın geçmiş dönüşüm verisi arttıkça algoritma daha isabetli çalışıyor. Bugün başlayan mağaza, altı ay sonra başlayan rakibine karşı yalnızca altı aylık ciro değil, altı aylık öğrenme avantajı da kazanıyor.",
    },

    { type: "h2", text: "Geçmeden önce hazırlanacak beş şey" },
    {
      type: "p",
      text: "Karar verdiyseniz, başlamadan önce yapılacak bir hazırlık listesi var. Bunlar kurulumun parçası değil, kurulumun verimini belirleyen ön koşullar — ve hepsi reklam bütçesi harcamadan tamamlanabilir.",
    },
    {
      type: "ol",
      items: [
        "Ürün görsellerini yenileyin. Pazaryeri listelemesinde yeterli olan görsel, Instagram akışında zayıf kalabilir. Beyaz fon, tek ürün, yüksek çözünürlük.",
        "Stok derinliğini kontrol edin. Reklam satışı hızlandırır; en çok satan ürününüzün ikinci haftada tükenmesi, öğrenme aşamasını ortasından keser.",
        "Ürün başlıklarını sadeleştirin. Anahtar kelime yığını yapılmış başlıklar dinamik eşleştirmeyi zayıflatır.",
        "Katkı marjı tablonuzu ürün bazında çıkarın. Hangi ürünün hangi ROAS'ta kâra geçtiğini bilmeden bütçe kararı alamazsınız.",
        "Operasyon metriklerinizi düzeltin. Kargoya veriliş süresi ve iade oranı hem yetkilendirmeyi hem de reklam sonrası dönüşümü doğrudan etkiler.",
      ],
    },
    {
      type: "p",
      text: "Bu beş maddeyi tamamlamak tipik olarak 1–2 hafta alır ve CPAS'in ilk aylardaki performansına, kurulumun kendisinden daha fazla etki eder. Hazırlıksız başlayan mağazalarda öğrenme dönemi hem uzar hem pahalıya gelir.",
    },

    { type: "h2", text: "Karar tablosu" },
    {
      type: "table",
      head: ["Durum", "Öneri"],
      rows: [
        ["4 eşiğin dördü de sağlanıyor", "Hemen başlayın"],
        ["Hacim yeterli, marj dar", "Yüksek marjlı alt katalogla sınırlı başlayın"],
        ["Marj iyi, hacim düşük", "Önce platform içi reklamla hacmi büyütün"],
        ["Katalog dar", "Ürün genişletme + kreatif destekli kurguyla başlayın"],
        ["Nakit akışı gergin", "Bütçeyi düşürmeyin, başlangıcı erteleyin"],
      ],
    },
    {
      type: "p",
      text: "Mağazanızın hangi satırda olduğundan emin değilseniz, iletişim sayfamızdan ücretsiz ön değerlendirme talep edebilirsiniz: sipariş hacminize ve kategori dinamiklerinize bakıp hazır olup olmadığınızı dürüstçe söylüyoruz — hazır değilseniz bunu da söylüyoruz.",
    },
  ],
  faq: [
    {
      question: "Aylık 50 siparişim var, CPAS'e başlayabilir miyim?",
      answer:
        "Teknik olarak evet, ekonomik olarak önerilmez. 50 sipariş, Meta'nın optimizasyon algoritmasının öğrenme aşamasını tamamlaması için gereken haftalık dönüşüm sinyalini üretmez. Önce platform içi reklamlarla hacmi 100+ seviyesine çıkarmak daha verimlidir.",
    },
    {
      question: "CPAS için minimum reklam bütçesi ne kadar olmalı?",
      answer:
        "Aylık 100–250 sipariş bandındaki mağazalar için 25.000–40.000 ₺/ay önerilir. Bunun altındaki bütçelerde günlük harcama, öğrenme aşamasını tamamlayacak hıza ulaşmaz ve süreç gereksiz uzar.",
    },
    {
      question: "Trendyol içi reklamı durdurup CPAS'e mi geçmeliyim?",
      answer:
        "Hayır. İki kanal farklı işlev görür: platform içi reklam sizi arayan niyetli kullanıcıyı yakalar, CPAS sizi tanımayana ulaşır. Doğru strateji ikisini birlikte, ayrı bütçelerle yürütmektir.",
    },
    {
      question: "Sonuç almak ne kadar sürer?",
      answer:
        "Öğrenme aşaması tipik olarak 4–6 hafta sürer. İlk iki hafta maliyetler yüksek görünür; anlamlı ROAS genellikle 4. haftadan sonra oturur. Bu yüzden en az 3 aylık bütçeyi önden planlamak gerekir.",
    },
  ],
};

export default post;
