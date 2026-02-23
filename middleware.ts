import { NextRequest, NextResponse } from "next/server";

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

    // Parse session cookie
    const [token, timestamp, signature] = sessionCookie.split(".");

    if (!token || !timestamp || !signature) {
      // Invalid session format - redirect to login
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Check session timeout (30 minutes)
    const sessionAge = Date.now() - parseInt(timestamp);
    if (sessionAge > SESSION_TIMEOUT) {
      // Session expired - redirect with expired flag
      return NextResponse.redirect(new URL("/admin?expired=true", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
