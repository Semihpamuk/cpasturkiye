import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders, updateOrderStatus, type Order } from "@/lib/db";

const STATUSES: Order["status"][] = ["new", "contacted", "paid", "cancelled"];

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
    await updateOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}
