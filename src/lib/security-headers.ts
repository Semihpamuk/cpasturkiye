// HTTP güvenlik başlıkları — next.config.ts `headers()` bunları her yanıta ekler.
//
// CSP şimdilik RAPOR modunda (Content-Security-Policy-Report-Only): tarayıcı
// hiçbir şeyi engellemez, ihlalleri /api/csp-report'a bildirir, sunucu loglar.
// Ödeme akışı (iyzico iframe + 3D Secure) dahil birkaç gün temiz log görülünce
// `CSP_ENFORCE` true yapılır. Yanlış bir satır ödeme formunu sessizce
// kırabileceği için körlemesine zorunlu kılınmadı.
export const CSP_ENFORCE = false;

// Üçüncü taraf kökenler — her biri kodda gerçekten kullanılıyor:
//   googletagmanager: GA4 gtag.js + GTM kapsayıcısı (components/Analytics.tsx)
//   google-analytics / analytics.google / doubleclick / google.com(.tr):
//     GA4 ölçüm + Google Ads rıza sinyalleri ve dönüşüm çerezleri
//   facebook: Meta Pixel (connect.facebook.net/fbevents.js, www.facebook.com/tr)
//   iyzipay: ödeme formu scripti, iframe ve 3D Secure yönlendirmesi
const GOOGLE_SCRIPTS = [
  "https://www.googletagmanager.com",
  "https://*.googletagmanager.com",
  // Google Ads dönüşüm etiketi GTM üzerinden eklenirse buradan gelir
  "https://www.googleadservices.com",
];
const GOOGLE_CONNECT = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://*.g.doubleclick.net",
  "https://*.google.com",
  "https://*.google.com.tr",
  "https://www.googleadservices.com",
];
const META_SCRIPTS = ["https://connect.facebook.net"];
const META_CONNECT = ["https://www.facebook.com", "https://connect.facebook.net"];
const IYZICO = ["https://*.iyzipay.com"];

/**
 * CSP dizesi. `isDev` iken Next'in HMR'ı için 'unsafe-eval' ve ws: eklenir.
 *
 * 'unsafe-inline' (script): Next.js hidrasyon verisini ve rıza/GA/GTM/Pixel
 * başlatıcılarını inline <script> ile basar; nonce'a geçmek tüm sayfaları
 * dinamik render'a zorlar (45 statik sayfa kaybı). Bu yüzden kaynak KÖKEN
 * kısıtı ile yetiniyoruz — enjekte edilen bir script yabancı bir alandan
 * kod çekemez, veri sızdıramaz.
 */
export function buildCsp(isDev: boolean): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      ...GOOGLE_SCRIPTS,
      ...META_SCRIPTS,
      ...IYZICO,
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    // Ölçüm pikselleri (GA/Meta) çok sayıda Google alanına <img> beacon atar;
    // admin panelden yapıştırılan referans logoları da herhangi bir https kökeninden.
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      ...(isDev ? ["ws:", "wss:"] : []),
      ...GOOGLE_CONNECT,
      ...META_CONNECT,
      ...IYZICO,
    ],
    "frame-src": [...IYZICO, "https://www.googletagmanager.com", "https://td.doubleclick.net", "https://www.facebook.com"],
    "frame-ancestors": ["'self'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", ...IYZICO],
    "object-src": ["'none'"],
    "report-uri": ["/api/csp-report"],
  };
  if (!isDev) directives["upgrade-insecure-requests"] = [];

  return Object.entries(directives)
    .map(([name, values]) => (values.length ? `${name} ${values.join(" ")}` : name))
    .join("; ");
}

export interface HeaderEntry {
  key: string;
  value: string;
}

export function securityHeaders(isDev: boolean): HeaderEntry[] {
  return [
    // 1 yıl HTTPS zorunluluğu; www alt alanı dahil. `preload` bilerek yok — geri alınamaz.
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Site başka bir sayfanın iframe'ine alınamaz (clickjacking). GTM Tag Assistant
    // sayfayı iframe'lemez, yeni pencerede açar — etkilenmez.
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    // Dış bağlantılara yalnızca köken gönderilir; GA yönlendirme kaynağını yine görür.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // `payment` bilerek kısıtlanmadı: iyzico iframe'i Payment Request API kullanabilir.
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
    {
      key: CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: buildCsp(isDev),
    },
  ];
}
