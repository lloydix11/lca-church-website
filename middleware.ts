import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev-secret-key-change-in-prod";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect admin routes except the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const sessionCookie = request.cookies.get("admin_session")?.value;

    // No session - redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Verify session integrity and timeout
    const [token, timestamp, signature] = sessionCookie.split(".");

    if (!token || !timestamp || !signature) {
      // Invalid session format
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("admin_session");
      return response;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(token + timestamp)
      .digest("hex");

    if (signature !== expectedSignature) {
      // Invalid session signature
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("admin_session");
      return response;
    }

    // Check session timeout (30 minutes)
    const sessionAge = Date.now() - parseInt(timestamp);
    if (sessionAge > SESSION_TIMEOUT) {
      // Session expired
      const response = NextResponse.redirect(
        new URL("/admin?expired=true", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
