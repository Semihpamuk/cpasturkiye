import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "cpas-ile-trendyol-ic-reklam-karsilastirma",
  title: "CPAS mi, Trendyol İç Reklam mı? Hangisi Daha Kârlı?",
  excerpt:
    "Trendyol içi reklamlar ile Meta CPAS reklamları arasındaki farkı maliyet, kitle, ölçüm ve ROAS boyutlarıyla karşılaştırıyoruz. Hangi mağaza hangisiyle başlamalı, ikisi nasıl birlikte kullanılır?",
  date: "2026-06-18",
  updated: "2026-08-06",
  category: "Strateji",
  keywords: [
    "CPAS mi Trendyol reklamı mı",
    "Trendyol içi reklam",
    "Trendyol reklam karşılaştırma",
    "pazaryeri reklam stratejisi",
    "Trendyol ROAS karşılaştırma",
  ],
  content: [
    {
      type: "p",
      text: "Trendyol satıcısının önünde iki reklam kanalı var: platform içi reklamlar ve platform dışı CPAS reklamları. Soru genellikle “hangisi daha iyi” diye soruluyor ama doğru soru bu değil. İkisi aynı işi yapmıyor; farklı hunilerde çalışıyorlar. Bu yazıda farkı somutlaştırıp hangi mağazanın hangisiyle başlaması gerektiğini netleştiriyoruz.",
    },

    { type: "h2", text: "Temel fark: niyet mi, erişim mi?" },
    {
      type: "p",
      text: "Trendyol içi reklam, niyet satın alır. Kullanıcı zaten Trendyol'dadır, zaten o kategoriye bakmaktadır, satın almaya hazırdır. Siz sadece sıralamada öne geçmek için ödersiniz.",
    },
    {
      type: "p",
      text: "CPAS ise erişim satın alır. Kullanıcı Instagram'da akışını kaydırırken karşısına çıkarsınız — o an ürününüzü aramıyordur, hatta markanızı bilmiyordur. Talebi yakalamazsınız, yaratırsınız.",
    },
    {
      type: "callout",
      title: "Kritik sonuç",
      text: "Platform içi reklam mevcut talebi bölüşür; CPAS yeni talep getirir. Kategorinizde arama hacmi sınırlıysa platform içi reklamla büyümenin bir tavanı vardır — o tavanı ancak dışarıdan trafik getirerek aşarsınız.",
    },

    { type: "h2", text: "Boyut boyut karşılaştırma" },
    {
      type: "table",
      head: ["Kriter", "Trendyol içi reklam", "CPAS (Meta)"],
      rows: [
        ["Kitle havuzu", "O an platformda gezinen kullanıcılar", "Türkiye'deki Facebook/Instagram kullanıcıları"],
        ["Kullanıcı niyeti", "Yüksek (aktif arama)", "Düşük–orta (keşif)"],
        ["Tipik ROAS bandı", "2–4", "4–8 (oturduktan sonra)"],
        ["Sonuç alma hızı", "Aynı gün", "4–6 hafta öğrenme"],
        ["Kurulum zorluğu", "Düşük", "Yüksek"],
        ["Marka bilinirliğine katkı", "Düşük", "Yüksek"],
        ["Rekabetin yönü", "Aynı kategorideki satıcılar", "Meta'daki tüm reklamverenler"],
        ["Maliyet trendi", "Kategori büyüdükçe artıyor", "Kategoride CPAS kullanımı düşük olduğu için görece uygun"],
      ],
    },
    {
      type: "p",
      text: "Tablodaki “sonuç alma hızı” satırı, iki kanalın nakit akışı açısından nasıl farklı davrandığını açıklar. Platform içi reklam bugün açtığınız bütçeyi bugün ciroya çevirir. CPAS ise ilk haftalarda yatırım, sonraki haftalarda getiri üretir. Bu fark, hangi kanala ne zaman ağırlık vereceğinizi belirler.",
    },

    { type: "h2", text: "ROAS karşılaştırması neden yanıltıcı olabilir?" },
    {
      type: "p",
      text: "Ham ROAS rakamlarına bakıldığında platform içi reklam çoğu zaman daha iyi görünür — özellikle ilk aylarda. Ama iki çarpıtma var.",
    },
    {
      type: "ol",
      items: [
        "Kannibalizasyon: Platform içi reklamla kazandığınız satışların bir kısmını, reklam vermeseniz de organik olarak alacaktınız. Kullanıcı sizi zaten arıyordu; siz yalnızca sıralamada öne geçtiniz. Bu satışlar ROAS'a tam yazılır ama gerçek artışın tamamı değildir.",
        "Gecikmeli etki: CPAS'in yarattığı marka farkındalığı, günler sonra doğrudan Trendyol araması olarak geri döner. Bu satış organik görünür, CPAS'in hanesine yazılmaz. Yani CPAS'in gerçek katkısı raporda göründüğünden yüksektir.",
      ],
    },
    {
      type: "p",
      text: "Doğru ölçüm yöntemi artımsal bakmaktır: kanalı açtığınızda toplam ciro ne kadar arttı, kapattığınızda ne kadar düştü? Tek kanalın panel ROAS'ına bakarak karar vermek, iki kanalın da gerçek katkısını yanlış okumaya yol açar.",
    },

    { type: "h2", text: "Yönetim yükü açısından fark" },
    {
      type: "p",
      text: "Karşılaştırmalarda genellikle atlanan bir boyut var: iki kanalın işletme maliyeti aynı değil. Platform içi reklam görece basit bir mekanizmadır — teklif ve bütçe ayarlanır, sonuç birkaç gün içinde görünür. Haftalık birkaç saatlik takip çoğu mağaza için yeterlidir.",
    },
    {
      type: "p",
      text: "CPAS ise sürekli bakım isteyen bir sistemdir: katalog senkronu, kreatif yorgunluğu, kitle katmanları, öğrenme aşaması yönetimi ve ölçüm doğrulaması. Bunların hiçbiri bir defa kurulup unutulabilecek işler değildir. Gerçekçi tahmin, haftada 4–6 saat uzman zamanıdır.",
    },
    {
      type: "p",
      text: "Bu fark, kanal seçimini de etkiler. Ekibinizde bu zamanı ayıracak kimse yoksa CPAS'i ya dışarıdan yönettirmeniz ya da beklemeniz gerekir. Bakımsız bırakılmış bir CPAS hesabı, ilk aylarda iyi çalışıp altıncı aydan sonra sessizce verim kaybeder — ve bu kayıp panelde tek bir kırmızı uyarı olarak görünmez, yavaş yavaş düşen bir ROAS eğrisi olarak birikir.",
    },

    { type: "h2", text: "Hangi mağaza hangisiyle başlamalı?" },
    {
      type: "table",
      head: ["Mağaza profili", "Öncelik"],
      rows: [
        ["Aylık 100 siparişin altında", "Platform içi reklam — önce hacim"],
        ["Aylık 100–300 sipariş, marj %25+", "İkisi birlikte, bütçe ağırlığı platform içinde"],
        ["Aylık 300+ sipariş", "CPAS ağırlıklı, platform içi savunma amaçlı"],
        ["Kategoride arama hacmi düşük / niş ürün", "CPAS öncelikli — talep yaratmak zorundasınız"],
        ["Kategoride rekabet çok yüksek", "CPAS öncelikli — platform içi maliyet sürdürülemez"],
        ["Marka bilinirliği hedefi var", "CPAS"],
      ],
    },
    {
      type: "p",
      text: "Dördüncü satır özellikle önemli. Niş ürün satan mağazalar platform içi reklamda takılır: arama hacmi olmayan bir ürüne, arama sonuçlarında öne çıkarak satış yapamazsınız. Bu mağazalar için CPAS bir seçenek değil, tek yoldur.",
    },

    { type: "h2", text: "Kampanya dönemlerinde bütçe nasıl kaydırılır?" },
    {
      type: "p",
      text: "Efsane Günler, Kasım indirimleri ve sezon geçişleri iki kanalın dengesini geçici olarak değiştirir. Bu dönemlerde aynı bütçe dağılımını sürdürmek, en pahalı haftalarda en verimsiz kanalda kalmak anlamına gelebilir.",
    },
    {
      type: "table",
      head: ["Dönem", "Platform içi", "CPAS"],
      rows: [
        ["Kampanya öncesi 2 hafta", "Normal", "Artır — ürün görüntüleme kitlesi biriktirin"],
        ["Kampanya günleri", "Artır — arama hacmi zirvede", "Yeniden pazarlamaya yoğunlaştırın"],
        ["Kampanya sonrası 1 hafta", "Azalt", "Normal — biriken kitleye satış yapın"],
        ["Sezon dışı ölü dönem", "Azalt", "Normal — talep yaratma dönemi"],
      ],
    },
    {
      type: "p",
      text: "Tablodaki ilk satır en çok atlanan hamledir. Kampanya günlerinde açık artırma maliyeti her iki kanalda da zirve yapar; asıl kazanç, kampanyadan önceki iki hafta boyunca CPAS ile ucuza kitle biriktirip kampanya günlerinde bu kitleye yeniden pazarlama yapmaktan gelir. Kampanya başladığında kitle kurmaya çalışmak, en pahalı anda en pahalı işi yapmaktır.",
    },
    {
      type: "p",
      text: "Sezon dışı dönemlerde ise mantık tersine döner: platform içi reklamda arama hacmi düştüğü için harcanan her lira daha az iş görür, CPAS'te ise rekabet gevşediği için kitle maliyeti düşer. Ölü sezon, talep yaratmanın en ucuz olduğu dönemdir — çoğu satıcı tam tersini yapıp bütçeyi tamamen keser.",
    },

    { type: "h2", text: "İkisini birlikte kullanmanın doğru kurgusu" },
    {
      type: "p",
      text: "Olgun bir mağazada iki kanal birbirini besler. Önerdiğimiz iş bölümü şudur.",
    },
    {
      type: "ul",
      items: [
        "Platform içi reklam: en çok arananan ve en yüksek dönüşümlü ürünlerinizde savunma. Amaç, sizi arayan kullanıcıyı rakibe kaptırmamak.",
        "CPAS prospecting: markanızı hiç tanımayan kitleye ulaşım. Amaç, huninin üstünü genişletmek.",
        "CPAS yeniden pazarlama: her iki kanaldan gelen ama satın almayan kullanıcıları geri getirme. Amaç, kazanılmış ilgiyi ciroya çevirmek.",
        "Bütçe dağılımı başlangıç için: %40 platform içi, %40 CPAS prospecting, %20 CPAS yeniden pazarlama. Veri geldikçe artımsal katkıya göre kaydırın.",
      ],
    },
    {
      type: "p",
      text: "Üçüncü madde iki kanalı gerçekten birleştiren yerdir: platform içi reklamla gelip almayan kullanıcıyı CPAS yeniden pazarlamasıyla geri getirirsiniz. Bu köprüyü kurmayan mağazalar, iki kanalı ayrı ayrı çalıştırıp toplam verimin altında kalırlar.",
    },

    { type: "h2", text: "İki kanalın raporunu birlikte okumak" },
    {
      type: "p",
      text: "İki kanalı birlikte çalıştırdığınızda karşılaşacağınız ilk pratik sorun raporlamadır: iki panel, iki farklı ciro rakamı verir ve toplamları gerçek cironuzu aşar. Bunun nedeni hile değil, atıf mantığıdır — aynı satışı iki sistem de kendi hanesine yazabilir.",
    },
    {
      type: "p",
      text: "Kullanılabilir tek referans, pazaryeri panelindeki toplam cironuzdur. Karar alırken şu üçlüyü aynı tabloda tutun: toplam ciro, toplam reklam harcaması ve bu ikisinin oranı. Panel ROAS'ları yalnızca kanal içi kıyaslama için kullanılmalıdır — hangi ürün setinin diğerinden iyi çalıştığını görmek gibi.",
    },
    {
      type: "table",
      head: ["Soru", "Hangi veriye bakılır"],
      rows: [
        ["Toplam reklam yatırımım kâr getiriyor mu", "Pazaryeri toplam ciro / toplam reklam harcaması"],
        ["Hangi kanal daha verimli", "Kanalı 2 hafta kapatıp toplam cirodaki değişim"],
        ["Hangi ürün seti çalışıyor", "Kanal içi panel ROAS'ı (kanallar arası kıyaslamayın)"],
        ["Bütçeyi artırmalı mıyım", "Son artıştan sonra toplam cironun artış hızı"],
      ],
    },
    {
      type: "p",
      text: "İkinci satırdaki testi yılda bir–iki kez yapmakta fayda var. İki hafta boyunca bir kanalı kapatmak kısa vadede ciro kaybettirir ama karşılığında elde ettiğiniz bilgi — o kanalın gerçek artımsal katkısı — aylarca doğru bütçe kararı almanızı sağlar.",
    },

    { type: "h2", text: "Özet" },
    {
      type: "p",
      text: "Platform içi reklam sizi arayanı yakalar, CPAS sizi tanımayana ulaşır. Küçük mağazalar için platform içi reklam daha güvenli bir başlangıçtır; belirli bir hacimden sonra ise büyümenin motoru CPAS olur. Doğru soru “hangisi” değil, “hangi oranda” sorusudur ve bu oran mağaza büyüdükçe CPAS lehine kayar.",
    },
    {
      type: "p",
      text: "CPAS Türkiye'nin yönetim hizmetinde her iki kanalın verisi birlikte değerlendirilir; bütçenin nereye gitmesi gerektiğine panel ROAS'ıyla değil, artımsal katkıyla karar verilir.",
    },
  ],
  faq: [
    {
      question: "Trendyol içi reklamı bırakıp tamamen CPAS'e geçebilir miyim?",
      answer:
        "Önerilmez. Platform içi reklamı tamamen kapatmak, sizi arayan niyetli kullanıcıyı rakiplerinize bırakmak demektir. Olgun mağazalarda doğru kurgu, platform içi reklamı en çok arananan ürünlerde savunma amaçlı sürdürüp büyümeyi CPAS'ten almaktır.",
    },
    {
      question: "Hangisi daha ucuz?",
      answer:
        "Tıklama maliyeti genellikle CPAS'te daha düşüktür çünkü Meta'daki kitle havuzu çok daha geniştir. Ancak dönüşüm oranı platform içinde daha yüksektir. Net maliyeti belirleyen, tıklama fiyatı değil sipariş başına maliyettir ve bu kategoriye göre değişir.",
    },
    {
      question: "İki kanalı aynı anda çalıştırmak veriyi bozar mı?",
      answer:
        "Hayır, ancak ölçümü zorlaştırır. Panel ROAS'ları çakışabilir; bu yüzden kararları tek kanalın panel rakamına göre değil, kanal açık/kapalı dönemlerdeki toplam ciro değişimine göre almak gerekir.",
    },
    {
      question: "Bütçemi nasıl bölmeliyim?",
      answer:
        "Başlangıç için %40 platform içi, %40 CPAS prospecting, %20 CPAS yeniden pazarlama iyi bir dağılımdır. İlk 6–8 hafta sonunda artımsal katkı verisi oluştuğunda oranları buna göre kaydırın.",
    },
  ],
};

export default post;
