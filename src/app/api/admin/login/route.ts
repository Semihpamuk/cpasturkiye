import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";
import { RATE_LIMITS, clientIp, consumeRateLimit, rateLimitHeaders, resetRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limit = consumeRateLimit("admin-login", ip, RATE_LIMITS.adminLogin);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Çok fazla deneme. 1 dakika bekleyin." },
        { status: 429, headers: rateLimitHeaders(limit) }
      );
    }

    const body = await req.json();
    const password = String(body.password || "");

    if (password !== getAdminPassword()) {
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    resetRateLimit("admin-login", ip);
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
