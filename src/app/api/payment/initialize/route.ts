import { NextResponse } from "next/server";
import { findValidCode, getSettings, savePendingOrder } from "@/lib/db";
import { computeOrderQuote } from "@/lib/site";
import { initializeCheckoutForm, type IyzicoBasketItem } from "@/lib/iyzico";
import { SITE, MARKETPLACES } from "@/lib/site";

const VALID_MARKETPLACES = new Set<string>(MARKETPLACES.map((m) => m.key));

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const storeUrl = String(body.storeUrl || "").trim();
    const marketplaces: string[] = Array.isArray(body.marketplaces)
      ? body.marketplaces
          .map((m: unknown) => String(m).toLowerCase().trim())
          .filter((m: string) => VALID_MARKETPLACES.has(m))
      : [];
    const discountCodeInput = typeof body.discountCode === "string" ? body.discountCode.trim() : "";
    const addManagement = body.addManagement === true;
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
    if (marketplaces.length === 0) {
      return NextResponse.json({ error: "En az bir pazaryeri seçmelisiniz" }, { status: 400 });
    }
    // Fatura bilgileri opsiyoneldir — zorunlu doğrulama yapılmaz.
    if (storeUrl && !/^https?:\/\/.+\..+/i.test(storeUrl)) {
      return NextResponse.json({ error: "Mağaza linki geçerli bir web adresi olmalıdır" }, { status: 400 });
    }

    const settings = await getSettings();

    const validCode = discountCodeInput ? await findValidCode(discountCodeInput) : null;
    const quote = computeOrderQuote(
      {
        marketplaceCount: marketplaces.length,
        addManagement,
        paymentMethod: "card",
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

    const basketItems: IyzicoBasketItem[] = [
      {
        id: "setup-package",
        name: addManagement
          ? "CPAS Kurulum + İlk Ay Yönetim + Devam Ayı Paketi"
          : "CPAS Kurulum + İlk Ay Yönetim Paketi",
        category1: "Profesyonel Hizmet",
        itemType: "VIRTUAL",
        price: quote.total.toFixed(2),
      },
    ];

    const totalStr = quote.total.toFixed(2);

    // Buyer için ad-soyad ayır
    const nameParts = name.split(" ");
    const buyerName = nameParts.slice(0, -1).join(" ") || name;
    const buyerSurname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "-";

    const callbackUrl = `${SITE.url}/api/payment/callback`;

    // Fatura bilgileri opsiyonel — iyzico boş adres/şehir kabul etmediği için
    // güvenli varsayılanlarla doldur.
    const buyerAddress = address || SITE.address;
    const buyerCity = city || "İstanbul";
    const billingContact = (invoiceType === "company" ? companyName : name) || name;

    const result = await initializeCheckoutForm({
      locale: "tr",
      conversationId,
      price: totalStr,
      paidPrice: totalStr,
      currency: "TRY",
      basketId: conversationId,
      paymentGroup: "PRODUCT",
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: conversationId,
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: phone.startsWith("+") ? phone : `+90${phone.replace(/\D/g, "").slice(-10)}`,
        email,
        identityNumber: identityNo || "11111111110",
        registrationAddress: buyerAddress,
        city: buyerCity,
        country: "Turkey",
      },
      shippingAddress: {
        contactName: name,
        city: buyerCity,
        country: "Turkey",
        address: buyerAddress,
      },
      billingAddress: {
        contactName: billingContact,
        city: buyerCity,
        country: "Turkey",
        address: buyerAddress,
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
      marketplaces,
      addManagement,
      discountCode: validCode?.code ?? null,
      setupNet: quote.setupNet,
      managementMonthly: quote.managementMonthly,
      managementAddon: quote.managementAddon,
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
