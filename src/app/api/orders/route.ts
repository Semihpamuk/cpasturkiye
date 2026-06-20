import { NextResponse } from "next/server";
import {
  addOrder,
  findValidCode,
  generateId,
  getSettings,
  incrementCodeUsage,
  type Order,
} from "@/lib/db";
import { computeOrderQuote } from "@/lib/site";

const INSTALLMENTS = ["single", "3", "6", "9"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const storeUrl = String(body.storeUrl || "").trim();
    const isAgency = Boolean(body.isAgency);
    const storeCount = Math.min(Math.max(Number(body.storeCount) || 1, 1), 50);
    const billing = body.billing === "yearly" ? "yearly" : "monthly";
    const installment = INSTALLMENTS.includes(body.installment)
      ? (body.installment as Order["installment"])
      : "single";
    const discountCodeInput =
      typeof body.discountCode === "string" ? body.discountCode.trim() : "";
    const includeSetup = Boolean(body.includeSetup);

    // Fatura bilgileri
    const invoiceType = body.invoiceType === "company" ? "company" : "individual";
    const identityNo = String(body.identityNo || "").trim();
    const companyName = String(body.companyName || "").trim();
    const taxOffice = String(body.taxOffice || "").trim();
    const taxNumber = String(body.taxNumber || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Ad, telefon ve e-posta zorunludur" },
        { status: 400 }
      );
    }
    if (name.length > 200 || phone.length > 50 || email.length > 200 || storeUrl.length > 500) {
      return NextResponse.json({ error: "Geçersiz alan uzunluğu" }, { status: 400 });
    }
    if (storeUrl && !/^https?:\/\/(www\.)?trendyol\.com\//i.test(storeUrl)) {
      return NextResponse.json(
        { error: "Mağaza URL'si geçerli bir Trendyol mağaza adresi olmalıdır" },
        { status: 400 }
      );
    }
    if (!address || !city) {
      return NextResponse.json(
        { error: "Fatura adresi ve şehir zorunludur" },
        { status: 400 }
      );
    }
    if (invoiceType === "company") {
      if (!companyName || !taxOffice || !taxNumber) {
        return NextResponse.json(
          { error: "Şirket faturası için unvan, vergi dairesi ve vergi no zorunludur" },
          { status: 400 }
        );
      }
    }
    if (
      companyName.length > 300 ||
      taxOffice.length > 100 ||
      taxNumber.length > 20 ||
      identityNo.length > 20 ||
      address.length > 500 ||
      city.length > 100
    ) {
      return NextResponse.json({ error: "Geçersiz alan uzunluğu" }, { status: 400 });
    }
    // Güncel fiyatlar admin ayarlarından gelir; istemciden gelen tutara güvenme
    const settings = await getSettings();

    if (isAgency && storeCount >= settings.pricing.agencyContactThreshold) {
      return NextResponse.json(
        { error: "Bu mağaza sayısı için lütfen iletişime geçin" },
        { status: 400 }
      );
    }

    // İndirim kodunu sunucu tarafında yeniden doğrula
    const validCode = discountCodeInput ? await findValidCode(discountCodeInput) : null;

    const quote = computeOrderQuote(
      {
        isAgency,
        storeCount,
        billing,
        includeSetup,
        discount: validCode ? { type: validCode.type, value: validCode.value } : null,
      },
      settings.pricing
    );

    const order: Order = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      storeUrl,
      isAgency,
      storeCount,
      billing,
      installment,
      discountCode: validCode ? validCode.code : null,
      subscriptionNet: quote.subscriptionNet,
      includeSetup,
      setupNet: quote.setupNet,
      discountAmount: quote.discountAmount,
      vatAmount: quote.vatAmount,
      total: quote.total,
      status: "new",
      invoiceType,
      identityNo,
      companyName,
      taxOffice,
      taxNumber,
      address,
      city,
    };

    await addOrder(order);
    if (validCode) {
      await incrementCodeUsage(validCode.id);
    }

    return NextResponse.json({ success: true, orderId: order.id, total: order.total });
  } catch {
    return NextResponse.json({ error: "Sipariş alınamadı" }, { status: 500 });
  }
}
