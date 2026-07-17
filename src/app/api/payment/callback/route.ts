import { NextResponse } from "next/server";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import {
  addOrder,
  generateId,
  getPendingOrder,
  deletePendingOrder,
  incrementCodeUsage,
  getCodes,
} from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/mailer";
import { SITE } from "@/lib/site";

// iyzico callback'i form POST ile gelir (application/x-www-form-urlencoded)
export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const token = params.get("token");
    const status = params.get("status");

    if (!token) {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=error&reason=no_token`, 303);
    }

    if (status === "failure") {
      return NextResponse.redirect(`${SITE.url}/satin-al?payment=failure`, 303);
    }

    // Sunucu tarafında ödemeyi doğrula
    const result = await retrieveCheckoutForm(token);

    if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      console.error("iyzico retrieve failure:", result);
      return NextResponse.redirect(
        `${SITE.url}/satin-al?payment=failure&reason=${result.errorCode ?? "unknown"}`,
        303
      );
    }

    const conversationId = result.conversationId ?? token;

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
    };

    await addOrder(order);

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

    // E-posta gönder
    await sendOrderConfirmation({
      id: order.id,
      name: order.name,
      email: order.email,
      total: order.total,
      marketplaces: order.marketplaces,
      managementMonthly: order.managementMonthly,
      paymentId: order.paymentId,
    });

    return NextResponse.redirect(`${SITE.url}/satin-al?payment=success&orderId=${order.id}`, 303);
  } catch (err) {
    console.error("payment/callback error:", err);
    return NextResponse.redirect(`${SITE.url}/satin-al?payment=error`, 303);
  }
}
