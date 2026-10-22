import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "vouquet_admin_session";

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "vouquet_session_secret_change_me_in_production_1234567890";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "adminpassword123";
}

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip = "client"): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

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

// Verify a signed session value
export function verifySession(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [value, hmac] = parts;
  const secret = getSessionSecret();
  const expectedHmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
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
  // Timing safe comparison to protect against timing attacks
  const a = Buffer.from(password);
  const b = Buffer.from(adminPass);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
