import type { BlogPostSource } from "@/lib/blog-types";

const post: BlogPostSource = {
  slug: "meta-business-manager-kurulumu-pazaryeri-saticilari",
  title: "Meta Business Manager Kurulumu: Pazaryeri Satıcıları İçin Rehber",
  excerpt:
    "CPAS'e geçmeden önce Meta Business Manager hesabınızın doğru kurulmuş olması gerekir. İşletme doğrulaması, reklam hesabı, sayfa bağlantısı ve yetki yönetimi adım adım.",
  date: "2026-08-06",
  category: "Rehber",
  keywords: [
    "Meta Business Manager kurulumu",
    "işletme doğrulama Meta",
    "Facebook Business Manager",
    "Meta reklam hesabı açma",
    "CPAS Business Manager",
  ],
  content: [
    {
      type: "p",
      text: "CPAS başvurunuz Trendyol ya da Hepsiburada tarafında beklerken, gecikmenin nedeni çoğu zaman pazaryeri değil sizsinizdir: Meta Business Manager hesabı doğrulanmamıştır, reklam hesabına ödeme yöntemi tanımlanmamıştır ya da yetkiler yanlış kişide durmaktadır.",
    },
    {
      type: "p",
      text: "Bu rehber, pazaryeri satıcısı gözünden doğru bir Business Manager kurulumunu anlatıyor. Amaç yalnızca hesabı açmak değil, CPAS yetkilendirmesinin takılmayacağı şekilde kurmak.",
    },

    { type: "h2", text: "Business Manager nedir, neden gerekli?" },
    {
      type: "p",
      text: "Meta Business Manager (yeni adıyla Meta Business Suite'in yönetim katmanı), işletmenizin Meta varlıklarını tek çatı altında toplayan yönetim panelidir: reklam hesapları, sayfalar, kataloglar, pikseller ve kullanıcı yetkileri burada durur.",
    },
    {
      type: "p",
      text: "CPAS için zorunludur çünkü pazaryeri, katalog segmentinizi kişisel bir profille değil bir işletme kimliğiyle paylaşır. Başvuru sırasında istenen BM ID, bu hesabın kimlik numarasıdır.",
    },

    { type: "h2", text: "Kurulum adımları" },
    {
      type: "ol",
      items: [
        "business.facebook.com adresinden işletme hesabı oluşturun. İşletme adını ticari unvanınızla birebir aynı yazın — doğrulama aşamasında belgelerle eşleşmesi gerekir.",
        "İşletme bilgilerini eksiksiz doldurun: adres, telefon, web sitesi. Web sitesi alanı boş bırakılan hesaplarda doğrulama daha sık takılır.",
        "Facebook sayfanızı işletmeye bağlayın. Sayfa yoksa oluşturun; CPAS reklamları bir sayfa kimliğiyle yayınlanır.",
        "Instagram hesabınızı bağlayın. Reklamlarınızın Instagram'da doğru kimlikle görünmesi için gereklidir.",
        "Reklam hesabı oluşturun. Para birimini TRY, saat dilimini Europe/Istanbul seçin — bu ayarlar sonradan değiştirilemez.",
        "Ödeme yöntemi tanımlayın ve hesabın aktif olduğunu doğrulayın.",
        "İşletme doğrulamasını (business verification) başlatın.",
        "Kullanıcı yetkilerini tanımlayın.",
      ],
    },
    {
      type: "callout",
      title: "Geri alınamaz ayarlar",
      text: "Reklam hesabının para birimi ve saat dilimi sonradan değiştirilemez. Yanlış seçilirse tek çözüm yeni hesap açmaktır ve geçmiş veri taşınmaz. Bu iki alanı kurulumda iki kez kontrol edin.",
    },

    { type: "h2", text: "Kişisel profil, sayfa, işletme hesabı: hangisi ne?" },
    {
      type: "p",
      text: "Meta'nın kimlik katmanları birbirine benzer isimler taşıdığı için sık karıştırılıyor. Kurulumu doğru yapabilmek için üçünün ne işe yaradığını ayırmak gerekiyor.",
    },
    {
      type: "table",
      head: ["Katman", "Ne işe yarar", "CPAS için"],
      rows: [
        ["Kişisel profil", "Sizin Facebook hesabınız", "Yalnızca yönetici olarak bağlanır"],
        ["Facebook sayfası", "Markanızın kamuya açık kimliği", "Reklamlar bu kimlikle yayınlanır"],
        ["İşletme hesabı (BM)", "Varlıkları ve yetkileri toplayan çatı", "Katalog buraya paylaşılır"],
        ["Reklam hesabı", "Bütçe ve kampanyaların tutulduğu yer", "Harcama buradan yapılır"],
      ],
    },
    {
      type: "p",
      text: "Kritik ayrım şudur: kişisel profiliniz bir giriş anahtarıdır, mülkiyet taşıyıcısı değil. Tüm varlıklar işletme hesabına ait olmalıdır. Sayfayı veya reklam hesabını kişisel profil altında bırakmak, ekipte bir değişiklik olduğunda erişim kaybına yol açan en yaygın yapısal hatadır.",
    },

    { type: "h2", text: "İşletme doğrulaması: en çok takılan adım" },
    {
      type: "p",
      text: "Meta, işletmenizin gerçek olduğunu belgeyle görmek ister. CPAS için bu adım zorunludur ve doğrulanmamış hesaplarda katalog paylaşımı tamamlanmaz.",
    },
    { type: "h3", text: "Gerekli belgeler" },
    {
      type: "ul",
      items: [
        "Vergi levhası veya faaliyet belgesi",
        "Ticaret sicil gazetesi (şirket türüne göre)",
        "İşletme adına düzenlenmiş bir fatura (adres doğrulaması için)",
      ],
    },
    { type: "h3", text: "Reddedilme nedenleri" },
    {
      type: "table",
      head: ["Neden", "Çözüm"],
      rows: [
        ["İşletme adı belgeyle birebir aynı değil", "Ticari unvanı harfi harfine kopyalayın (A.Ş., Ltd. Şti. dahil)"],
        ["Adres belgeyle uyuşmuyor", "Belgedeki adresi eksiksiz yazın, kısaltma kullanmayın"],
        ["Belge okunaksız / kısmi taranmış", "Tam sayfa, yüksek çözünürlüklü PDF yükleyin"],
        ["Web sitesi alanı boş veya erişilemez", "Çalışan bir kurumsal site veya pazaryeri mağaza linki verin"],
        ["Telefon doğrulaması tamamlanmamış", "İşletme telefonuna gelen kodu girin"],
      ],
    },
    {
      type: "p",
      text: "Doğrulama tipik olarak 1–3 iş günü sürer. Reddedilirse düzeltip yeniden başvurabilirsiniz ama her tur zaman kaybıdır — bu yüzden ilk seferde belgeleri eksiksiz göndermek önemlidir.",
    },

    { type: "h2", text: "Reklam hesabı kurulumunda dikkat edilecekler" },
    {
      type: "p",
      text: "Business Manager doğrulandıktan sonraki adım reklam hesabıdır ve buradaki birkaç seçim, sonradan düzeltilmesi zor ya da imkânsız sonuçlar doğurur.",
    },
    {
      type: "ul",
      items: [
        "Para birimi ve saat dilimi: TRY ve Europe/Istanbul. Değiştirilemez; yanlış seçim yeni hesap açmayı gerektirir ve geçmiş veri taşınmaz.",
        "Hesap adı: mağaza adınızla eşleşsin. Birden fazla pazaryerinde satıyorsanız pazaryeri adını da ekleyin — iki hesabı ayırt etmek raporlamada zaman kazandırır.",
        "Fatura bilgileri: şirket unvanı, vergi dairesi ve vergi numarası eksiksiz girilsin. Eksik bilgi, KDV iadesi ve muhasebe eşleştirmesinde sorun çıkarır.",
        "Harcama limiti: hesap düzeyinde bir üst limit tanımlayın. Kampanya bütçesindeki bir yanlış girişin faturaya yansımasını engelleyen tek güvenlik ağıdır.",
        "Bildirimler: ödeme başarısızlığı ve reklam reddi bildirimlerini takip edilen bir e-posta adresine yönlendirin.",
      ],
    },
    {
      type: "p",
      text: "Dördüncü madde küçük görünür ama pahalı bir hatayı önler: günlük bütçeyi 500 ₺ yerine 5.000 ₺ girmek, fark edilene kadar birkaç gün sürebilir. Hesap düzeyinde harcama limiti, bu tür girdi hatalarının maliyetini bir günle sınırlar.",
    },

    { type: "h2", text: "Yetki yönetimi: sonradan pahalıya patlayan konu" },
    {
      type: "p",
      text: "Business Manager'da iki tür yetki vardır: işletme düzeyinde (yönetici / çalışan) ve varlık düzeyinde (belirli bir reklam hesabına veya kataloğa erişim). Karıştırılması yaygındır ve sonuçları ciddi olur.",
    },
    {
      type: "ul",
      items: [
        "İşletme sahipliği her zaman şirketin kendisinde olmalı — bir çalışanın veya ajansın kişisel hesabında değil.",
        "En az iki yönetici tanımlayın. Tek yöneticili hesaplarda o kişi ayrıldığında erişim kaybı yaşanır ve Meta'dan geri alma süreci uzundur.",
        "Ajanslara işletme yöneticiliği değil, ilgili varlıklara sınırlı erişim verin.",
        "Ayrılan çalışanların erişimini aynı gün kaldırın.",
        "İki faktörlü doğrulamayı tüm yöneticiler için zorunlu hale getirin.",
      ],
    },
    {
      type: "callout",
      title: "Ajansla çalışacaksanız",
      text: "Doğru kurgu: Business Manager sizin, ajans partner olarak eklenir ve gerekli varlıklara erişim alır. Ajansın kendi BM'inden yönetmesi, ilişki bittiğinde geçmiş veriyi ve öğrenilmiş optimizasyonu kaybetmenize yol açar.",
    },

    { type: "h2", text: "Piksel gerekli mi? Pazaryeri satıcısının kafasını karıştıran konu" },
    {
      type: "p",
      text: "Meta'nın tüm eğitim içeriği pikselden bahseder, bu yüzden pazaryeri satıcıları da bir piksel kurmaya çalışır ve kuracak yer bulamayınca takılır. Netleştirelim: CPAS'te dönüşüm ölçümü piksel üzerinden yapılmaz.",
    },
    {
      type: "p",
      text: "Trendyol veya Hepsiburada'nın sitesine kendi pikselinizi yerleştiremezsiniz; buna gerek de yoktur. Dönüşüm verisi, pazaryerinin Meta ile kurduğu entegrasyon üzerinden akar. Yani CPAS için piksel kurmanız gerekmez ve kuramamanız bir eksiklik değildir.",
    },
    {
      type: "p",
      text: "İstisna: kendi kurumsal siteniz de varsa ve oradan da satış yapıyorsanız, o site için ayrı bir piksel kurmanız mantıklıdır. Ancak bu, CPAS ölçümünden tamamen bağımsız bir hattır; ikisini aynı kampanyada karıştırmayın, dönüşüm sayıları çift sayılır ve raporunuz güvenilmez hale gelir.",
    },

    { type: "h2", text: "Kurulumda en sık yapılan 5 hata" },
    {
      type: "ol",
      items: [
        "Kişisel profille işletme kurmak: Business Manager'ı bir çalışanın kişisel Facebook hesabına bağlı tek yöneticiyle kurmak. O kişi ayrıldığında erişim kilitlenir ve Meta'dan geri alma süreci haftalar sürer.",
        "Aynı işletme için birden fazla BM açmak: Meta işletme başına sınırlı sayıda doğrulanmış hesap tanır. İkinci bir BM açmak yerine mevcut olanı düzeltmek her zaman daha hızlıdır.",
        "Reklam hesabını yanlış para biriminde açmak: TRY yerine USD seçildiğinde kur farkı raporlamayı bozar ve bu ayar sonradan değiştirilemez.",
        "Sayfa bağlantısını atlamak: CPAS reklamları bir sayfa kimliğiyle yayınlanır. Sayfa bağlı değilse kampanya kurulum aşamasında durur.",
        "Ödeme yöntemini son ana bırakmak: Katalog paylaşımı, aktif olmayan reklam hesaplarında tamamlanmaz. Ödeme yöntemi tanımsızsa süreç sessizce bekler.",
      ],
    },
    {
      type: "p",
      text: "Bu beş maddenin ortak özelliği, hiçbirinin ekranda açık bir hata mesajı üretmemesidir. Süreç ilerlemiyor gibi görünür ve nedeni panelde yazmaz — bu yüzden kurulumu baştan doğru yapmak, sonradan teşhis etmekten belirgin biçimde ucuzdur.",
    },

    { type: "h2", text: "CPAS öncesi son kontrol listesi" },
    {
      type: "table",
      head: ["Kontrol", "Tamam mı?"],
      rows: [
        ["İşletme doğrulaması onaylı", "Zorunlu"],
        ["Reklam hesabı aktif ve ödeme yöntemi tanımlı", "Zorunlu"],
        ["Para birimi TRY, saat dilimi Europe/Istanbul", "Zorunlu (değiştirilemez)"],
        ["Facebook sayfası bağlı", "Zorunlu"],
        ["Instagram hesabı bağlı", "Önerilir"],
        ["En az iki yönetici tanımlı", "Önerilir"],
        ["İki faktörlü doğrulama açık", "Önerilir"],
        ["BM ID not edilmiş", "Başvuruda gerekli"],
      ],
    },
    {
      type: "p",
      text: "Bu listedeki ilk üç madde tamamlanmadan pazaryerine CPAS başvurusu yapmak, süreci kaçınılmaz olarak uzatır. Başvuru ekranında her şey yolunda görünür; takılma, katalog paylaşımı aşamasında ortaya çıkar ve nedeni panelde net yazmaz.",
    },
    {
      type: "p",
      text: "CPAS Türkiye'nin kurulum paketinde Meta Business Manager kurulumu ve işletme doğrulaması dahildir: hesabınız yoksa sıfırdan kurar, varsa CPAS'e uygun hale getirir ve doğrulama sürecini sizin adınıza takip ederiz.",
    },
  ],
  faq: [
    {
      question: "Meta işletme doğrulaması ne kadar sürer?",
      answer:
        "Belgeler eksiksizse tipik olarak 1–3 iş günü. Reddedilme durumunda düzeltip yeniden başvurabilirsiniz, ancak her tur ek süre demektir; en sık red nedeni işletme adının belgeyle birebir aynı yazılmamasıdır.",
    },
    {
      question: "Business Manager olmadan CPAS kullanabilir miyim?",
      answer:
        "Hayır. Pazaryeri katalog segmentini bir işletme kimliğiyle paylaşır ve başvuruda BM ID istenir. Kişisel Facebook profiliyle CPAS kurulumu mümkün değildir.",
    },
    {
      question: "Reklam hesabının para birimini sonradan değiştirebilir miyim?",
      answer:
        "Hayır. Para birimi ve saat dilimi hesap oluşturulduktan sonra değiştirilemez. Yanlış seçilirse yeni hesap açmanız gerekir ve geçmiş performans verisi taşınmaz.",
    },
    {
      question: "Ajansa hangi yetkiyi vermeliyim?",
      answer:
        "İşletme yöneticiliği değil, partner olarak ilgili varlıklara sınırlı erişim. Business Manager sahipliği her zaman şirketinizde kalmalıdır; aksi halde ilişki bittiğinde geçmiş veri ve öğrenilmiş optimizasyon sizinle gelmez.",
    },
  ],
};

export default post;
