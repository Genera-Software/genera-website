import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin/session";
import {
  verifySessionToken as verifyCccSessionToken,
  CCC_COOKIE_NAME,
} from "@/lib/command-centre/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page itself and the auth endpoints
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/logout" ||
    pathname.startsWith("/admin/api/auth")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const ok = await verifySessionToken(token);
    if (!ok) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Content Command Centre: separate password from the CMS admin above,
  // since this one gets shared with Duncan for content planning.
  if (
    pathname === "/command-centre/login" ||
    pathname === "/command-centre/logout"
  ) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/command-centre") ||
    pathname.startsWith("/api/command-centre")
  ) {
    const token = request.cookies.get(CCC_COOKIE_NAME)?.value;
    const ok = await verifyCccSessionToken(token);
    if (!ok) {
      if (pathname.startsWith("/api/command-centre")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/command-centre/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/command-centre/:path*", "/api/command-centre/:path*"],
};
