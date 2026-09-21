import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSettings, saveSettings } from "@/lib/db";
import { localizeReferenceLogos } from "@/lib/logo-localize";

// Uzak (https://...) referans logolarını sunucuya kopyalar ve ayarları günceller.
// Yalnızca admin oturumu. Bkz. lib/logo-localize.ts.
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const settings = await getSettings();
    const result = await localizeReferenceLogos(settings.references);
    if (result.localized.length > 0) {
      await saveSettings({ ...settings, references: result.references });
    }
    return NextResponse.json({
      localized: result.localized,
      skipped: result.skipped.length,
      failed: result.failed,
    });
  } catch (err) {
    console.error("[logo/localize]", err);
    return NextResponse.json({ error: "Logolar kopyalanamadı" }, { status: 500 });
  }
}
