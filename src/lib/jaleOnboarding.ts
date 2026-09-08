import "server-only";

/**
 * Ödeme onaylandığında Jale panelinde tek-kullanımlık kurulum kayıt linki üretir.
 *
 * SADECE SUNUCU TARAFINDA çalışır ("server-only") — API anahtarı tarayıcıya düşmez.
 * BEST-EFFORT: env eksikse veya istek başarısızsa `null` döner ve çağıran akış
 * (sipariş kaydı / e-posta / yönlendirme) BOZULMAZ — ödeme her hâlükârda tamamlanır.
 *
 * Gerekli env:
 *   JALE_ONBOARDING_URL   → https://jale.cpasturkiye.com/api/public/onboarding-invite
 *   JALE_SIGNUP_API_KEY   → Jale .env'indeki PORTAL_SIGNUP_API_KEY ile AYNI değer
 *
 * ⚠️ Host `jale.cpasturkiye.com`'dur. Bu satırda daha önce örnek olarak
 * `panel.cpasturkiye.com` yazıyordu; o alan adı ÇÖZÜLMÜYOR (2026-09-08'de ölçüldü,
 * bağlantı kurulamıyor) — kopyalanırsa köprü sessizce çalışmaz. Jale tarafındaki uç
 * canlıda doğrulandı: yanlış anahtarla `401 {"success":false,"error":"Yetkisiz"}`
 * döner, yani `PORTAL_SIGNUP_API_KEY` orada TANIMLI (tanımsız olsaydı 500 dönerdi).
 *
 * BEST-EFFORT ≠ SESSİZ: her düşüş dalı log bırakır. Bu fonksiyon ödemeden SONRA
 * çalışır; sessizce `null` dönmesi "köprü kurulu" sanılıp müşterilerin kurulum
 * linkini hiç almadığının aylarca fark edilmemesi demektir.
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
    // Tek TAMAMEN sessiz daldı: eskiden hiçbir iz bırakmadan `null` dönüyordu.
    // Değerler BASILMAZ, yalnız hangi anahtarın eksik olduğu yazılır.
    const eksik: string[] = [];
    if (!url) eksik.push("JALE_ONBOARDING_URL");
    if (!apiKey) eksik.push("JALE_SIGNUP_API_KEY");
    console.warn(
      `[jaleOnboarding] Köprü PASİF — eksik env: ${eksik.join(", ")}. ` +
        `Müşteriye kurulum linki gönderilmeyecek (ödeme etkilenmez).`
    );
    return null;
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
      // Gövde de yazılır: durum kodu tek başına sebebi söylemiyor. Jale tarafında
      // 401 = anahtarlar UYUŞMUYOR, 500 = orada PORTAL_SIGNUP_API_KEY tanımsız —
      // ikisi ayrı iş, ayrı yerde düzeltilir. Anahtar gövdeye yansımaz.
      const govde = await res.text().catch(() => "<okunamadı>");
      console.error(`[jaleOnboarding] HTTP ${res.status} — ${govde.slice(0, 200)}`);
      return null;
    }
    const data = (await res.json()) as { success?: boolean; url?: string };
    return data.success && data.url ? data.url : null;
  } catch (err) {
    console.error("[jaleOnboarding] istek hatası:", err);
    return null;
  }
}
