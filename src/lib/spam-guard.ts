// Form spam'i için iki ucuz sinyal — CAPTCHA'ya gerek bırakmadan botların
// büyük kısmını eler:
//   1. Honeypot: insanlara görünmeyen bir alan; botlar her alanı doldurur.
//   2. Süre: sayfa açıldıktan 3 sn'den kısa sürede gönderilen form insan değildir.
//
// Şüpheli gönderime hata DEĞİL "başarılı" yanıtı verilir (kayıt yazılmadan);
// bot hangi sinyalin yakaladığını öğrenemez.

/** Formlarda honeypot alanının adı — botların doldurmaya meyilli olduğu "website". */
export const HONEYPOT_FIELD = "website";
/** Formun açılışı ile gönderimi arasında beklenen en kısa süre (ms) */
export const MIN_FILL_TIME_MS = 3_000;

export interface SpamSignals {
  /** Honeypot alanının değeri — dolu ise bot */
  honeypot: unknown;
  /** Formun istemcide açıldığı an (epoch ms); yoksa süre kontrolü atlanır */
  startedAt: unknown;
}

export type SpamVerdict = { spam: false } | { spam: true; reason: "honeypot" | "too-fast" };

export function checkSpam(signals: SpamSignals, now: number = Date.now()): SpamVerdict {
  if (typeof signals.honeypot === "string" && signals.honeypot.trim() !== "") {
    return { spam: true, reason: "honeypot" };
  }

  const startedAt = Number(signals.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = now - startedAt;
    // Negatif (gelecekten gelen) damga istemci saat kaymasıdır; insanı
    // cezalandırmamak için yalnızca "çok kısa" pozitif süreler bot sayılır.
    if (elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) {
      return { spam: true, reason: "too-fast" };
    }
  }

  return { spam: false };
}
