import { describe, expect, test } from "vitest";
import { MIN_FILL_TIME_MS, checkSpam } from "../spam-guard";

const NOW = 1_700_000_000_000;

describe("checkSpam", () => {
  test("temiz gönderim spam değildir", () => {
    expect(checkSpam({ honeypot: "", startedAt: NOW - 20_000 }, NOW)).toEqual({ spam: false });
  });

  test("dolu honeypot → spam", () => {
    expect(checkSpam({ honeypot: "http://spam.example", startedAt: NOW - 20_000 }, NOW)).toEqual({
      spam: true,
      reason: "honeypot",
    });
  });

  test("yalnızca boşluk içeren honeypot temizdir", () => {
    expect(checkSpam({ honeypot: "   ", startedAt: NOW - 20_000 }, NOW).spam).toBe(false);
  });

  test("3 saniyeden hızlı gönderim → spam", () => {
    expect(checkSpam({ honeypot: "", startedAt: NOW - (MIN_FILL_TIME_MS - 1) }, NOW)).toEqual({
      spam: true,
      reason: "too-fast",
    });
    expect(checkSpam({ honeypot: "", startedAt: NOW - MIN_FILL_TIME_MS }, NOW).spam).toBe(false);
  });

  test("startedAt yok veya bozuksa süre kontrolü atlanır", () => {
    expect(checkSpam({ honeypot: "", startedAt: undefined }, NOW).spam).toBe(false);
    expect(checkSpam({ honeypot: "", startedAt: "abc" }, NOW).spam).toBe(false);
    expect(checkSpam({ honeypot: "", startedAt: 0 }, NOW).spam).toBe(false);
  });

  test("gelecekten gelen damga (saat kayması) insanı cezalandırmaz", () => {
    expect(checkSpam({ honeypot: "", startedAt: NOW + 5_000 }, NOW).spam).toBe(false);
  });

  test("honeypot süre kontrolünden önce gelir", () => {
    expect(checkSpam({ honeypot: "x", startedAt: NOW - 100 }, NOW)).toEqual({ spam: true, reason: "honeypot" });
  });
});
