import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "jale_admin";
const SESSION_HOURS = 24;

const INSECURE_DEFAULTS = new Set(["dev-secret-change-in-production", "jale2026"]);

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET ?? "dev-secret-change-in-production";
  if (process.env.NODE_ENV === "production" && INSECURE_DEFAULTS.has(secret)) {
    console.error("[SECURITY] ADMIN_SECRET ortam değişkeni güçlü bir değerle ayarlanmalıdır.");
  }
  return secret;
}

export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD ?? "jale2026";
  if (process.env.NODE_ENV === "production" && INSECURE_DEFAULTS.has(password)) {
    console.error("[SECURITY] ADMIN_PASSWORD ortam değişkeni güçlü bir değerle ayarlanmalıdır.");
  }
  return password;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expires, signature] = parts;
  const payload = `${role}.${expires}`;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }
  } catch {
    return false;
  }
  return Number(expires) > Date.now();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;
