/**
 * Checkout'un sunucuyla konuştuğu üç uç.
 *
 * CheckoutClient 1352 satırdı ve bu çağrılar state güncellemeleriyle iç içe
 * geçtiği için test edilemiyordu. Burada yalnızca istek kurulur ve yanıt
 * ayrıştırılır; hangi state'in değişeceğine bileşen karar verir.
 *
 * Ortak kural: ağ hatası da, sunucunun döndürdüğü hata da aynı biçimde
 * `{ ok: false }` olarak döner — çağıran tarafın try/catch kurması gerekmez.
 * Ödeme akışında yutulan bir istisna müşteriyi sessizce bekleten en kötü
 * senaryoydu.
 */

/** Ağ koptuğunda kullanıcıya gösterilen ortak mesaj. */
export const CONNECTION_ERROR = "Bağlantı hatası — lütfen tekrar deneyin.";

export interface AppliedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

export type DiscountResult = { ok: true; discount: AppliedDiscount } | { ok: false };

/**
 * İndirim kodunu doğrular.
 *
 * Geçersiz kod ile ağ hatası bilerek ayrılmıyor: ikisinde de kullanıcıya
 * "kod geçersiz" gösteriliyor, çünkü kodu uygulayamadığımız her durumda
 * fiyat indirimsiz kalır ve tutarsız bir sepet oluşmaz.
 */
export async function validateDiscountCode(code: string): Promise<DiscountResult> {
  try {
    const res = await fetch("/api/discount/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();

    if (!data?.valid) return { ok: false };

    return {
      ok: true,
      discount: { code: String(data.code), type: data.type, value: Number(data.value) },
    };
  } catch {
    return { ok: false };
  }
}

export type InitializeResult =
  | { ok: true; checkoutFormContent: string }
  | { ok: false; error: string };

/** Kart ödemesini başlatır; başarılıysa iyzico'nun form HTML'ini döndürür. */
export async function initializeCardPayment(payload: unknown): Promise<InitializeResult> {
  try {
    const res = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data?.error || "Ödeme başlatılamadı, lütfen tekrar deneyin." };
    }

    return { ok: true, checkoutFormContent: String(data.checkoutFormContent ?? "") };
  } catch {
    return { ok: false, error: CONNECTION_ERROR };
  }
}

export type TransferResult = { ok: true; orderId: string } | { ok: false; error: string };

/** Havale siparişini oluşturur; dekont varsa aynı istekte yüklenir. */
export async function submitTransferOrder(
  payload: unknown,
  receipt: File | null
): Promise<TransferResult> {
  try {
    const body = new FormData();
    if (receipt) body.append("receipt", receipt);
    body.append("payload", JSON.stringify(payload));

    const res = await fetch("/api/payment/transfer", { method: "POST", body });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data?.error || "Sipariş oluşturulamadı, lütfen tekrar deneyin." };
    }

    return { ok: true, orderId: String(data.orderId ?? "") };
  } catch {
    return { ok: false, error: CONNECTION_ERROR };
  }
}

/** Havale formunun sunucuya gitmeden önceki kontrolleri. */
export function validateTransferInput(
  receipt: File | null,
  receiptAccountName: string,
  maxReceiptMb: number
): string | null {
  if (!receipt && !receiptAccountName.trim()) {
    return "Dekont yükleyin veya ödeme yapılan hesabın resmi ismini yazın.";
  }
  if (receipt && receipt.size > maxReceiptMb * 1024 * 1024) {
    return `Dekont dosyası ${maxReceiptMb} MB'den küçük olmalıdır.`;
  }
  return null;
}
