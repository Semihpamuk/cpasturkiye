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

export function initializeCheckoutForm(request: IyzicoCheckoutRequest): Promise<IyzicoCheckoutResult> {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.checkoutFormInitialize.create(request, (err: Error | null, result: IyzicoCheckoutResult) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function retrieveCheckoutForm(token: string): Promise<IyzicoRetrieveResult> {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.checkoutFormAuth.retrieve(
      { locale: "tr", token },
      (err: Error | null, result: IyzicoRetrieveResult) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}
