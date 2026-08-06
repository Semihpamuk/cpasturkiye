import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "cpas-ajansi-nasil-secilir",
  title: "CPAS Ajansı Nasıl Seçilir? Sormanız Gereken 10 Soru",
  excerpt:
    "CPAS yönetimi için ajans seçerken neye bakmalı? Fiyat modelinden veri sahipliğine, raporlamadan çıkış koşullarına kadar sormanız gereken 10 soru ve doğru cevapların nasıl göründüğü.",
  date: "2026-08-06",
  category: "Strateji",
  keywords: [
    "CPAS ajansı",
    "CPAS ajans seçimi",
    "Trendyol reklam ajansı",
    "pazaryeri reklam ajansı",
    "CPAS yönetim hizmeti",
  ],
  content: [
    {
      type: "p",
      text: "CPAS yönetimi görece yeni bir uzmanlık alanı. Bu da şu anlama geliyor: “CPAS ajansı” diyen herkesin gerçekten CPAS deneyimi yok. Klasik Meta reklamcılığıyla CPAS arasındaki farkları bilmeyen bir ekip, hesabınızda öğrenirken siz bütçenizle ödersiniz.",
    },
    {
      type: "p",
      text: "Aşağıdaki on soru, görüşmede ayırt edici olan sorular. Her sorunun altında doğru cevabın nasıl göründüğünü ve hangi cevabın uyarı işareti olduğunu yazdık.",
    },

    { type: "h2", text: "Görüşmeye nasıl hazırlanmalı?" },
    {
      type: "p",
      text: "İyi bir görüşme, elinizde rakam olduğunda mümkün olur. Aşağıdaki beş veriyi hazırlayıp gidin: hem daha isabetli teklif alırsınız, hem karşınızdakinin ne kadar derinlemesine düşündüğünü test edebilirsiniz.",
    },
    {
      type: "ul",
      items: [
        "Son 3 ayın aylık sipariş sayısı ve ciro",
        "Ürün bazında katkı marjı (komisyon, kargo ve iade düşülmüş)",
        "Aktif ürün sayısı ve en çok satan 10 ürün",
        "Mevcut platform içi reklam harcaması ve ROAS'ı",
        "İade oranı ve ortalama kargoya veriliş süresi",
      ],
    },
    {
      type: "p",
      text: "Bu verileri paylaştığınızda dikkat edin: karşınızdaki ekip bunları teklife nasıl yansıtıyor? Katkı marjınıza bakıp gerçekçi bir başabaş ROAS söyleyebiliyorlar mı, yoksa herkese aynı standart teklifi mi veriyorlar? İkincisi, sonraki aylarda alacağınız hizmetin de standart olacağının işaretidir.",
    },

    { type: "h2", text: "1. Reklam bütçesi kimin hesabından çıkıyor?" },
    {
      type: "p",
      text: "Doğru cevap: sizin kendi Meta reklam hesabınızdan, doğrudan Meta'ya. Ajans yalnızca yönetir.",
    },
    {
      type: "p",
      text: "Uyarı işareti: bütçenin ajansın hesabından geçmesi. Bu durumda harcamanın gerçek dağılımını göremezsiniz, ilişki bittiğinde geçmiş veriyi kaybedersiniz ve ajans ile aranızda gereksiz bir mali risk oluşur.",
    },

    { type: "h2", text: "2. Hesaplar ve veriler kimin mülkiyetinde?" },
    {
      type: "p",
      text: "Doğru cevap: Meta Business Manager, reklam hesabı, katalog bağlantısı ve kampanya yapıları sizin adınıza kurulur ve sizde kalır. Ajans yalnızca erişim yetkisi alır.",
    },
    {
      type: "p",
      text: "Uyarı işareti: “biz kendi BM'imizden yönetiyoruz” cevabı. Ayrıldığınızda hesap geçmişi, kitleler ve öğrenilmiş optimizasyon verisi sizinle gelmez — sıfırdan başlarsınız. Bu, sessiz bir kilitlenme mekanizmasıdır.",
    },

    { type: "h2", text: "3. Daha önce kaç CPAS hesabı kurdunuz?" },
    {
      type: "p",
      text: "Doğru cevap: somut sayı ve kategori örnekleri. “Meta reklamı yönetiyoruz” yeterli değildir — CPAS'in katalog segmentasyonu, pazaryeri olay eşleştirmesi ve yetkilendirme zinciri klasik Meta reklamcılığında karşılaşılmayan konulardır.",
    },
    {
      type: "p",
      text: "Uyarı işareti: konunun sürekli genel Meta reklamcılığına kayması, pazaryeri yetkilendirme sürecine dair somut detay verilememesi.",
    },

    { type: "h2", text: "4. Kurulum tam olarak neyi kapsıyor?" },
    {
      type: "p",
      text: "Doğru cevap: yetkilendirme takibi, Meta işletme doğrulaması, katalog bağlantısı ve segmentasyon, ölçümleme doğrulaması, kampanya mimarisi ve canlıya alma — kalem kalem yazılı.",
    },
    {
      type: "p",
      text: "Uyarı işareti: ölçümleme doğrulamasının kapsamda geçmemesi. Bu adım atlandığında satışlar gelir ama Meta göremez; haftalarca yanlış veriyle karar alırsınız.",
    },

    { type: "h2", text: "5. Aylık yönetimde her hafta ne yapılıyor?" },
    {
      type: "p",
      text: "Doğru cevap: somut bir döngü. Ürün bazlı ROAS analizi, bütçe kaydırma, katalog senkron kontrolü, kreatif frekans takibi, yeniden pazarlama katman bakımı ve anomali izleme.",
    },
    {
      type: "p",
      text: "Uyarı işareti: “sürekli takip ediyoruz” gibi ölçülemez ifadeler. Yapılan işin haftalık raporda kalem kalem görünmesi gerekir.",
    },

    { type: "h2", text: "6. Raporda hangi metrikler var?" },
    {
      type: "table",
      head: ["Olması gereken", "Neden"],
      rows: [
        ["Harcama, ciro, ROAS", "Temel performans"],
        ["Sipariş sayısı ve sipariş başına maliyet", "Ciro tek başına yanıltıcı olabilir"],
        ["Ürün bazlı kırılım", "Bütçe kaydırma kararının dayanağı"],
        ["Kampanya türü kırılımı (prospecting / retargeting)", "Hangi katmanın çalıştığını gösterir"],
        ["O hafta yapılan değişiklikler", "Sonuçla eylemi eşleştirmenin tek yolu"],
      ],
    },
    {
      type: "p",
      text: "Son satır en önemlisi ve en sık eksik olanıdır. Ne yapıldığını görmediğiniz bir raporda, iyi sonucun yönetimden mi sezondan mı geldiğini ayırt edemezsiniz.",
    },

    { type: "h2", text: "7. Gerçekçi ROAS beklentisi ne?" },
    {
      type: "p",
      text: "Doğru cevap: bir bant ve bir zaman çizgisi — örneğin “ilk 4–6 hafta öğrenme, sonrasında 4–8 bandı, retargeting'de daha yüksek” — ve bu bandın kategoriye göre değişeceğinin belirtilmesi.",
    },
    {
      type: "p",
      text: "Uyarı işareti: garanti verilmesi. ROAS garantisi teknik olarak mümkün değildir; verilen garanti ya bir tanım oyunudur ya da kısa vadede kolay dönüşen retargeting bütçesine kaçarak toplam büyümeyi feda eder.",
    },

    { type: "h2", text: "8. Taahhüt süresi ve çıkış koşulları neler?" },
    {
      type: "p",
      text: "Doğru cevap: aylık, taahhütsüz. Ayrılırken erişimlerin kaldırılması ve istenirse devir dokümanı hazırlanması.",
    },
    {
      type: "p",
      text: "Uyarı işareti: 6–12 aylık zorunlu taahhüt. Ajansın kendi performansına güveni varsa uzun taahhüde ihtiyacı olmaz. Uzun taahhüt, kötü aylarda müşteriyi tutmanın yoludur.",
    },

    { type: "h2", text: "9. Fiyat modeli nasıl?" },
    {
      type: "p",
      text: "Üç yaygın model var ve her birinin farklı bir teşvik yapısı var. Bunu bilmek, ajansın hangi durumda ne yapacağını önceden anlamanızı sağlar.",
    },
    {
      type: "table",
      head: ["Model", "Teşvik yapısı"],
      rows: [
        ["Sabit aylık ücret", "Ajans verimi artırmaya odaklanır; bütçe artırma baskısı yaratmaz"],
        ["Harcamanın yüzdesi", "Bütçe büyüdükçe ajans kazanır; verim değil harcama teşvik edilir"],
        ["Ciro/ROAS primi", "Kısa vadede kolay dönüşen retargeting'e kayma riski var"],
      ],
    },
    {
      type: "p",
      text: "Hiçbir model tek başına kötü değil, ama teşvik yapısını bilerek seçmek gerekir. Harcama yüzdesi modelinde “bütçeyi artıralım” önerisinin ne kadarının veriye, ne kadarının teşvike dayandığını ayırt etmek zorlaşır.",
    },

    { type: "h2", text: "10. Mağazam hazır değilse ne diyorsunuz?" },
    {
      type: "p",
      text: "Bu, en ayırt edici sorudur. Doğru cevap: hazır olmayan mağazaya “şu an başlamayın” diyebilmek ve bunun nedenini rakamla açıklamak.",
    },
    {
      type: "p",
      text: "Aylık 40 siparişi olan bir mağazaya CPAS satmak kısa vadede ajansın işine gelir ama sonuç kaçınılmaz olarak hayal kırıklığıdır: öğrenme aşaması tamamlanmaz, bütçe verimsiz harcanır ve satıcı “CPAS işe yaramıyor” sonucuna varır. Size hazır olmadığınızı söyleyebilen ajans, hazır olduğunuzda da doğru söyleyecektir.",
    },

    { type: "h2", text: "Ajans mı, kendi ekibiniz mi?" },
    {
      type: "p",
      text: "Ajans seçmeden önce cevaplanması gereken bir soru daha var: bu işi içeride yapmak sizin için daha mı mantıklı? Cevap mağaza büyüklüğüne ve ekibinizin mevcut yüküne bağlı.",
    },
    {
      type: "table",
      head: ["Kriter", "İçeride yapmak", "Ajansla çalışmak"],
      rows: [
        ["Gereken uzman zamanı", "Haftada 4–6 saat, sürekli", "Rapor okuma süresi"],
        ["Öğrenme maliyeti", "İlk aylar hesabınızda öğrenilir", "Devralınmış deneyim"],
        ["Sabit maliyet", "Maaş — hacimden bağımsız", "Aylık ücret — durdurulabilir"],
        ["Kurumsal hafıza", "Sizde kalır", "Ayrılırken devir gerekir"],
        ["Ölçeklenebilirlik", "Yeni pazaryeri = yeni yük", "Yeni pazaryeri = kapsam genişletme"],
      ],
    },
    {
      type: "p",
      text: "Pratik eşik şudur: aylık reklam bütçeniz bir uzmanın maaşını anlamlı biçimde aşıyorsa ve birden fazla pazaryerinde satıyorsanız, içeride bir uzman istihdam etmek uzun vadede mantıklı olabilir. Bunun altındaki hacimlerde uzmanın zamanının çoğu boşa gider — o kişi haftada 5 saatlik iş için tam zamanlı maliyet üretir.",
    },
    {
      type: "p",
      text: "Üçüncü seçenek de var ve çoğu mağaza için en verimlisi: kurulumu ajansa yaptırıp yönetimi bir süre sonra içeriye almak. Kurulum, hata toleransı en düşük ve en teknik aşamadır; haftalık optimizasyon ise doğru kurulmuş bir hesapta öğrenilebilir bir rutindir. Bu yolu seçecekseniz, kurulumu yapan ajansın devir dokümanı hazırlayıp hazırlamadığını baştan sorun.",
    },

    { type: "h2", text: "Görüşmede isteyeceğiniz somut çıktılar" },
    {
      type: "p",
      text: "Sorular cevaplandıktan sonra, teklifin sözlü kalmaması için üç somut çıktı isteyin. Bu üçünü vermekte zorlanan bir ajans, işi yaparken de aynı belirsizliği taşıyacaktır.",
    },
    {
      type: "ol",
      items: [
        "Kalem kalem kurulum kapsamı: hangi adımın kimin sorumluluğunda olduğu ve hangi belgeleri sizden isteyecekleri yazılı olsun. Özellikle ölçümleme doğrulamasının kapsamda geçtiğini görün.",
        "Örnek haftalık rapor: geçmiş bir müşterinin anonimleştirilmiş raporu. Rapor şablonunda 'o hafta yapılan değişiklikler' bölümü yoksa, yapılan işi hiçbir zaman denetleyemeyeceksiniz demektir.",
        "İlk 90 gün planı: hangi hafta ne yapılacağı ve hangi metriğin ne zaman anlamlı hale geleceği. Bu plan aynı zamanda beklenti yönetimidir — dördüncü haftada ROAS sorgulamasına girmenizi engeller.",
      ],
    },
    {
      type: "p",
      text: "Bir de sormadan anlaşılan bir şey var: görüşmede size ne kadar soru sorulduğu. Kategori, kâr marjı, sepet ortalaması, iade oranı ve stok kapasitesini sormadan teklif veren bir ajans, hesabınızı da aynı yüzeysellikle yönetecektir. İyi bir görüşmede konuşma süresinin çoğunu siz doldurursunuz.",
    },

    { type: "h2", text: "Kısa kontrol listesi" },
    {
      type: "ul",
      items: [
        "Bütçe sizin hesabınızdan mı çıkıyor?",
        "Hesaplar ve veri sizin mülkiyetinizde mi kalıyor?",
        "Kurulum kapsamında ölçümleme doğrulaması var mı?",
        "Haftalık yapılan işler raporda kalem kalem görünüyor mu?",
        "Taahhüt yok ve çıkış temiz mi?",
        "Fiyat modelinin teşvik yapısını anladınız mı?",
        "Hazır olmadığınız durumda hayır diyebiliyorlar mı?",
      ],
    },
    {
      type: "p",
      text: "CPAS Türkiye'nin çalışma modeli bu listeye göre kurulmuştur: bütçe sizin hesabınızdan çıkar, tüm altyapı sizin mülkiyetinizde kalır, taahhüt yoktur ve haftalık raporda o hafta yapılan her değişiklik yazılıdır. Hazır olmadığınızı düşünüyorsak bunu görüşmede söylüyoruz.",
    },
  ],
  faq: [
    {
      question: "CPAS ajansı ile normal dijital ajans arasındaki fark ne?",
      answer:
        "CPAS'in katalog segmentasyonu, pazaryeri olay eşleştirmesi ve yetkilendirme zinciri klasik Meta reklamcılığında karşılaşılmayan konulardır. Genel Meta deneyimi olan bir ekip bunları hesabınızda öğrenir ve bu öğrenmenin maliyetini bütçeniz karşılar.",
    },
    {
      question: "Reklam hesabı ajansın mı benim adıma mı açılmalı?",
      answer:
        "Kesinlikle sizin adınıza. Meta Business Manager, reklam hesabı, katalog bağlantısı ve kampanya yapıları sizde kalmalı; ajans yalnızca erişim yetkisi almalıdır. Aksi halde ayrıldığınızda geçmiş veri ve öğrenilmiş optimizasyon sizinle gelmez.",
    },
    {
      question: "ROAS garantisi veren ajanslara güvenmeli miyim?",
      answer:
        "ROAS garantisi teknik olarak mümkün değildir. Verilen garanti genellikle ya tanım oyunudur ya da bütçeyi kısa vadede kolay dönüşen yeniden pazarlama kampanyalarına kaydırarak toplam büyümeyi feda eder.",
    },
    {
      question: "Uzun süreli taahhüt istemeleri normal mi?",
      answer:
        "Yaygın ama gerekli değil. CPAS'te ilk anlamlı sonuç 4–6 haftada çıkar; bunun ötesinde 6–12 aylık zorunlu taahhüt, performanstan çok müşteriyi tutmaya hizmet eder. Aylık ve taahhütsüz model tercih edilmelidir.",
    },
  ],
};

export default post;
