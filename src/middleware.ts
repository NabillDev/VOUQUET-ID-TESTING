import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "vouquet_admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    "vouquet_session_secret_change_me_in_production_1234567890"
  );
}

// Edge runtime compatible HMAC-SHA256 session verification
async function verifySessionEdge(
  token: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [value, hmacHex] = parts;

    if (!value.startsWith("admin_authorized_")) return false;
    const timestampStr = value.replace("admin_authorized_", "");
    const timestamp = parseInt(timestampStr, 10);
    if (Number.isNaN(timestamp)) return false;

    const now = Date.now();
    if (now - timestamp > SESSION_MAX_AGE_MS || timestamp > now + 60000) {
      return false;
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(value)
    );
    const computedHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (computedHex.length !== hmacHex.length) return false;
    let mismatch = 0;
    for (let i = 0; i < computedHex.length; i++) {
      mismatch |= computedHex.charCodeAt(i) ^ hmacHex.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSecret();

  // 1. Admin route protection
  if (pathname.startsWith("/admin")) {
    const isLoginRoute = pathname === "/admin/login";
    const isValidSession = sessionCookie
      ? await verifySessionEdge(sessionCookie, secret)
      : false;

    if (isLoginRoute && isValidSession) {
      // Already logged in: redirect to dashboard
      return NextResponse.redirect(new URL("/admin/orders", request.url));
    }

    if (!isLoginRoute && !isValidSession) {
      // Unauthenticated access to admin workspace: redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Global response with security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset directories: images, uploads
     */
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};