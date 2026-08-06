import { NextResponse, after } from "next/server";
import { retrieveCheckoutForm, type IyzicoRetrieveResult } from "@/lib/iyzico";
import {
  addOrder,
  generateId,
  getPendingOrder,
  deletePendingOrder,
  incrementCodeUsage,
  getCodes,
} from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/mailer";
import { createJaleOnboardingInvite } from "@/lib/jaleOnboarding";
import { gaIdentityFrom, sendGaPurchase } from "@/lib/ga-server";
import { SITE } from "@/lib/site";

/**
 * Ödeme iyzico tarafında ALINDIKTAN sonraki kayıt adımları.
 *
 * Buradaki hiçbir hata müşteriyi "Ödeme tamamlanamadı" ekranına düşürmemelidir —
 * para tahsil edilmiştir. Hata olursa logla, yine de başarı ekranına yönlendir.
 * Döndürülen değer yönlendirilecek URL'dir.
 */
async function finalizePaidOrder(
  result: IyzicoRetrieveResult,
  conversationId: string
): Promise<string> {
  // Pending order'ı disk'ten yükle
  const pending = await getPendingOrder(conversationId);
  if (!pending) {
    console.error("Pending order not found for conversationId:", conversationId);
    // Yine de ödeme başarılıydı — temel bilgilerle siparişi kaydet
  }

  const installmentCount = Number(result.installment ?? 1);
  const validInstallments = ["3", "6", "9"] as const;
  const installmentStr = String(installmentCount);
  const installmentKey: "single" | "3" | "6" | "9" =
    installmentCount <= 1 || !validInstallments.includes(installmentStr as "3" | "6" | "9")
      ? "single"
      : (installmentStr as "3" | "6" | "9");

  const order = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    name: pending?.name ?? String(result.buyer?.name ?? ""),
    phone: pending?.phone ?? String(result.buyer?.gsmNumber ?? ""),
    email: pending?.email ?? String(result.buyer?.email ?? ""),
    storeUrl: pending?.storeUrl ?? "",
    marketplaces: pending?.marketplaces ?? [],
    paymentMethod: "card" as const,
    installment: installmentKey,
    addManagement: pending?.addManagement ?? false,
    discountCode: pending?.discountCode ?? null,
    setupNet: pending?.setupNet ?? 0,
    managementMonthly: pending?.managementMonthly ?? 0,
    managementAddon: pending?.managementAddon ?? 0,
    discountAmount: pending?.discountAmount ?? 0,
    vatAmount: pending?.vatAmount ?? 0,
    total: pending?.total ?? Number(result.paidPrice ?? result.price ?? 0),
    status: "paid" as const,
    invoiceType: (pending?.invoiceType ?? "individual") as "individual" | "company",
    identityNo: pending?.identityNo ?? String(result.buyer?.identityNumber ?? ""),
    companyName: pending?.companyName ?? "",
    taxOffice: pending?.taxOffice ?? "",
    taxNumber: pending?.taxNumber ?? "",
    address: pending?.address ?? String(result.billingAddress?.address ?? ""),
    city: pending?.city ?? String(result.billingAddress?.city ?? ""),
    paymentId: String(result.paymentId ?? ""),
    conversationId,
    termsAcceptedAt: pending?.termsAcceptedAt,
    gaClientId: pending?.gaClientId,
    gaSessionId: pending?.gaSessionId,
  };

  await addOrder(order);

  // GA4 purchase — ödeme kesinleşti. İstemci tarafında güvenilir bir an yok
  // (müşteri birazdan harici kurulum portalına yönlendirilebilir), bu yüzden
  // Measurement Protocol ile sunucudan gönderiyoruz. sendGaPurchase throw etmez.
  //
  // after(): yanıt (303 redirect) gönderildikten SONRA çalışır. Beklemeye
  // alınırsa timeout'a düşen bir MP isteği müşteriyi 4 sn boş ekranda tutar.
  after(() =>
    sendGaPurchase(gaIdentityFrom(pending, order.id), {
      transactionId: order.id,
      total: order.total,
      vatAmount: order.vatAmount,
      discountAmount: order.discountAmount,
      discountCode: order.discountCode,
      marketplaces: order.marketplaces,
      setupNet: order.setupNet,
      managementAddon: order.managementAddon,
      paymentMethod: "card",
    })
  );

  // İndirim kodu kullanım sayacını artır
  if (order.discountCode) {
    const codes = await getCodes();
    const code = codes.find(
      (c) => c.code.toLowerCase() === order.discountCode!.toLowerCase()
    );
    if (code) {
      await incrementCodeUsage(code.id);
    }
  }

  // Pending order'ı temizle
  await deletePendingOrder(conversationId);

  // Jale kurulum kayıt linki (best-effort — başarısız olsa da ödeme akışı bozulmaz)
  const setupUrl = await createJaleOnboardingInvite({
    brandName: order.companyName || order.name,
    email: order.email,
    phone: order.phone,
    plan: order.marketplaces.join(", "),
  });

  // E-posta gönder BEST-EFFORT: ödeme başarılı ve sipariş kaydedildi. Mail
  // gönderimi (SMTP hatası vb.) başarısız olsa bile müşteriyi hata sayfasına
  // düşürme — başarı akışını bozmadan devam et.
  try {
    await sendOrderConfirmation({
      id: order.id,
      name: order.name,
      email: order.email,
      phone: order.phone,
      total: order.total,
      marketplaces: order.marketplaces,
      managementMonthly: order.managementMonthly,
      paymentId: order.paymentId,
      setupUrl: setupUrl ?? undefined,
      termsAcceptedAt: order.termsAcceptedAt,
    });
  } catch (mailErr) {
    console.error("payment/callback mail error (sipariş yine de kaydedildi):", mailErr);
  }

  // Kurulum linki üretildiyse müşteriyi doğrudan Jale portal kaydına yönlendir;
  // aksi halde normal başarı sayfasına düş (link e-postada da var).
  if (setupUrl) return setupUrl;
  return `${SITE.url}/satin-al?payment=success&orderId=${order.id}`;
}

// iyzico callback'i form POST ile gelir (application/x-www-form-urlencoded)
export async function POST(req: Request) {
  let paymentVerified = false;
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const token = params.get("token");
    const status = params.get("status");
    const callbackConversationId = params.get("conversationId") ?? undefined;

    if (!token) {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=error&reason=no_token`, 303);
    }

    if (status === "failure") {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=failure`, 303);
    }

    // Sunucu tarafında ödemeyi doğrula
    const result = await retrieveCheckoutForm(token, callbackConversationId);

    if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      console.error("iyzico retrieve failure:", result);
      return NextResponse.redirect(
        `${SITE.url}/satin-al?payment=failure&reason=${result.errorCode ?? "unknown"}`,
        303
      );
    }

    // Bu noktadan sonra para TAHSİL EDİLMİŞTİR.
    paymentVerified = true;
    const conversationId = result.conversationId ?? callbackConversationId ?? token;
    const redirectUrl = await finalizePaidOrder(result, conversationId);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (err) {
    console.error("payment/callback error:", err);
    if (paymentVerified) {
      // Ödeme alındı ama kayıt/e-posta adımı patladı. Müşteriye hata gösterme —
      // sipariş elle tamamlanacak (log'a düştü).
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=success&pending=1`, 303);
    }
    return NextResponse.redirect(`${SITE.url}/satin-al?payment=error`, 303);
  }
}
