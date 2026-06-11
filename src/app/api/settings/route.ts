import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

// Public: fiyatlar ve referanslar (anasayfa, fiyatlandırma, satın alma sayfaları kullanır)
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "no-store" },
  });
}
