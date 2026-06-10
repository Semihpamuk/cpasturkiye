import { NextResponse } from "next/server";
import { findValidCode } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code || code.length > 50) {
      return NextResponse.json(
        { valid: false, error: "Geçersiz kod" },
        { status: 400 }
      );
    }

    const found = await findValidCode(code);
    if (!found) {
      return NextResponse.json({
        valid: false,
        error: "Kod geçersiz veya süresi dolmuş",
      });
    }

    return NextResponse.json({
      valid: true,
      code: found.code,
      type: found.type,
      value: found.value,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
