import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { generateId, saveLogo } from "@/lib/db";
import { LOGO_MIME_EXT, MAX_LOGO_BYTES, logoPathFor } from "@/lib/references";

// Referans logosu yükleme — yalnızca admin oturumu.
// Dosya data/logos/ altına (kalıcı disk) yazılır, ayarlarda /api/logo yolu saklanır.
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const raw = formData.get("logo");

    if (!(raw instanceof File) || raw.size === 0) {
      return NextResponse.json({ error: "Logo dosyası seçilmedi" }, { status: 400 });
    }
    if (raw.size > MAX_LOGO_BYTES) {
      return NextResponse.json(
        { error: "Logo dosyası en fazla 2 MB olmalıdır" },
        { status: 400 }
      );
    }

    const ext = LOGO_MIME_EXT[raw.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Logo PNG, JPG, WEBP veya SVG olmalıdır" },
        { status: 400 }
      );
    }

    const storedName = `${generateId()}.${ext}`;
    await saveLogo(storedName, Buffer.from(await raw.arrayBuffer()));

    return NextResponse.json({ path: logoPathFor(storedName) });
  } catch {
    return NextResponse.json({ error: "Logo yüklenemedi" }, { status: 500 });
  }
}
