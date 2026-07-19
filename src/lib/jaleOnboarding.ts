import "server-only";

/**
 * Ödeme onaylandığında Jale panelinde tek-kullanımlık kurulum kayıt linki üretir.
 *
 * SADECE SUNUCU TARAFINDA çalışır ("server-only") — API anahtarı tarayıcıya düşmez.
 * BEST-EFFORT: env eksikse veya istek başarısızsa `null` döner ve çağıran akış
 * (sipariş kaydı / e-posta / yönlendirme) BOZULMAZ — ödeme her hâlükârda tamamlanır.
 *
 * Gerekli env:
 *   JALE_ONBOARDING_URL   → ör. https://panel.cpasturkiye.com/api/public/onboarding-invite
 *   JALE_SIGNUP_API_KEY   → Jale .env'indeki PORTAL_SIGNUP_API_KEY ile AYNI değer
 */

export interface JaleInviteInput {
  brandName?: string;
  email?: string;
  phone?: string;
  plan?: string;
}

/** Başarılıysa `/portal/register?token=...` URL'sini, aksi halde `null` döner. */
export async function createJaleOnboardingInvite(input: JaleInviteInput): Promise<string | null> {
  const url = process.env.JALE_ONBOARDING_URL;
  const apiKey = process.env.JALE_SIGNUP_API_KEY;
  if (!url || !apiKey) {
    return null; // entegrasyon yapılandırılmamış — sessizce atla
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName: input.brandName,
        email: input.email,
        phone: input.phone,
        plan: input.plan,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[jaleOnboarding] HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { success?: boolean; url?: string };
    return data.success && data.url ? data.url : null;
  } catch (err) {
    console.error("[jaleOnboarding] istek hatası:", err);
    return null;
  }
}
