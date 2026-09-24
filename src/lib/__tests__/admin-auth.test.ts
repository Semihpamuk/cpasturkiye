import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createHmac } from "crypto";
import { createSessionToken, getAdminPassword, verifySessionToken } from "../admin-auth";

/**
 * Admin oturumu HMAC imzalı bir çerezle taşınıyor; burada kırılacak bir şey
 * doğrudan yetkisiz panel erişimi demek. Testler saldırgan bakışıyla yazıldı:
 * imzayı kurcalamak, süreyi uzatmak, imzayı komple atmak.
 */

const SECRET = "test-secret-0123456789";

function signWith(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

beforeEach(() => {
  vi.stubEnv("ADMIN_SECRET", SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createSessionToken / verifySessionToken", () => {
  test("ürettiği jetonu kabul eder", () => {
    // Arrange & Act
    const token = createSessionToken();

    // Assert
    expect(verifySessionToken(token)).toBe(true);
  });

  test("jeton üç parçalı ve imzalı", () => {
    // Act
    const parts = createSessionToken().split(".");

    // Assert
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("admin");
    expect(Number(parts[1])).toBeGreaterThan(Date.now());
    expect(parts[2]).toMatch(/^[a-f0-9]{64}$/);
  });

  test("jeton yoksa reddeder", () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
  });

  test("parça sayısı yanlışsa reddeder", () => {
    expect(verifySessionToken("admin")).toBe(false);
    expect(verifySessionToken("admin.123")).toBe(false);
    expect(verifySessionToken("admin.123.sig.fazladan")).toBe(false);
  });

  test("imza kurcalanmışsa reddeder", () => {
    // Arrange
    const [role, expires, signature] = createSessionToken().split(".");
    const flipped = signature[0] === "a" ? "b" : "a";
    const tampered = `${role}.${expires}.${flipped}${signature.slice(1)}`;

    // Act & Assert
    expect(verifySessionToken(tampered)).toBe(false);
  });

  test("süre uzatılırsa imza tutmaz ve reddedilir", () => {
    // Arrange — saldırgan çerezdeki bitiş zamanını 10 yıl ileri alıyor.
    const [role, , signature] = createSessionToken().split(".");
    const farFuture = Date.now() + 10 * 365 * 24 * 60 * 60 * 1000;

    // Act & Assert
    expect(verifySessionToken(`${role}.${farFuture}.${signature}`)).toBe(false);
  });

  test("imzası doğru ama süresi dolmuş jetonu reddeder", () => {
    // Arrange — geçerli imza, geçmiş tarih.
    const expired = `admin.${Date.now() - 1000}`;
    const token = `${expired}.${signWith(expired, SECRET)}`;

    // Act & Assert
    expect(verifySessionToken(token)).toBe(false);
  });

  test("başka bir sırla imzalanmış jetonu reddeder", () => {
    // Arrange — sızmış eski sır ya da başka kurulumun jetonu.
    const payload = `admin.${Date.now() + 60_000}`;
    const token = `${payload}.${signWith(payload, "baska-sir")}`;

    // Act & Assert
    expect(verifySessionToken(token)).toBe(false);
  });

  test("imza yerine boş dize konulursa reddeder", () => {
    const payload = `admin.${Date.now() + 60_000}`;
    expect(verifySessionToken(`${payload}.`)).toBe(false);
  });

  test("bitiş zamanı sayı değilse reddeder", () => {
    // Arrange — imza doğru olsa bile NaN karşılaştırması geçememeli.
    const payload = "admin.sonsuza-kadar";
    const token = `${payload}.${signWith(payload, SECRET)}`;

    // Act & Assert
    expect(verifySessionToken(token)).toBe(false);
  });

  test("sır değişince eski jetonlar geçersizleşir", () => {
    // Arrange
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);

    // Act — ADMIN_SECRET döndürüldü.
    vi.stubEnv("ADMIN_SECRET", "yeni-sir-9876543210");

    // Assert
    expect(verifySessionToken(token)).toBe(false);
  });

  test("rol alanı imzaya dahil — değiştirilirse jeton düşer", () => {
    // Arrange
    const [, expires, signature] = createSessionToken().split(".");

    // Act & Assert
    expect(verifySessionToken(`superadmin.${expires}.${signature}`)).toBe(false);
  });
});

describe("getAdminPassword", () => {
  test("ortam değişkenindeki parolayı döndürür", () => {
    // Arrange
    vi.stubEnv("ADMIN_PASSWORD", "guclu-parola");

    // Act & Assert
    expect(getAdminPassword()).toBe("guclu-parola");
  });
});
