import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const session = req.cookies.get("admin_session");
  const isLoggedIn = !!session?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/admin"; // your login page

  // ── if trying to access admin pages without session → redirect to login
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ── if already logged in and visiting login page → redirect to home
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};