// iyzico JS Checkout Form entegrasyonu
// Dökümantasyon: https://docs.iyzipay.com/tr/checkout-form

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

function getClient() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    throw new Error("IYZICO_API_KEY ve IYZICO_SECRET_KEY ortam değişkenleri tanımlanmalıdır.");
  }

  // Doldurulmamış placeholder anahtarları erkenden yakala.
  if (apiKey.includes("xxxx") || secretKey.includes("xxxx")) {
    throw new Error(
      "IYZICO anahtarları placeholder (xxxx) — .env / Vercel ortam değişkenlerine gerçek anahtarları girin."
    );
  }

  // Sandbox anahtarı yalnızca sandbox URL ile, production anahtarı yalnızca
  // production URL ile çalışır. Uyumsuzluk iyzico'da sessiz auth hatası (→502)
  // olarak döner; burada net hata verelim.
  const isSandboxKey = apiKey.startsWith("sandbox-");
  const isProdUrl = baseUrl.includes("//api.iyzipay.com");
  if (isSandboxKey && isProdUrl) {
    throw new Error(
      "iyzico yapılandırma hatası: SANDBOX anahtarı PRODUCTION URL'e (api.iyzipay.com) gönderiliyor. " +
        "IYZICO_BASE_URL=https://sandbox-api.iyzipay.com yapın ya da production anahtarları kullanın."
    );
  }
  if (!isSandboxKey && baseUrl.includes("sandbox-api.iyzipay.com")) {
    throw new Error(
      "iyzico yapılandırma hatası: PRODUCTION anahtarı SANDBOX URL'e gönderiliyor. " +
        "IYZICO_BASE_URL=https://api.iyzipay.com yapın ya da sandbox anahtarları kullanın."
    );
  }

  return new Iyzipay({ apiKey, secretKey, uri: baseUrl });
}

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  itemType: "VIRTUAL" | "PHYSICAL";
  price: string; // KDV dahil, kuruş değil → "1500.00"
}

export interface IyzicoCheckoutRequest {
  locale: "tr" | "en";
  conversationId: string;
  price: string;          // toplam tutar (KDV dahil), string
  paidPrice: string;      // taksit dahil ödenen tutar (şimdi aynı)
  currency: "TRY";
  basketId: string;
  paymentGroup: "PRODUCT" | "SUBSCRIPTION";
  callbackUrl: string;
  enabledInstallments: number[];
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: IyzicoBasketItem[];
}

export interface IyzicoCheckoutResult {
  status: "success" | "failure";
  checkoutFormContent?: string;
  token?: string;
  tokenExpireTime?: number;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

export interface IyzicoRetrieveResult {
  status: "success" | "failure";
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
  price?: string;
  paidPrice?: string;
  installment?: number;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  buyer?: {
    name?: string;
    surname?: string;
    gsmNumber?: string;
    email?: string;
    identityNumber?: string;
  };
  billingAddress?: {
    address?: string;
    city?: string;
    country?: string;
    contactName?: string;
  };
  [key: string]: unknown;
}

/**
 * iyzico'ya giden çağrılar için üst sınır. SDK'nın (postman-request) kendi
 * zaman aşımı yok: api.iyzipay.com yanıt vermezse istek sonsuza kadar asılı
 * kalır, müşteri "Ödeme başlatılıyor..." ekranında kilitlenirdi (2026-09-20'de
 * sunucu IP'si iyzico canlı API'sine ulaşamayınca yaşandı). Zaman aşımında
 * kullanıcıya havale/EFT önerilir.
 */
export const IYZICO_TIMEOUT_MS = 15_000;

export class IyzicoTimeoutError extends Error {
  constructor(operation: string, ms: number) {
    super(`iyzico ${operation} ${ms} ms içinde yanıt vermedi`);
    this.name = "IyzicoTimeoutError";
  }
}

/** SDK'nın callback tabanlı çağrısını zaman sınırlı Promise'e çevirir. */
export function withIyzicoTimeout<T>(
  operation: string,
  run: (done: (err: Error | null, result: T) => void) => void,
  ms: number = IYZICO_TIMEOUT_MS
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new IyzicoTimeoutError(operation, ms));
    }, ms);
    const done = (err: Error | null, result: T) => {
      if (settled) return; // zaman aşımından sonra gelen geç yanıt yok sayılır
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve(result);
    };
    try {
      run(done);
    } catch (err) {
      done(err instanceof Error ? err : new Error(String(err)), undefined as T);
    }
  });
}

export function initializeCheckoutForm(request: IyzicoCheckoutRequest): Promise<IyzicoCheckoutResult> {
  const client = getClient();
  return withIyzicoTimeout<IyzicoCheckoutResult>("checkoutFormInitialize", (done) =>
    client.checkoutFormInitialize.create(request, done)
  );
}

/**
 * Ödeme sonucunu sunucu tarafında doğrular.
 *
 * DİKKAT: iyzipay paketindeki kaynak adı `checkoutForm` (resources/CheckoutForm.js
 * → /payment/iyzipos/checkoutform/auth/ecom/detail). `checkoutFormAuth` diye bir
 * kaynak YOKTUR; o isim kullanılırsa çağrı TypeError ile patlar ve iyzico'da
 * ödeme başarılı olmasına rağmen callback hata sayfasına düşer.
 */
export function retrieveCheckoutForm(
  token: string,
  conversationId?: string
): Promise<IyzicoRetrieveResult> {
  const client = getClient();
  if (!client.checkoutForm || typeof client.checkoutForm.retrieve !== "function") {
    return Promise.reject(
      new Error("iyzipay paketinde checkoutForm.retrieve bulunamadı (paket sürümü uyumsuz).")
    );
  }
  return withIyzicoTimeout<IyzicoRetrieveResult>("checkoutForm.retrieve", (done) =>
    client.checkoutForm.retrieve({ locale: "tr", conversationId, token }, done)
  );
}
