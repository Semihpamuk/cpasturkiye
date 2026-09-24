/**
 * Ödeme callback'inin SAF karar mantığı.
 *
 * Rotanın kendisi (app/api/payment/callback/route.ts) disk, e-posta, GA,
 * Meta ve iyzico'ya dokunuyor; o haliyle test edilemiyordu. Paraya dokunan
 * kararlar — taksit eşlemesi, tutarın nereden geleceği, hangi ekrana
 * yönlendirileceği — buraya alındı. Yan etki yok, ağ yok, disk yok.
 */

import type { Order, PendingOrder } from "@/lib/db";
import type { IyzicoRetrieveResult } from "@/lib/iyzico";

export type InstallmentKey = Order["installment"];

/**
 * iyzico'ya açtığımız taksit seçenekleri.
 *
 * `api/payment/initialize` `enabledInstallments: [1, 2, 3, 6, 9]` gönderiyor;
 * burası onunla AYNI kalmalı. 24 Eyl 2026'ya kadar bu liste "3, 6, 9" idi ve
 * 2 taksitle ödeyen müşterinin siparişi panelde "Tek çekim" görünüyordu.
 */
const MULTI_INSTALLMENTS = ["2", "3", "6", "9"] as const;

/**
 * iyzico'nun döndürdüğü taksit sayısını sipariş kaydının alanına eşler.
 *
 * Tanımadığımız bir değer gelirse "single"a düşer: kayıt yanlış bir taksit
 * sayısı göstermektense tek çekim göstersin, çünkü tahsil edilen tutar her
 * durumda doğru.
 */
export function resolveInstallmentKey(raw: unknown): InstallmentKey {
  const count = Number(raw ?? 1);
  if (!Number.isFinite(count) || count <= 1) return "single";

  const asString = String(count);
  return (MULTI_INSTALLMENTS as readonly string[]).includes(asString)
    ? (asString as InstallmentKey)
    : "single";
}

/**
 * Siparişin bağlanacağı conversationId.
 *
 * iyzico'nun döndürdüğü değer esastır; o yoksa callback formundaki, o da
 * yoksa token kullanılır — pending kaydı bu anahtarla aranıp silineceği için
 * boş kalamaz.
 */
export function resolveConversationId(
  resultConversationId: string | undefined,
  callbackConversationId: string | undefined,
  token: string
): string {
  return resultConversationId ?? callbackConversationId ?? token;
}

function asText(value: unknown): string {
  return value === undefined || value === null ? "" : String(value);
}

export interface BuildPaidOrderInput {
  result: IyzicoRetrieveResult;
  /** Diskteki pending kayıt; bulunamazsa sipariş iyzico verisinden kurulur. */
  pending: PendingOrder | null;
  conversationId: string;
  id: string;
  createdAt: string;
}

/**
 * Ödemesi alınmış siparişin kaydını kurar.
 *
 * Tutar ve fatura bilgileri ÖNCE pending kayıttan okunur: müşterinin checkout
 * ekranında gördüğü tutar odur. Pending bulunamazsa (disk hatası, süresi
 * dolmuş kayıt) sipariş kaybedilmez; iyzico'nun döndürdüğü tahsilat verisiyle
 * kurulur — eksik kayıt, kayıp sipariş kaydından iyidir.
 *
 * `??` bilinçli: `0` geçerli bir tutardır ve korunmalıdır (`||` olsaydı
 * indirimle sıfırlanmış bir kalem iyzico değerine kayardı).
 */
export function buildPaidOrder({
  result,
  pending,
  conversationId,
  id,
  createdAt,
}: BuildPaidOrderInput): Order {
  return {
    id,
    createdAt,
    name: pending?.name ?? asText(result.buyer?.name),
    phone: pending?.phone ?? asText(result.buyer?.gsmNumber),
    email: pending?.email ?? asText(result.buyer?.email),
    storeUrl: pending?.storeUrl ?? "",
    marketplaces: pending?.marketplaces ?? [],
    paymentMethod: "card",
    installment: resolveInstallmentKey(result.installment),
    addManagement: pending?.addManagement ?? false,
    discountCode: pending?.discountCode ?? null,
    setupNet: pending?.setupNet ?? 0,
    managementMonthly: pending?.managementMonthly ?? 0,
    managementAddon: pending?.managementAddon ?? 0,
    discountAmount: pending?.discountAmount ?? 0,
    vatAmount: pending?.vatAmount ?? 0,
    total: pending?.total ?? Number(result.paidPrice ?? result.price ?? 0),
    status: "paid",
    invoiceType: pending?.invoiceType ?? "individual",
    identityNo: pending?.identityNo ?? asText(result.buyer?.identityNumber),
    companyName: pending?.companyName ?? "",
    taxOffice: pending?.taxOffice ?? "",
    taxNumber: pending?.taxNumber ?? "",
    address: pending?.address ?? asText(result.billingAddress?.address),
    city: pending?.city ?? asText(result.billingAddress?.city),
    paymentId: asText(result.paymentId),
    conversationId,
    termsAcceptedAt: pending?.termsAcceptedAt,
    gaClientId: pending?.gaClientId,
    gaSessionId: pending?.gaSessionId,
    fbp: pending?.fbp,
    fbc: pending?.fbc,
    clientIp: pending?.clientIp,
    userAgent: pending?.userAgent,
  };
}

export type CallbackOutcome =
  | { kind: "error"; reason: "no_token" }
  | { kind: "failure"; reason?: string }
  | { kind: "paid" };

/**
 * iyzico'dan dönen callback'in sonucunu belirler.
 *
 * "paid" dönmesi PARANIN TAHSİL EDİLDİĞİ anlamına gelir; bundan sonraki
 * hiçbir hata müşteriye "ödeme başarısız" gösterilmesine yol açmamalıdır.
 */
export function decideCallbackOutcome(
  token: string | null,
  status: string | null,
  result: Pick<IyzicoRetrieveResult, "status" | "paymentStatus" | "errorCode"> | null
): CallbackOutcome {
  if (!token) return { kind: "error", reason: "no_token" };
  if (status === "failure") return { kind: "failure" };
  if (!result) return { kind: "failure", reason: "unknown" };

  if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
    return { kind: "failure", reason: result.errorCode ?? "unknown" };
  }

  return { kind: "paid" };
}
