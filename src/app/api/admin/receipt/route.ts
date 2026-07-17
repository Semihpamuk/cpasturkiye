import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readReceipt } from "@/lib/db";

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

// Havale dekontlarını yalnızca admin oturumuyla sunar.
export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file || !/^[a-z0-9._-]+$/i.test(file)) {
    return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 });
  }

  const data = await readReceipt(file);
  if (!data) {
    return NextResponse.json({ error: "Dekont bulunamadı" }, { status: 404 });
  }

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
