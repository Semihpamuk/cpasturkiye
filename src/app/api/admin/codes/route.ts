import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateId, getCodes, saveCodes, type DiscountCode } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(await getCodes());
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const code = String(body.code || "").trim().toUpperCase();
    const type = body.type === "fixed" ? "fixed" : "percent";
    const value = Number(body.value);

    if (!code || code.length > 30 || !/^[A-Z0-9_-]+$/.test(code)) {
      return NextResponse.json(
        { error: "Kod yalnızca harf, rakam, tire içerebilir" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json({ error: "Geçersiz indirim değeri" }, { status: 400 });
    }
    if (type === "percent" && value > 100) {
      return NextResponse.json({ error: "Yüzde 100'den büyük olamaz" }, { status: 400 });
    }

    const codes = await getCodes();
    if (codes.some((c) => c.code === code)) {
      return NextResponse.json({ error: "Bu kod zaten mevcut" }, { status: 400 });
    }

    const newCode: DiscountCode = {
      id: generateId(),
      code,
      type,
      value,
      maxUses: body.maxUses ? Math.max(1, Number(body.maxUses)) : null,
      usedCount: 0,
      expiresAt: body.expiresAt ? new Date(body.expiresAt).toISOString() : null,
      active: true,
      note: String(body.note || "").slice(0, 200),
      createdAt: new Date().toISOString(),
    };

    await saveCodes([newCode, ...codes]);
    return NextResponse.json(newCode);
  } catch {
    return NextResponse.json({ error: "Kod oluşturulamadı" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const codes = await getCodes();
    const target = codes.find((c) => c.id === id);
    if (!target) {
      return NextResponse.json({ error: "Kod bulunamadı" }, { status: 404 });
    }
    await saveCodes(
      codes.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const codes = await getCodes();
    await saveCodes(codes.filter((c) => c.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}
