import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "roas-nasil-yukseltilir-cpas-kampanyalarinda-5-taktik",
  title: "ROAS Nasıl Yükseltilir? CPAS Kampanyalarında 5 Kanıtlanmış Taktik",
  excerpt:
    "CPAS kampanyalarında reklam getirisini somut olarak artıran 5 taktik: bütçe disiplini, katalog hijyeni, kitle genişliği, yeniden pazarlama mimarisi ve anomali takibi.",
  date: "2026-06-02",
  updated: "2026-08-06",
  category: "Optimizasyon",
  keywords: [
    "ROAS nasıl yükseltilir",
    "CPAS optimizasyon",
    "Trendyol ROAS",
    "Meta reklam optimizasyonu",
    "reklam getirisi artırma",
  ],
  content: [
    {
      type: "p",
      text: "ROAS (Return on Ad Spend), harcadığınız her 1 liranın kaç lira ciro döndürdüğünü gösterir. CPAS kampanyalarında ROAS'ı yükseltmenin yolu tek bir gizli ayardan geçmez; birkaç disiplinin üst üste binmesinden geçer. Aşağıdaki beş taktik, yönettiğimiz kampanyalarda tekrar tekrar doğrulanmış olanlar.",
    },
    {
      type: "callout",
      title: "Önce doğru metriği seçin",
      text: "ROAS ciro/harcama oranıdır, kâr oranı değildir. Katkı marjınız %20 ise 5 ROAS başabaştır. Optimizasyon kararlarını “ROAS yükseldi mi” diye değil, “başabaş ROAS'ın ne kadar üstündeyim” diye alın.",
    },

    { type: "h2", text: "Taktik 1: Bütçeyi kazananlara kaydırın" },
    {
      type: "p",
      text: "Çoğu mağazada cironun %70–80'i ürünlerin %20'sinden gelir. Reklam bütçesinin de aynı dağılımı izlemesi gerekir; oysa varsayılan kurulumlarda bütçe kataloğa yayılır ve kaybeden ürünler kazananların payını yer.",
    },
    { type: "h3", text: "Haftalık uygulama" },
    {
      type: "ol",
      items: [
        "Ürün bazında ROAS kırılımını çıkarın (son 14 gün, en az 500 gösterim almış ürünler).",
        "30 gündür dönüşüm getirmeyen ürün setlerini durdurun — silmeyin, durdurun; sezonluk ürünler geri gelebilir.",
        "Başabaş ROAS'ın 1,5 katının üzerindeki setlerin bütçesini %15–20 adımlarla artırın.",
        "Artışı haftada bir defadan fazla yapmayın: ani bütçe sıçraması öğrenme aşamasını yeniden tetikler.",
      ],
    },
    {
      type: "p",
      text: "Buradaki kritik detay adım büyüklüğüdür. Bütçeyi bir gecede ikiye katlamak, Meta'nın reklam setini yeniden öğrenme moduna sokar ve o hafta boyunca performans düşer. Kademeli artış, kazanılmış öğrenmeyi korur.",
    },

    { type: "h2", text: "Taktik 2: Katalog hijyenini koruyun" },
    {
      type: "p",
      text: "CPAS'te reklam kreatifiniz büyük ölçüde ürün kataloğunuzdur. Katalogdaki her hata doğrudan reklam performansına yansır ve bu hataların çoğu sessizce ilerler.",
    },
    {
      type: "table",
      head: ["Katalog sorunu", "Görünen etkisi"],
      rows: [
        ["Stokta olmayan ürünün reklamı dönüyor", "Tıklama parası harcanır, dönüşüm sıfır"],
        ["Panel fiyatı ile katalog fiyatı farklı", "Kullanıcı güveni düşer, sepet terk oranı artar"],
        ["Düşük çözünürlüklü / kolajlı görsel", "Tıklama oranı düşer, gösterim maliyeti artar"],
        ["Başlıkta kategori anahtar kelimesi yok", "Dinamik eşleştirme zayıflar"],
        ["Aynı ürün birden fazla varyant kaydında", "Bütçe kendi içinde bölünür"],
      ],
    },
    {
      type: "p",
      text: "Pratik kontrol: katalog senkronizasyonunun günlük çalıştığını ve son senkron tarihinin bugün olduğunu haftada bir doğrulayın. Senkron kırıldığında sistem hata vermez — sadece eski veriyle reklam vermeye devam eder. Bu, en pahalı sessiz arızadır.",
    },

    { type: "h2", text: "Taktik 3: Geniş hedeflemeye güvenin" },
    {
      type: "p",
      text: "CPAS'te en sık yapılan hata kitleyi aşırı daraltmaktır. Sekiz ilgi alanı, üç yaş aralığı ve iki şehirle kurulan bir reklam seti mantıklı görünür; pratikte algoritmanın elini kolunu bağlar.",
    },
    {
      type: "p",
      text: "Nedeni şu: Meta'nın optimizasyon motoru, kimin satın alacağını sizin tanımladığınız demografiden değil, gerçek dönüşüm sinyalinden öğrenir. Kitleyi daralttığınızda algoritmanın öğrenebileceği örnek sayısını düşürür, öğrenme süresini uzatır ve kişi başı maliyeti artırırsınız.",
    },
    {
      type: "ul",
      items: [
        "Prospecting kampanyalarında yaş/cinsiyet dışında hedefleme kullanmayın; ürün kataloğu zaten güçlü bir sinyaldir.",
        "Ürün setlerini ilgi alanına göre değil, kâr marjına ve kategoriye göre ayırın.",
        "Coğrafi daraltmayı yalnızca kargo veya mevzuat kısıtı varsa yapın.",
        "Test etmek istediğiniz daraltmaları ayrı kampanyada deneyin, ana kampanyayı bozmayın.",
      ],
    },

    { type: "h2", text: "Taktik 4: Yeniden pazarlama mimarisini kurun" },
    {
      type: "p",
      text: "Ürününüzü görüntüleyip almayan kullanıcı, elinizdeki en ucuz dönüşümdür. Bu kitle için kurulan kampanyaların ROAS'ı, genellikle prospecting kampanyalarının 2–3 katıdır. Buna rağmen çoğu hesapta ya hiç yoktur ya da tek bir genel kitle olarak kurulmuştur.",
    },
    {
      type: "p",
      text: "Doğru kurgu, kullanıcıyı satın almaya ne kadar yaklaştığına göre katmanlara ayırmaktır. Her katmanın niyeti farklıdır, dolayısıyla mesajı ve bütçesi de farklı olmalıdır.",
    },
    {
      type: "table",
      head: ["Katman", "Kitle", "Mesaj yaklaşımı"],
      rows: [
        ["1", "Sepete ekleyip almayan (son 7 gün)", "Aciliyet: stok/kampanya süresi vurgusu"],
        ["2", "Ürün görüntüleyip sepete eklemeyen (son 14 gün)", "İkna: yorum sayısı, puan, ürün faydası"],
        ["3", "Mağazanın herhangi bir ürününü görüntüleyen (son 30 gün)", "Genişletme: benzer ve tamamlayıcı ürünler"],
        ["4", "Geçmişte satın alan (son 180 gün)", "Tekrar satın alma: yeni sezon, çapraz satış"],
      ],
    },
    {
      type: "p",
      text: "Dördüncü katman özellikle ihmal edilir. Mevcut müşteriye satmak, yeni müşteri kazanmaktan belirgin biçimde ucuzdur ve pazaryerinde tekrar alım oranı yüksek kategorilerde (kozmetik, gıda takviyesi, bebek ürünleri) toplam ROAS'ı tek başına yukarı çeker.",
    },

    { type: "h2", text: "Taktik 5: Anomalileri erken yakalayın" },
    {
      type: "p",
      text: "ROAS düşüşleri kademeli değil, genellikle ani başlar: bir kreatif yorulur, bir rakip agresif fiyat kırar, bir ürün stok dışına düşer, bir ödeme yöntemi reddedilir. Buradaki fark tespit hızıdır.",
    },
    {
      type: "p",
      text: "Günlük takip eden bir hesapta sorun 24 saatte yakalanır; haftalık bakan bir hesapta 7 günlük bütçe yanmış olur. Aylık bakan bir hesapta ise sorun ancak ay sonu raporunda fark edilir — o noktada kaybın telafisi mümkün değildir.",
    },
    { type: "h3", text: "İzlenmesi gereken sinyaller" },
    {
      type: "ul",
      items: [
        "Frekans 3'ü aştıysa kreatif yorulmuştur; görsel yenilenmelidir.",
        "Tıklama oranı bir haftada %30+ düştüyse rekabet veya fiyat tarafında bir değişiklik vardır.",
        "Sepete ekleme var ama satın alma yoksa fiyat, kargo süresi veya stok tarafına bakın.",
        "Gösterim maliyeti aniden yükseldiyse kategori açık artırmasına yeni bütçe girmiştir.",
        "Dönüşüm sayısı sıfıra düştüyse önce ölçümlemeyi doğrulayın — çoğu zaman satış değil veri akışı durmuştur.",
      ],
    },
    {
      type: "callout",
      title: "En sık yanlış teşhis",
      text: "“Satışlar durdu” vakalarının önemli bir kısmında satışlar aslında devam ediyordur; duran şey Meta'ya giden dönüşüm verisidir. Bütçeyi kısmadan önce mutlaka veri akışını doğrulayın.",
    },

    { type: "h2", text: "Kreatif tarafında kolay kazançlar" },
    {
      type: "p",
      text: "Beş taktik kampanya yapısıyla ilgiliydi. Kreatif tarafında da, çoğu hesapta hiç denenmemiş ve görece hızlı sonuç veren birkaç hamle var.",
    },
    {
      type: "ul",
      items: [
        "Katalog kartına fiyat rozeti ekleyin. Fiyat avantajınız varsa görselde göstermek, tıklama oranını doğrudan yükseltir.",
        "Kullanıcı yorumlarını görsele taşıyın. Pazaryerindeki puan ve yorum sayısı sosyal kanıttır; reklamda görünmediği sürece kullanıcı ürün sayfasına gelene kadar bunu bilmez.",
        "Video test edin. Statik görselle karşılaştırıldığında video, aynı bütçede daha düşük gösterim maliyeti üretebilir; ürünü kullanımda gösteren 8–12 saniyelik basit çekimler yeterlidir.",
        "Metinde teslimat süresini belirtin. Hızlı teslimat bir dönüşüm argümanıdır ve reklam metninde neredeyse hiç kullanılmaz.",
        "Kreatifleri kategori bazında ayrıştırın. Tüm katalog için tek görsel dili kullanmak, güçlü kategorilerin performansını zayıf kategorilerin ortalamasına çeker.",
      ],
    },
    {
      type: "p",
      text: "Bu maddeleri tek tek test edin, hepsini aynı hafta devreye almayın. Beş kreatifi birden yüklemek bütçeyi böler ve hangisinin çalıştığını ölçmeyi imkânsız kılar.",
    },

    { type: "h2", text: "Ölçeklerken ROAS'ı korumak" },
    {
      type: "p",
      text: "Beş taktiği uygulayıp iyi bir ROAS yakaladıktan sonra gelen doğal refleks bütçeyi büyütmektir. Burada bir denge sorunu var: bütçe arttıkça Meta daha geniş kitleye açılmak zorunda kalır ve marjinal kullanıcı, ilk kullanıcı kadar dönüşmez. ROAS'ın ölçeklendikçe bir miktar düşmesi normaldir; mesele bu düşüşü kontrollü tutmaktır.",
    },
    {
      type: "ul",
      items: [
        "Artışı %15–20 adımlarla ve haftada bir yapın. Daha agresif artış öğrenmeyi sıfırlar.",
        "Her artıştan sonra 4–5 gün bekleyip sonucu ölçün; aynı hafta ikinci bir değişiklik yapmayın.",
        "ROAS başabaş noktanızın altına inerse bir önceki bütçe seviyesine dönün ve orada stabilize edin.",
        "Bütçeyi tek kampanyada büyütmek yerine, kanıtlanmış ürün setleri için yeni kampanya açarak yatay büyüyün.",
        "Yeniden pazarlama kampanyalarını sınırsız büyütmeye çalışmayın: kitle sabit büyüklüktedir, bütçe artınca yalnızca frekans yükselir ve verim düşer.",
      ],
    },
    {
      type: "p",
      text: "Son madde en sık yapılan ölçekleme hatasıdır. Yeniden pazarlama kampanyasının ROAS'ı yüksek olduğu için bütçeyi oraya kaydırmak cazip gelir; ancak o kitle, prospecting kampanyalarının beslediği sınırlı bir havuzdur. Prospecting'i kısıp yeniden pazarlamayı büyütmek, kısa vadede raporu güzelleştirir, birkaç hafta içinde her iki kanalı da kurutur.",
    },

    { type: "h2", text: "Taktikleri sıraya koymak" },
    {
      type: "p",
      text: "Beşini aynı hafta uygulamaya çalışmayın; hangi değişikliğin işe yaradığını ayırt edemezsiniz. Önerdiğimiz sıra şudur: önce katalog hijyeni (temel), sonra yeniden pazarlama mimarisi (en hızlı kazanç), sonra bütçe kaydırma (sürekli disiplin), ardından hedefleme sadeleştirme, en son anomali izleme rutini.",
    },
    {
      type: "p",
      text: "CPAS Türkiye'nin aylık yönetim hizmetinde bu döngü haftalık olarak yürütülür: ürün bazlı ROAS analizi, katalog senkron kontrolü, kitle katman bakımı ve 7/24 anomali izleme. Kritik durumlarda aynı gün müdahale edilir, her hafta ne yapıldığı raporda tek tek yazar.",
    },
  ],
  faq: [
    {
      question: "İyi bir ROAS kaçtır?",
      answer:
        "Mutlak bir rakam yoktur; katkı marjınıza bağlıdır. Katkı marjı %20 olan bir üründe başabaş ROAS 5'tir, %40 olan bir üründe 2,5'tir. Doğru soru “ROAS kaç” değil, “başabaş ROAS'ımın ne kadar üstündeyim” sorusudur.",
    },
    {
      question: "ROAS neden aniden düştü?",
      answer:
        "En sık nedenler: kreatif yorgunluğu (frekans 3 üzeri), katalog senkron kopması, stok tükenmesi, rakip fiyat hamlesi veya kategori açık artırmasına yeni bütçe girmesi. Bütçeyi kısmadan önce dönüşüm verisinin Meta'ya akmaya devam ettiğini doğrulayın.",
    },
    {
      question: "Bütçeyi ne sıklıkla artırmalıyım?",
      answer:
        "Haftada bir defadan fazla değil ve %15–20'lik adımlarla. Daha agresif artışlar reklam setini yeniden öğrenme moduna sokar ve o hafta performans düşer.",
    },
    {
      question: "Yeniden pazarlama kampanyasına bütçenin ne kadarını ayırmalıyım?",
      answer:
        "Tipik başlangıç dağılımı %70 prospecting, %30 yeniden pazarlamadır. Yeniden pazarlama kitleleri sınırlı büyüklükte olduğu için daha yüksek pay vermek frekansı hızla yükseltir ve verimi düşürür.",
    },
  ],
};

export default post;
