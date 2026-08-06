import { NextResponse, after } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders, updateOrderStatus, type Order } from "@/lib/db";
import { createJaleOnboardingInvite } from "@/lib/jaleOnboarding";
import { sendOrderConfirmation } from "@/lib/mailer";
import { gaIdentityFrom, sendGaPurchase } from "@/lib/ga-server";

const STATUSES: Order["status"][] = [
  "new",
  "contacted",
  "awaiting_transfer",
  "paid",
  "cancelled",
];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(await getOrders());
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = body.status as Order["status"];
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Geçersiz parametre" }, { status: 400 });
    }

    // "paid"e GEÇİŞ (havale onayı) — Jale kurulum linkini üret + müşteriye e-postala.
    // Yalnızca gerçek geçişte (zaten paid değilse) tetiklenir; best-effort, akışı bozmaz.
    const order = (await getOrders()).find((o) => o.id === id);
    const becomingPaid = status === "paid" && order && order.status !== "paid";

    await updateOrderStatus(id, status);

    if (becomingPaid && order) {
      // Havale siparişi onaylandı → ciro şimdi kesinleşti. Kart siparişleri
      // purchase'ı zaten callback'te gönderdi; tekrar göndermiyoruz.
      // (Gönderilse bile GA4 aynı transaction_id'yi eler, ama niyeti net tut.)
      // after(): panel yanıtı MP isteğini beklemesin.
      if (order.paymentMethod === "transfer") {
        after(() =>
          sendGaPurchase(gaIdentityFrom(order, order.id), {
            transactionId: order.id,
            total: order.total,
            vatAmount: order.vatAmount,
            discountAmount: order.discountAmount,
            discountCode: order.discountCode,
            marketplaces: order.marketplaces,
            setupNet: order.setupNet,
            managementAddon: order.managementAddon,
            paymentMethod: "transfer",
          })
        );
      }

      try {
        const setupUrl = await createJaleOnboardingInvite({
          brandName: order.companyName || order.name,
          email: order.email,
          phone: order.phone,
          plan: order.marketplaces.join(", "),
        });
        if (setupUrl) {
          await sendOrderConfirmation({
            id: order.id,
            name: order.name,
            email: order.email,
            total: order.total,
            marketplaces: order.marketplaces,
            managementMonthly: order.managementMonthly,
            paymentId: order.paymentId,
            setupUrl,
            termsAcceptedAt: order.termsAcceptedAt,
          });
        }
      } catch (e) {
        console.error("[admin/orders] kurulum linki gönderilemedi:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}
