import { NextResponse } from "next/server";
import { findValidCode } from "@/lib/db";
import { RATE_LIMITS, clientIp, consumeRateLimit, rateLimitHeaders, resetRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limit = consumeRateLimit("discount", ip, RATE_LIMITS.discountValidate);
    if (!limit.ok) {
      return NextResponse.json(
        { valid: false, error: "Çok fazla deneme. 1 dakika bekleyin." },
        { status: 429, headers: rateLimitHeaders(limit) }
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

    const found = await findValidCode(code);
    if (!found || found.value <= 0) {
      return NextResponse.json({
        valid: false,
        error: "Kod geçersiz veya süresi dolmuş",
      });
    }

    resetRateLimit("discount", ip);
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
