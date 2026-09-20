import { beforeEach, describe, expect, test } from "vitest";
import { _clearAllRateLimits, clientIp, consumeRateLimit, rateLimitHeaders, resetRateLimit } from "../rate-limit";

const RULE = { limit: 3, windowMs: 60_000 };
const T0 = 1_700_000_000_000;

beforeEach(() => _clearAllRateLimits());

describe("consumeRateLimit", () => {
  test("limit dolana kadar izin verir, sonra reddeder", () => {
    expect(consumeRateLimit("s", "ip", RULE, T0).ok).toBe(true);
    expect(consumeRateLimit("s", "ip", RULE, T0).ok).toBe(true);
    const last = consumeRateLimit("s", "ip", RULE, T0);
    expect(last.ok).toBe(true);
    expect(last.remaining).toBe(0);

    const denied = consumeRateLimit("s", "ip", RULE, T0 + 1_000);
    expect(denied.ok).toBe(false);
    expect(denied.retryAfterSec).toBe(59);
  });

  test("reddedilen istekler pencereyi uzatmaz", () => {
    for (let i = 0; i < 3; i++) consumeRateLimit("s", "ip", RULE, T0);
    consumeRateLimit("s", "ip", RULE, T0 + 30_000); // red
    // Pencere ilk istekten 60 sn sonra biter — reddedilen istek onu ötelememeli
    expect(consumeRateLimit("s", "ip", RULE, T0 + 60_000).ok).toBe(true);
  });

  test("pencere dolunca sayaç sıfırlanır", () => {
    for (let i = 0; i < 3; i++) consumeRateLimit("s", "ip", RULE, T0);
    expect(consumeRateLimit("s", "ip", RULE, T0 + 59_999).ok).toBe(false);
    expect(consumeRateLimit("s", "ip", RULE, T0 + 60_000).ok).toBe(true);
  });

  test("farklı scope ve IP'ler birbirinden bağımsızdır", () => {
    for (let i = 0; i < 3; i++) consumeRateLimit("leads", "1.1.1.1", RULE, T0);
    expect(consumeRateLimit("leads", "1.1.1.1", RULE, T0).ok).toBe(false);
    expect(consumeRateLimit("leads", "2.2.2.2", RULE, T0).ok).toBe(true);
    expect(consumeRateLimit("discount", "1.1.1.1", RULE, T0).ok).toBe(true);
  });

  test("resetRateLimit sayacı temizler", () => {
    for (let i = 0; i < 3; i++) consumeRateLimit("s", "ip", RULE, T0);
    resetRateLimit("s", "ip");
    expect(consumeRateLimit("s", "ip", RULE, T0).ok).toBe(true);
  });

  test("retryAfterSec en az 1 saniyedir", () => {
    for (let i = 0; i < 3; i++) consumeRateLimit("s", "ip", RULE, T0);
    expect(consumeRateLimit("s", "ip", RULE, T0 + 59_900).retryAfterSec).toBe(1);
  });
});

describe("clientIp", () => {
  test("x-forwarded-for'daki ilk adresi alır", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": " 5.6.7.8 , 10.0.0.1" } });
    expect(clientIp(req)).toBe("5.6.7.8");
  });

  test("başlık yoksa x-real-ip, o da yoksa 'local'", () => {
    expect(clientIp(new Request("http://x", { headers: { "x-real-ip": "9.9.9.9" } }))).toBe("9.9.9.9");
    expect(clientIp(new Request("http://x"))).toBe("local");
  });
});

test("rateLimitHeaders Retry-After üretir", () => {
  expect(rateLimitHeaders({ ok: false, retryAfterSec: 42, remaining: 0 })).toEqual({ "Retry-After": "42" });
});
