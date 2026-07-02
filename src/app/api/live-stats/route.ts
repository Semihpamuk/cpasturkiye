import { NextResponse } from "next/server";
import { getLiveStats } from "@/lib/liveStats";

// Public: canlı istatistik bandı için — anasayfa bu route'u client-side'da çağırır.
// Runtime'da çalışır, build'e hiç bağımlı değildir.
export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getLiveStats();

  if (!stats) {
    return NextResponse.json(
      { success: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { success: true, data: stats },
    { headers: { "Cache-Control": "no-store" } }
  );
}
