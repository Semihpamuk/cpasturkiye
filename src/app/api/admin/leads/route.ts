import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLeads, updateLeadStatus, type Lead } from "@/lib/db";

const STATUSES: Lead["status"][] = ["new", "contacted", "closed"];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(await getLeads());
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = body.status as Lead["status"];
    if (!id || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Geçersiz parametre" }, { status: 400 });
    }
    await updateLeadStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}
