import { NextResponse } from "next/server";
import { addOrder, generateId, getSettings, saveReceipt } from "@/lib/db";
import { computeOrderQuote, MARKETPLACES } from "@/lib/site";
import { sendTransferReceived } from "@/lib/mailer";

const VALID_MARKETPLACES = new Set<string>(MARKETPLACES.map((m) => m.key));
const MAX_RECEIPT_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
]);

function extFor(type: string, name: string): string {
  if (type === "application/pdf") return "pdf";
  if (type === "image/png") return "png";
  if (type === "image/jpeg" || type === "image/jpg") return "jpg";
  const fromName = name.split(".").pop();
  return fromName && fromName.length <= 5 ? fromName.toLowerCase() : "bin";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const receipt = formData.get("receipt");
    const payloadRaw = formData.get("payload");

    if (!(receipt instanceof File)) {
      return NextResponse.json({ error: "Dekont dosyası zorunludur" }, { status: 400 });
    }
    if (receipt.size === 0 || receipt.size > MAX_RECEIPT_BYTES) {
      return NextResponse.json({ error: "Dekont dosyası en fazla 10 MB olmalıdır" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(receipt.type)) {
      return NextResponse.json({ error: "Dekont JPG, PNG veya PDF olmalıdır" }, { status: 400 });
    }
    if (typeof payloadRaw !== "string") {
      return NextResponse.json({ error: "Sipariş bilgileri eksik" }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(payloadRaw);
    } catch {
      return NextResponse.json({ error: "Sipariş bilgileri okunamadı" }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const storeUrl = String(body.storeUrl || "").trim();
    const marketplaces: string[] = Array.isArray(body.marketplaces)
      ? (body.marketplaces as unknown[])
          .map((m) => String(m).toLowerCase().trim())
          .filter((m) => VALID_MARKETPLACES.has(m))
      : [];
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
    if (!address || !city) {
      return NextResponse.json({ error: "Fatura adresi ve şehir zorunludur" }, { status: 400 });
    }
    if (invoiceType === "company" && (!companyName || !taxOffice || !taxNumber)) {
      return NextResponse.json(
        { error: "Şirket faturası için unvan, vergi dairesi ve vergi no zorunludur" },
        { status: 400 }
      );
    }
    if (storeUrl && !/^https?:\/\/.+\..+/i.test(storeUrl)) {
      return NextResponse.json({ error: "Mağaza linki geçerli bir web adresi olmalıdır" }, { status: 400 });
    }

    const settings = await getSettings();
    const quote = computeOrderQuote(
      {
        marketplaceCount: marketplaces.length,
        addManagement,
        paymentMethod: "transfer",
        discount: null,
      },
      settings.pricing
    );

    if (quote.total <= 0) {
      return NextResponse.json({ error: "Geçersiz tutar" }, { status: 400 });
    }

    const orderId = generateId();

    // Dekontu diske kaydet
    const buffer = Buffer.from(await receipt.arrayBuffer());
    const receiptFile = `${orderId}.${extFor(receipt.type, receipt.name)}`;
    await saveReceipt(receiptFile, buffer);

    await addOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      storeUrl,
      marketplaces,
      paymentMethod: "transfer",
      installment: "single",
      addManagement,
      discountCode: null,
      setupNet: quote.setupNet,
      managementMonthly: quote.managementMonthly,
      managementAddon: quote.managementAddon,
      discountAmount: quote.discountAmount,
      vatAmount: quote.vatAmount,
      total: quote.total,
      status: "awaiting_transfer",
      invoiceType,
      identityNo,
      companyName,
      taxOffice,
      taxNumber,
      address,
      city,
      receiptFile,
    });

    // Bildirim e-postaları (SMTP yoksa sessizce geçer)
    await sendTransferReceived({
      id: orderId,
      name,
      email,
      total: quote.total,
      marketplaces,
      managementMonthly: quote.managementMonthly,
      receipt: { filename: receipt.name || receiptFile, content: buffer },
    });

    return NextResponse.json({ orderId });
  } catch (err) {
    console.error("payment/transfer error:", err);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
