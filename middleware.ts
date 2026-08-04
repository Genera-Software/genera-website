import { NextRequest, NextResponse } from "next/server";
import { readAdminSession, withAuthCookies } from "@/lib/admin/middleware-auth";
import {
  verifySessionToken as verifyCccSessionToken,
  CCC_COOKIE_NAME,
} from "@/lib/command-centre/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // The Supabase client still has to run on the login/logout routes so token
    // refresh and sign-out cookie writes land on the response.
    const { allowed, mustChangePassword, response } =
      await readAdminSession(request);
    const isAuthRoute =
      pathname === "/admin/login" || pathname === "/admin/logout";

    if (isAuthRoute) return response;

    if (!allowed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return withAuthCookies(NextResponse.redirect(loginUrl), response);
    }

    // Someone still on the temporary password we emailed them can only reach
    // the page that lets them replace it.
    if (mustChangePassword && pathname !== "/admin/account") {
      return withAuthCookies(
        NextResponse.redirect(new URL("/admin/account", request.url)),
        response,
      );
    }

    return response;
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
