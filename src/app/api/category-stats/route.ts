import { NextResponse } from "next/server";
import { getCategoryStats } from "@/lib/categoryStats";

// Public: vaka çalışmaları bölümü için — anasayfa bu route'u client-side'da çağırır.
// Runtime'da çalışır, build'e bağımlı değildir.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCategoryStats();

  if (!data) {
    return NextResponse.json(
      { success: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { success: true, data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
