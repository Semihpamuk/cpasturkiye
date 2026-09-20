import { NextResponse } from "next/server";
import { clientIp, consumeRateLimit } from "@/lib/rate-limit";

// Tarayıcıların CSP ihlal raporları buraya düşer (bkz. lib/security-headers.ts).
// Yalnızca loglar: Easypanel → App → Logs'ta "[csp]" ile filtrele.
//
// Rapor modunda amaç, zorunlu kılmadan önce hangi kaynağın eksik olduğunu görmek.
// Her ziyaretçinin tarayıcısı buraya yazabildiği için hız sınırı var ve gövde kısa tutulur.

const MAX_BODY_BYTES = 8 * 1024;
const LIMIT = { limit: 30, windowMs: 60_000 };

interface LegacyReport {
  "csp-report"?: Record<string, unknown>;
}

function summarize(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as LegacyReport | Array<{ body?: Record<string, unknown> }>;
    // Eski biçim: {"csp-report": {...}} — yeni Reporting API: [{"body": {...}}]
    const body = Array.isArray(parsed) ? parsed[0]?.body : parsed["csp-report"];
    if (!body) return raw.slice(0, 300);
    const pick = (k: string, alt: string) => String(body[k] ?? body[alt] ?? "");
    return [
      `directive=${pick("violated-directive", "effectiveDirective")}`,
      `blocked=${pick("blocked-uri", "blockedURL").slice(0, 200)}`,
      `page=${pick("document-uri", "documentURL").slice(0, 200)}`,
      `source=${pick("source-file", "sourceFile").slice(0, 120)}:${pick("line-number", "lineNumber")}`,
    ].join(" ");
  } catch {
    return raw.slice(0, 300);
  }
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!consumeRateLimit("csp-report", ip, LIMIT).ok) {
    return new NextResponse(null, { status: 429 });
  }

  const raw = (await req.text()).slice(0, MAX_BODY_BYTES);
  if (raw.trim()) {
    console.warn(`[csp] ${summarize(raw)} ip=${ip}`);
  }
  return new NextResponse(null, { status: 204 });
}
