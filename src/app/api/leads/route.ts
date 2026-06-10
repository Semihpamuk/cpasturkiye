import { NextResponse } from "next/server";
import { addLead, generateId } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Başvuru alınamadı" }, { status: 500 });
  }
}
