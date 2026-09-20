import { NextResponse } from "next/server";
import { addLead, generateId } from "@/lib/db";
import { syncPendingLeadsToCrm } from "@/lib/crm-sync";
import { RATE_LIMITS, clientIp, consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { HONEYPOT_FIELD, checkSpam } from "@/lib/spam-guard";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limit = consumeRateLimit("leads", ip, RATE_LIMITS.leads);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Çok fazla başvuru gönderildi. Lütfen biraz sonra tekrar deneyin." },
        { status: 429, headers: rateLimitHeaders(limit) }
      );
    }

    const body = await req.json();

    // Bot sinyali: kayıt yazmadan "başarılı" dön — bot neyin yakaladığını öğrenmesin,
    // SatisCRM havuzuna da çöp düşmesin.
    const spam = checkSpam({ honeypot: body[HONEYPOT_FIELD], startedAt: body.startedAt });
    if (spam.spam) {
      console.warn(`[leads] spam engellendi (${spam.reason}) ip=${ip}`);
      return NextResponse.json({ success: true });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Ad, telefon ve e-posta zorunludur" },
        { status: 400 }
      );
    }
    if (name.length > 200 || phone.length > 50 || email.length > 200) {
      return NextResponse.json({ error: "Geçersiz alan uzunluğu" }, { status: 400 });
    }

    await addLead({
      id: generateId(),
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      storeUrl: String(body.storeUrl || "").slice(0, 500),
      monthlyOrders: String(body.monthlyOrders || "").slice(0, 50),
      message: String(body.message || "").slice(0, 2000),
      status: "new",
    });

    // Lead diske yazıldı — SatisCRM'e iletim başarısız olsa da veri kaybolmaz,
    // bekleyenler bir sonraki başvuruda tekrar denenir (bkz. lib/crm-sync.ts).
    // Ziyaretçi CRM'i beklemesin diye await YOK; Node sunucusu yanıttan sonra bitirir.
    void syncPendingLeadsToCrm();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Başvuru alınamadı" }, { status: 500 });
  }
}
