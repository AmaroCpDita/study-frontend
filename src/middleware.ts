import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If user is on dashboard and has no session, redirect to login
  if (isDashboardPage && !session) {
    const loginUrl = new URL("/login", request.url);
    // You can optionally add a redirect parameter to return here after login
    // loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is on an auth page and has a session, redirect to dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config to match only relevant paths
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
