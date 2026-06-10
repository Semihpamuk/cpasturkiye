import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";

// Basit brute-force koruması: IP başına dakikada 5 deneme
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    const now = Date.now();
    const entry = attempts.get(ip);
    if (entry && entry.resetAt > now && entry.count >= 5) {
      return NextResponse.json(
        { error: "Çok fazla deneme. 1 dakika bekleyin." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = String(body.password || "");

    if (password !== getAdminPassword()) {
      const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + 60_000 };
      attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });
      return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
    }

    attempts.delete(ip);
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
