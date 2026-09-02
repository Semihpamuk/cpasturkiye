import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "cpas-maliyeti-ve-butce-planlamasi",
  title: "CPAS Maliyeti Ne Kadar? 2026 Bütçe Planlama Rehberi",
  excerpt:
    "CPAS'in gerçek maliyeti kaç kalemden oluşuyor? Reklam bütçesi, kurulum, yönetim ve gizli maliyetler. Mağaza büyüklüğüne göre gerçekçi bütçe tabloları ve başabaş ROAS hesabı.",
  date: "2026-08-06",
  category: "Fiyatlandırma",
  keywords: [
    "CPAS maliyeti",
    "CPAS fiyat",
    "CPAS reklam bütçesi",
    "Trendyol reklam bütçesi",
    "CPAS kurulum ücreti",
  ],
  content: [
    {
      type: "p",
      text: "“CPAS ne kadara mal olur?” sorusunun tek rakamlı bir cevabı yok, çünkü maliyet tek kalemden oluşmuyor. Bu yazıda kalemleri tek tek ayırıyor, mağaza büyüklüğüne göre gerçekçi bütçe aralıkları veriyor ve en önemlisi başabaş noktasını nasıl hesaplayacağınızı gösteriyoruz.",
    },

    { type: "h2", text: "Bütçe sorusunun neden tek cevabı yok?" },
    {
      type: "p",
      text: "Aynı sektörde, aynı ciroda iki mağazanın CPAS bütçesi ikiye katlık fark gösterebilir. Nedeni keyfi değil: bütçeyi belirleyen şey cironuz değil, sipariş başına maliyetiniz ve öğrenme için gereken dönüşüm sayısıdır.",
    },
    {
      type: "p",
      text: "Sepet ortalaması 200 ₺ olan bir mağaza ile 2.000 ₺ olan mağaza aynı ciroya farklı sipariş sayılarıyla ulaşır. Meta'nın algoritması ciroyu değil sipariş sayısını sinyal olarak kullandığı için, yüksek sepetli mağaza aynı öğrenme hızına ulaşmak üzere orantısal olarak daha fazla harcamak zorunda kalır.",
    },
    {
      type: "p",
      text: "Bu yüzden aşağıdaki tablolarda cironuza değil, aylık sipariş sayınıza bakın. Sipariş sayısı, CPAS bütçesinin doğru çapasıdır.",
    },

    { type: "h2", text: "Maliyet üç kalemden oluşur" },
    {
      type: "table",
      head: ["Kalem", "Kime ödenir", "Sıklık"],
      rows: [
        ["Reklam bütçesi", "Doğrudan Meta'ya", "Sürekli (günlük harcama)"],
        ["Kurulum", "Ajans / kendi iş gücünüz", "Tek seferlik"],
        ["Yönetim", "Ajans / kendi iş gücünüz", "Aylık (isteğe bağlı)"],
      ],
    },
    {
      type: "callout",
      title: "En sık karıştırılan nokta",
      text: "Reklam bütçesi ajansa ödenmez. Meta'ya kendi reklam hesabınızdan doğrudan ödersiniz; para üçüncü taraf üzerinden geçmez. Ajans ücreti, bu bütçenin yönetimi için ayrı bir kalemdir.",
    },

    { type: "h2", text: "1. Reklam bütçesi: asıl büyük kalem" },
    {
      type: "p",
      text: "Toplam harcamanın büyük çoğunluğu burasıdır ve doğrudan Meta'ya gider. Bütçenin ne kadar olması gerektiğini belirleyen şey mağazanızın hacmi değil, algoritmanın öğrenmesi için gereken dönüşüm sinyalidir.",
    },
    {
      type: "p",
      text: "Meta'nın satın alma optimizasyonu, bir reklam setinin öğrenme aşamasından çıkması için haftada yaklaşık 50 dönüşüm ister. Sipariş başına maliyetiniz 120 ₺ ise haftada 6.000 ₺, ayda yaklaşık 26.000 ₺ harcamanız gerekir. Bütçe bunun altına düştüğünde süreç bitmez, sadece uzar — ve uzayan her hafta daha fazla para yakar.",
    },
    {
      type: "table",
      head: ["Aylık sipariş hacmi", "Önerilen reklam bütçesi", "Öğrenmenin tamamlanma süresi"],
      rows: [
        ["100–250", "25.000–40.000 ₺/ay", "5–6 hafta"],
        ["250–750", "40.000–90.000 ₺/ay", "4 hafta"],
        ["750–2.000", "90.000–200.000 ₺/ay", "3 hafta"],
        ["2.000+", "200.000 ₺+/ay", "2–3 hafta"],
      ],
    },
    {
      type: "p",
      text: "Tablodaki en önemli sütun sonuncusu. Düşük bütçe “daha az risk” gibi görünür ama öğrenme süresini uzattığı için toplam maliyeti artırır: 6 hafta boyunca düşük verimle harcamak, 3 hafta boyunca yeterli bütçeyle harcamaktan pahalıya gelir.",
    },

    { type: "h2", text: "2. Kurulum maliyeti" },
    {
      type: "p",
      text: "Kurulum, tek seferlik bir teknik iştir: yetkilendirme takibi, Meta işletme doğrulaması, katalog bağlantısı, ürün seti mimarisi, ölçümleme doğrulaması ve kampanya kurulumu.",
    },
    {
      type: "p",
      text: "Kendiniz yaparsanız nakit maliyeti sıfırdır ama iş gücü maliyeti gerçektir: deneyimsiz bir ekipte süreç tipik olarak 3–4 haftaya yayılır ve bu sürede yapılan bir ölçümleme hatası haftalarca yanlış veriyle karar almanıza yol açabilir. Ajansla çalışmanın ekonomik gerekçesi burasıdır: kurulum ücreti, hatalı kurulumun bütçe maliyetinden düşükse mantıklıdır.",
    },
    {
      type: "p",
      text: "CPAS Türkiye'de kurulum paketi 30.000 ₺ + KDV'dir ve ilk ayın yönetimini de kapsar. İkinci bir pazaryeri eklerseniz %50 indirimli, havale/EFT ile öderseniz %5 indirimli işler.",
    },

    { type: "h2", text: "3. Yönetim maliyeti" },
    {
      type: "p",
      text: "Kurulum bir defalık, yönetim süreklidir. Haftalık optimizasyon döngüsü olmayan bir CPAS hesabı, birkaç ay içinde verimini kaybeder: kreatifler yorulur, katalog senkronu sessizce kırılır, kazanan ürünler değişir ama bütçe eski dağılımda kalır.",
    },
    {
      type: "ul",
      items: [
        "Ürün bazlı ROAS analizi ve bütçe kaydırma — haftalık",
        "Katalog senkron ve stok doğrulaması — haftalık",
        "Kreatif yorgunluğu takibi (frekans kontrolü) — haftalık",
        "Yeniden pazarlama katman bakımı — iki haftalık",
        "Anomali izleme (ani ROAS düşüşü, veri akışı kesintisi) — sürekli",
        "Strateji ve ölçekleme kararları — aylık",
      ],
    },
    {
      type: "p",
      text: "Bu işi kendi ekibinizle yapacaksanız, gerçekçi bir tahmin haftada 4–6 saat uzman zamanıdır. Ajansla yapacaksanız CPAS Türkiye'de aylık yönetim 17.000 ₺ + KDV'dir ve taahhüt yoktur — dilediğiniz ay sonunda durdurabilirsiniz, kurulan altyapı sizin hesaplarınızda kalır.",
    },

    { type: "h2", text: "Bütçeyi kampanyalara nasıl dağıtmalı?" },
    {
      type: "p",
      text: "Toplam bütçe kadar, o bütçenin kampanyalar arasında nasıl dağıldığı da sonucu belirler. Aynı 40.000 ₺, yanlış dağıtıldığında iyi dağıtılmış 25.000 ₺'den kötü çalışır.",
    },
    {
      type: "table",
      head: ["Kampanya", "Başlangıç payı", "Olgunlaşmış hesapta"],
      rows: [
        ["Prospecting — yüksek marjlı ürünler", "%45", "%50"],
        ["Prospecting — geniş katalog", "%25", "%20"],
        ["Yeniden pazarlama — sepet terk", "%15", "%15"],
        ["Yeniden pazarlama — ürün görüntüleme", "%15", "%15"],
      ],
    },
    {
      type: "p",
      text: "Yeniden pazarlama paylarının olgunlaşmayla birlikte artmaması dikkat çekici olabilir. Nedeni şu: bu kitleler sınırlı büyüklüktedir ve bütçeyi artırdığınızda yeni kişiye ulaşmazsınız, aynı kişiye daha çok reklam gösterirsiniz. Frekans yükselir, verim düşer. Yeniden pazarlamayı büyütmenin tek gerçek yolu, prospecting'i büyütüp havuzu beslemektir.",
    },
    {
      type: "p",
      text: "İlk 4–6 hafta boyunca bu dağılıma sadık kalın. Öğrenme tamamlanmadan bütçeyi kazanan gibi görünen kampanyaya kaydırmak, henüz oturmamış bir veriye göre karar vermek demektir.",
    },

    { type: "h2", text: "Başabaş noktasını hesaplama" },
    {
      type: "p",
      text: "Bütçe planlamasının asıl sorusu “ne kadar harcayacağım” değil, “bu harcama hangi ROAS'ta kâra geçer” sorusudur. Hesap basittir ama çoğu satıcı brüt marjla yaptığı için yanlış çıkar.",
    },
    {
      type: "table",
      head: ["Kalem", "Örnek (600 ₺'lik ürün)"],
      rows: [
        ["Satış fiyatı", "600 ₺"],
        ["Ürün maliyeti", "260 ₺"],
        ["Pazaryeri komisyonu (~%18)", "108 ₺"],
        ["Kargo + paketleme", "50 ₺"],
        ["İade karşılığı (~%8)", "48 ₺"],
        ["Katkı marjı", "134 ₺ (%22,3)"],
        ["Başabaş ROAS", "600 / 134 ≈ 4,5"],
      ],
    },
    {
      type: "p",
      text: "Bu mağaza için 4,5'in altındaki her ROAS ciroyu artırır ama kârı azaltır. Yönetim ücretini de hesaba katarsanız gerçek hedef biraz daha yukarıdadır: aylık 40.000 ₺ reklam bütçesi ve 17.000 ₺ yönetim ücretiyle çalışan bu mağaza, yönetim dahil başabaş için yaklaşık 6,4 ROAS'a ihtiyaç duyar.",
    },
    {
      type: "callout",
      title: "Doğru kıyaslama",
      text: "Yönetim ücretini maliyet olarak değil, ROAS farkı olarak değerlendirin. Yönetimli hesap 7 ROAS, yönetimsiz hesap 4 ROAS üretiyorsa, 40.000 ₺ bütçede aradaki fark aylık 120.000 ₺ cirodur — yönetim ücretinin çok üstünde.",
    },

    { type: "h2", text: "Bütçeye yazılmayan gizli maliyetler" },
    {
      type: "p",
      text: "Planlama yaparken çoğu satıcı yalnızca reklam ve hizmet kalemlerini toplar. Oysa CPAS'e geçiş, doğrudan reklamla ilgisi olmayan birkaç maliyeti daha tetikler ve bunları önceden görmemek üçüncü ayda nakit sıkışması yaratır.",
    },
    {
      type: "table",
      head: ["Gizli kalem", "Tipik büyüklük", "Neden ortaya çıkar"],
      rows: [
        ["Görsel yenileme", "Kategoriye göre değişir", "Katalog görselleri Instagram'da zayıf kalıyorsa dönüşüm düşer"],
        ["Stok derinliği", "Ciro artışıyla orantılı", "Reklam satışı hızlandırır, stoksuz kalan ürün reklamdan düşer"],
        ["İade oranı artışı", "%1–3 puan", "Keşif kanalından gelen müşteride iade oranı arama kanalından yüksektir"],
        ["Kargo ve operasyon", "Sipariş sayısıyla orantılı", "Artan hacim paketleme ve kargo kapasitesi ister"],
        ["Nakit akışı makası", "1–2 aylık reklam bütçesi", "Reklam bugün ödenir, pazaryeri hakedişi vadeli yatar"],
      ],
    },
    {
      type: "p",
      text: "Son satır en kritik olanıdır ve büyüdükçe büyür. Aylık 40.000 ₺ reklam harcayan bir mağaza, hakediş vadesi nedeniyle pratikte sürekli 40.000–80.000 ₺'lik bir açık pozisyon taşır. Bu tutar bir maliyet değil, bağlanmış sermayedir — ama nakit planlamasında maliyet gibi davranır.",
    },
    {
      type: "p",
      text: "Üçüncü satır da hafife alınmamalı. Keşif kanalından gelen müşteri, ürünü arayarak bulan müşteriye göre daha az kararlıdır; iade oranı birkaç puan yükselir. Başabaş ROAS hesabınızda kullandığınız iade karşılığını, CPAS'e geçtikten sonra gerçek veriyle güncelleyin — aksi halde kâr hesabınız olduğundan iyimser kalır.",
    },

    { type: "h2", text: "İlk 3 ay için örnek bütçe planı" },
    {
      type: "table",
      head: ["Ay", "Reklam bütçesi", "Hizmet", "Toplam nakit"],
      rows: [
        ["1. ay", "30.000 ₺", "30.000 ₺ (kurulum + ilk ay yönetim)", "60.000 ₺"],
        ["2. ay", "35.000 ₺", "17.000 ₺ (yönetim)", "52.000 ₺"],
        ["3. ay", "45.000 ₺", "17.000 ₺ (yönetim)", "62.000 ₺"],
      ],
    },
    {
      type: "p",
      text: "Rakamlar KDV hariçtir ve aylık 100–250 sipariş bandındaki bir mağaza içindir. Reklam bütçesinin aydan aya artması tesadüf değil: öğrenme tamamlandıkça verim artar ve bütçeyi artırmanın getirisi yükselir. Doğru sıralama önce öğrenmeyi tamamlamak, sonra ölçeklemektir.",
    },
    {
      type: "p",
      text: "Nakit akışı açısından kritik nokta şudur: reklam bütçesini bugün ödersiniz, pazaryeri hakedişiniz vadeli yatar. Bu makas büyüdükçe genişler. Bu yüzden en az 3 aylık toplam nakdi önden planlamanızı öneriyoruz.",
    },
  ],
  faq: [
    {
      question: "CPAS için minimum bütçe ne kadar?",
      answer:
        "Aylık 100–250 sipariş bandındaki mağazalar için 25.000–40.000 ₺/ay reklam bütçesi öneriyoruz. Bunun altındaki bütçelerde Meta'nın öğrenme aşaması tamamlanmaz; süreç uzar ve toplam maliyet artar.",
    },
    {
      question: "Reklam bütçesini ajansa mı ödüyorum?",
      answer:
        "Hayır. Reklam bütçesi doğrudan kendi Meta reklam hesabınızdan Meta'ya ödenir; para ajans üzerinden geçmez. Ajans ücreti, bu bütçenin kurulumu ve yönetimi için ayrı bir kalemdir.",
    },
    {
      question: "CPAS kurulum ücreti ne kadar?",
      answer:
        "CPAS Türkiye'de kurulum paketi 30.000 ₺ + KDV'dir ve ilk ayın yönetimini kapsar. İkinci pazaryeri %50 indirimli eklenir, havale/EFT ödemelerinde %5 indirim uygulanır.",
    },
    {
      question: "Başabaş ROAS nasıl hesaplanır?",
      answer:
        "Satış fiyatını katkı marjına bölersiniz. Katkı marjı, satış fiyatından ürün maliyeti, pazaryeri komisyonu, kargo/paketleme ve iade karşılığı düşüldükten sonra kalan tutardır. Brüt marjla yapılan hesap gerçek başabaş noktasını olduğundan düşük gösterir.",
    },
    {
      question: "Aylık yönetim zorunlu mu?",
      answer:
        "Hayır, taahhüt yoktur. Kurulumu alıp yönetimi kendiniz yapabilirsiniz; kurulan altyapı sizin hesaplarınızda kalır. Yönetimi bırakırsanız haftalık optimizasyon döngüsünü kendi ekibinizle sürdürmeniz gerekir — gerçekçi tahmin haftada 4–6 saat uzman zamanıdır.",
    },
  ],
};

export default post;
