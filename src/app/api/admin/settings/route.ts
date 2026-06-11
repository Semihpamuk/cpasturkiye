import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSettings, saveSettings, type SiteSettings } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return NextResponse.json(await getSettings());
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const current = await getSettings();

    const num = (value: unknown, fallback: number, min = 0): number => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= min ? parsed : fallback;
    };

    const updated: SiteSettings = {
      pricing: {
        starter: num(body?.pricing?.starter, current.pricing.starter, 1),
        extraStore: num(body?.pricing?.extraStore, current.pricing.extraStore, 1),
        agencyPerStore: num(
          body?.pricing?.agencyPerStore,
          current.pricing.agencyPerStore,
          1
        ),
        agencyContactThreshold: num(
          body?.pricing?.agencyContactThreshold,
          current.pricing.agencyContactThreshold,
          2
        ),
        setupFee: num(body?.pricing?.setupFee, current.pricing.setupFee, 0),
        yearlyDiscount: Math.min(
          0.9,
          num(body?.pricing?.yearlyDiscount, current.pricing.yearlyDiscount, 0)
        ),
      },
      references: Array.isArray(body?.references)
        ? body.references
            .map((r: unknown) => ({
              name: String((r as { name?: unknown }).name ?? "").trim().slice(0, 80),
              url: String((r as { url?: unknown }).url ?? "").trim().slice(0, 300),
            }))
            .filter((r: { name: string; url: string }) => r.name.length > 0)
            .slice(0, 50)
        : current.references,
    };

    await saveSettings(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}
