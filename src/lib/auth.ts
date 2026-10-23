import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "vouquet_admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "vouquet_session_secret_change_me_in_production_1234567890";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "adminpassword123";
}

// Timing safe comparison that never throws when buffer lengths differ
export function safeTimingCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// In-memory rate limiter with periodic cleanup
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip = "client"): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // Cleanup expired entries to prevent memory leak
  if (loginAttempts.size > 200) {
    loginAttempts.forEach((entry, key) => {
      if (now - entry.lastAttempt > windowMs) {
        loginAttempts.delete(key);
      }
    });
  }

  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.lastAttempt > windowMs) {
    loginAttempts.set(ip, { count: 0, lastAttempt: now });
    return { allowed: true, remaining: maxAttempts };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxAttempts - entry.count };
}

export function recordFailedAttempt(ip = "client") {
  const entry = loginAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  loginAttempts.set(ip, {
    count: entry.count + 1,
    lastAttempt: Date.now(),
  });
}

export function resetRateLimit(ip = "client") {
  loginAttempts.delete(ip);
}

// Sign a session payload with HMAC-SHA256
export function signSession(value: string): string {
  const secret = getSessionSecret();
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

// Verify a signed session value and enforce cryptographic expiry
export function verifySession(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [value, hmac] = parts;

  // Verify token prefix and timestamp
  if (!value.startsWith("admin_authorized_")) return false;
  const timestampStr = value.replace("admin_authorized_", "");
  const timestamp = parseInt(timestampStr, 10);
  if (Number.isNaN(timestamp)) return false;

  // Enforce session maximum age
  const now = Date.now();
  if (now - timestamp > SESSION_MAX_AGE_MS || timestamp > now + 60000) {
    return false;
  }

  const secret = getSessionSecret();
  const expectedHmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return safeTimingCompare(hmac, expectedHmac);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return false;
  return verifySession(sessionToken);
}

export async function setAdminSession() {
  const cookieStore = cookies();
  const token = signSession("admin_authorized_" + Date.now());
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function verifyAdminPassword(password: string): boolean {
  const adminPass = getAdminPassword();
  if (!password || !adminPass) return false;
  return safeTimingCompare(password, adminPass);
}

// Generate a high-entropy HMAC access token for customer order URLs
export function generateOrderAccessToken(orderCode: string, orderId: string): string {
  const secret = getSessionSecret();
  return crypto
    .createHmac("sha256", secret)
    .update(`order_access_${orderCode}_${orderId}`)
    .digest("hex")
    .slice(0, 32);
}

// Verify customer order access token
export function verifyOrderAccessToken(
  orderCode: string,
  orderId: string,
  token?: string | null
): boolean {
  if (!token || typeof token !== "string") return false;
  const expected = generateOrderAccessToken(orderCode, orderId);
  return safeTimingCompare(token, expected);
}
