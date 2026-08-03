import { NextResponse } from "next/server";
import { readLogo } from "@/lib/db";
import { LOGO_EXT_MIME } from "@/lib/references";

// Public: yüklenen referans logolarını sunar (anasayfadaki kayan şerit kullanır).
// Dosya adları yükleme sırasında üretildiği için içerik değişmez → uzun cache.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file || !/^[a-z0-9._-]+$/i.test(file)) {
    return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 });
  }

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const contentType = LOGO_EXT_MIME[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 });
  }

  const data = await readLogo(file);
  if (!data) {
    return NextResponse.json({ error: "Logo bulunamadı" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      // SVG aynı origin'den servis edildiği için script çalıştırmasını engelle.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
