import { NextResponse } from "next/server";
import { findValidCode, getSettings, savePendingOrder } from "@/lib/db";
import { computeOrderQuote } from "@/lib/site";
import { initializeCheckoutForm, type IyzicoBasketItem } from "@/lib/iyzico";
import { SITE } from "@/lib/site";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sipariş parametrelerini doğrula (orders/route.ts ile aynı mantık)
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const storeUrl = String(body.storeUrl || "").trim();
    const isAgency = Boolean(body.isAgency);
    const storeCount = Math.min(Math.max(Number(body.storeCount) || 1, 1), 50);
    const billing = body.billing === "yearly" ? "yearly" : "monthly";
    const discountCodeInput = typeof body.discountCode === "string" ? body.discountCode.trim() : "";
    const includeSetup = Boolean(body.includeSetup);
    const setupOnly = Boolean(body.setupOnly);
    const invoiceType = body.invoiceType === "company" ? "company" : "individual";
    const identityNo = String(body.identityNo || "").trim();
    const companyName = String(body.companyName || "").trim();
    const taxOffice = String(body.taxOffice || "").trim();
    const taxNumber = String(body.taxNumber || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Ad, telefon ve e-posta zorunludur" }, { status: 400 });
    }
    if (!address || !city) {
      return NextResponse.json({ error: "Fatura adresi ve şehir zorunludur" }, { status: 400 });
    }
    if (invoiceType === "company" && (!companyName || !taxOffice || !taxNumber)) {
      return NextResponse.json({ error: "Şirket faturası için unvan, vergi dairesi ve vergi no zorunludur" }, { status: 400 });
    }
    if (storeUrl && !/^https?:\/\/(www\.)?trendyol\.com\//i.test(storeUrl)) {
      return NextResponse.json({ error: "Mağaza URL'si geçerli bir Trendyol mağaza adresi olmalıdır" }, { status: 400 });
    }

    const settings = await getSettings();

    if (isAgency && storeCount >= settings.pricing.agencyContactThreshold) {
      return NextResponse.json({ error: "Bu mağaza sayısı için lütfen iletişime geçin" }, { status: 400 });
    }

    const validCode = discountCodeInput ? await findValidCode(discountCodeInput) : null;
    const quote = computeOrderQuote(
      {
        isAgency,
        storeCount,
        billing,
        includeSetup,
        setupOnly,
        discount: validCode ? { type: validCode.type, value: validCode.value } : null,
      },
      settings.pricing
    );

    // Tutar sıfır olamaz
    if (quote.total <= 0) {
      return NextResponse.json({ error: "Geçersiz tutar" }, { status: 400 });
    }

    // conversationId: sonraki aşamada sipariş kimliği olarak kullanılır
    const conversationId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    // Sepet kalemleri
    let basketItems: IyzicoBasketItem[];

    if (setupOnly) {
      basketItems = [
        {
          id: "setup",
          name: "Trendyol–Meta CPAS Kurulum Hizmeti",
          category1: "Profesyonel Hizmet",
          itemType: "VIRTUAL",
          price: quote.total.toFixed(2),
        },
      ];
    } else {
      const planLabel = isAgency
        ? `Ajans Planı — ${storeCount} Mağaza — ${billing === "yearly" ? "Yıllık" : "Aylık"}`
        : `Standart Plan — ${storeCount} Mağaza — ${billing === "yearly" ? "Yıllık" : "Aylık"}`;

      const subscriptionTotal = (
        quote.netAfterDiscount + quote.vatAmount - (includeSetup ? Math.round(quote.setupNet * 1.2) : 0)
      );

      basketItems = [
        {
          id: "subscription",
          name: planLabel,
          category1: "SaaS Abonelik",
          itemType: "VIRTUAL",
          price: subscriptionTotal.toFixed(2),
        },
      ];

      if (includeSetup) {
        basketItems.push({
          id: "setup",
          name: "Kurulum Hizmeti (tek seferlik)",
          category1: "Profesyonel Hizmet",
          itemType: "VIRTUAL",
          price: Math.round(quote.setupNet * 1.2).toFixed(2),
        });
      }
    }

    const totalStr = quote.total.toFixed(2);

    // Buyer için ad-soyad ayır
    const nameParts = name.split(" ");
    const buyerName = nameParts.slice(0, -1).join(" ") || name;
    const buyerSurname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "-";

    const callbackUrl = `${SITE.url}/api/payment/callback`;

    const result = await initializeCheckoutForm({
      locale: "tr",
      conversationId,
      price: totalStr,
      paidPrice: totalStr,
      currency: "TRY",
      basketId: conversationId,
      paymentGroup: "SUBSCRIPTION",
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: conversationId,
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: phone.startsWith("+") ? phone : `+90${phone.replace(/\D/g, "").slice(-10)}`,
        email,
        identityNumber: identityNo || "11111111110",
        registrationAddress: address,
        city,
        country: "Turkey",
      },
      shippingAddress: {
        contactName: name,
        city,
        country: "Turkey",
        address,
      },
      billingAddress: {
        contactName: invoiceType === "company" ? companyName : name,
        city,
        country: "Turkey",
        address,
      },
      basketItems,
    });

    if (result.status !== "success" || !result.checkoutFormContent) {
      console.error("iyzico init error:", result);
      return NextResponse.json(
        { error: result.errorMessage ?? "Ödeme başlatılamadı. Lütfen tekrar deneyin." },
        { status: 502 }
      );
    }

    // Pending order'ı diske kaydet — callback bu veriye conversationId ile erişir
    await savePendingOrder({
      conversationId,
      createdAt: new Date().toISOString(),
      name, phone, email, storeUrl,
      isAgency, storeCount, billing,
      includeSetup: setupOnly ? true : includeSetup,
      discountCode: validCode?.code ?? null,
      subscriptionNet: quote.subscriptionNet,
      setupNet: quote.setupNet,
      discountAmount: quote.discountAmount,
      vatAmount: quote.vatAmount,
      total: quote.total,
      invoiceType,
      identityNo,
      companyName,
      taxOffice,
      taxNumber,
      address,
      city,
    });

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
      conversationId,
    });
  } catch (err) {
    console.error("payment/initialize error:", err);
    return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 });
  }
}
