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
import {
  buildPaidOrder,
  decideCallbackOutcome,
  resolveConversationId,
} from "@/lib/payment-callback";
import { sendOrderConfirmation } from "@/lib/mailer";
import { createJaleOnboardingInvite } from "@/lib/jaleOnboarding";
import { gaIdentityFrom, sendGaPurchase } from "@/lib/ga-server";
import { sendMetaPurchase } from "@/lib/meta-capi";
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

  // Sipariş kaydının kurulumu saf fonksiyonda (lib/payment-callback.ts):
  // taksit eşlemesi ve "tutar pending'den mi iyzico'dan mı" kararı testli.
  const order = buildPaidOrder({
    result,
    pending: pending ?? null,
    conversationId,
    id: generateId(),
    createdAt: new Date().toISOString(),
  });

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

  // Meta Conversions API — aynı gerekçe: istemci tarafında güvenilir bir
  // Purchase anı yok. sendMetaPurchase throw etmez.
  after(() =>
    sendMetaPurchase({
      eventId: order.id,
      value: order.total,
      currency: "TRY",
      email: order.email,
      phone: order.phone,
      fbp: order.fbp,
      fbc: order.fbc,
      ip: order.clientIp,
      userAgent: order.userAgent,
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
  if (!setupUrl) {
    // Sebebi `createJaleOnboardingInvite` yazıyor (eksik env / HTTP / istisna); burada
    // KİMİN linksiz kaldığı yazılır. İkisi olmadan konteyner logunda "bir yerde bir
    // müşteri" kalıyor ve elle telafi edilemiyordu — ödeme alınmış, kurulum başlamamış
    // olur ve müşteri normal başarı sayfasına düşer.
    console.warn(
      `[payment/callback] Jale kurulum linki üretilemedi — sipariş ${order.id}, ` +
        `${order.email}. Müşteriye davet ELLE gönderilmeli.`
    );
  }

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

    const earlyOutcome = decideCallbackOutcome(token, status, null);
    if (earlyOutcome.kind === "error") {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=error&reason=no_token`, 303);
    }
    if (earlyOutcome.kind === "failure") {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=failure`, 303);
    }

    // Sunucu tarafında ödemeyi doğrula
    const result = await retrieveCheckoutForm(token!, callbackConversationId);
    const outcome = decideCallbackOutcome(token, status, result);

    if (outcome.kind !== "paid") {
      console.error("iyzico retrieve failure:", result);
      const reason = outcome.kind === "failure" ? (outcome.reason ?? "unknown") : "unknown";
      return NextResponse.redirect(
        `${SITE.url}/satin-al?payment=failure&reason=${reason}`,
        303
      );
    }

    // Bu noktadan sonra para TAHSİL EDİLMİŞTİR.
    paymentVerified = true;
    const conversationId = resolveConversationId(
      result.conversationId,
      callbackConversationId,
      token!
    );
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
