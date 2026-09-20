// Bellek içi, IP başına sabit pencereli hız sınırı.
//
// Tek replika Node sunucusu (Easypanel) için yeterli; birden çok replikaya
// geçilirse Redis benzeri paylaşımlı bir depoya taşınmalı. Amaç kaba kuvvet ve
// form spam'ini kesmek, hassas trafik şekillendirme değil.

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitRule {
  /** Pencere içinde izin verilen istek sayısı */
  limit: number;
  /** Pencere uzunluğu (ms) */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Reddedildiyse kaç saniye sonra tekrar denenebilir (Retry-After) */
  retryAfterSec: number;
  remaining: number;
}

const MINUTE = 60_000;

export const RATE_LIMITS = {
  /** Admin şifre denemesi */
  adminLogin: { limit: 5, windowMs: MINUTE },
  /** İndirim kodu tahmini */
  discountValidate: { limit: 10, windowMs: MINUTE },
  /** İletişim formu — gerçek ziyaretçi 1-2 kez gönderir */
  leads: { limit: 5, windowMs: 10 * MINUTE },
  /** Kart ödemesi başlatma — her çağrı iyzico'ya gider + pending order yazar */
  paymentInitialize: { limit: 10, windowMs: 10 * MINUTE },
  /** Havale bildirimi — her çağrı 10 MB'a kadar dekont yazabilir */
  paymentTransfer: { limit: 5, windowMs: 10 * MINUTE },
} as const satisfies Record<string, RateLimitRule>;

// Süresi dolan kayıtlar her SWEEP_EVERY çağrıda bir süpürülür; böylece Map
// zamanla şişmez ama her istekte tüm tabloyu gezmek de gerekmez.
const SWEEP_EVERY = 500;

const buckets = new Map<string, Bucket>();
let callsSinceSweep = 0;

function sweep(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Proxy arkasındaki gerçek istemci IP'si. Traefik `x-forwarded-for` ekler;
 * ilk değer istemcidir. Başlık yoksa (yerel geliştirme) tek bir kova kullanılır.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip")?.trim() || "local";
}

/**
 * `scope` (ör. "leads") + `key` (ör. IP) için bir istek hakkı tüketir.
 * Reddedilen istekler sayacı ilerletmez; pencere ilk istekte başlar.
 */
export function consumeRateLimit(
  scope: string,
  key: string,
  rule: RateLimitRule,
  now: number = Date.now()
): RateLimitResult {
  if (++callsSinceSweep >= SWEEP_EVERY) {
    callsSinceSweep = 0;
    sweep(now);
  }

  const id = `${scope}:${key}`;
  const existing = buckets.get(id);
  const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + rule.windowMs };

  if (bucket.count >= rule.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    };
  }

  buckets.set(id, { count: bucket.count + 1, resetAt: bucket.resetAt });
  return { ok: true, retryAfterSec: 0, remaining: rule.limit - bucket.count - 1 };
}

/** Başarılı işlem sonrası sayacı sıfırlar (ör. doğru şifre, geçerli kod). */
export function resetRateLimit(scope: string, key: string): void {
  buckets.delete(`${scope}:${key}`);
}

/** Yalnızca testler için: tüm sayaçları temizler. */
export function _clearAllRateLimits(): void {
  buckets.clear();
  callsSinceSweep = 0;
}

/** 429 yanıtı için ortak başlıklar. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return { "Retry-After": String(result.retryAfterSec) };
}
