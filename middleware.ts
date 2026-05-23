import createMiddleware from "next-intl/middleware";
import { routing } from "./app/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes (except login page itself)
  const isDashboard = /^\/(en|ar)\/dashboard/.test(pathname);
  const isLoginPage = /^\/(en|ar)\/dashboard\/login$/.test(pathname);

  if (isDashboard && !isLoginPage) {
    // Check for NextAuth session cookie
    const sessionToken =
      request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token");

    if (!sessionToken) {
      const locale = pathname.startsWith("/ar") ? "ar" : "en";
      return NextResponse.redirect(new URL(`/${locale}/dashboard/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
