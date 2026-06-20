import { NextResponse } from "next/server";
import { findValidCode } from "@/lib/db";

// IP başına dakikada 10 deneme limiti
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const now = Date.now();
    const entry = attempts.get(ip);

    if (entry && entry.resetAt > now && entry.count >= 10) {
      return NextResponse.json(
        { valid: false, error: "Çok fazla deneme. 1 dakika bekleyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code || code.length > 50) {
      return NextResponse.json(
        { valid: false, error: "Geçersiz kod" },
        { status: 400 }
      );
    }

    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + 60_000 };
    attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });

    const found = await findValidCode(code);
    if (!found) {
      return NextResponse.json({
        valid: false,
        error: "Kod geçersiz veya süresi dolmuş",
      });
    }

    if (found.value <= 0) {
      return NextResponse.json({
        valid: false,
        error: "Kod geçersiz veya süresi dolmuş",
      });
    }

    attempts.delete(ip);
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
