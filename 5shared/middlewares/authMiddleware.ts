import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Extract locale from pathname (e.g., /ru/profile -> 'ru')
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'ru';

  const createUrl = (path: string) => {
    if (path.startsWith(`/${locale}/`)) {
      return new URL(path, req.url);
    }
    return new URL(`/${locale}${path}`, req.url);
  };

  // e.g., /ru/profile -> /profile
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';

  if (token && (pathWithoutLocale.startsWith("/entrance") || pathWithoutLocale.startsWith("/register"))) {
    return NextResponse.redirect(createUrl("/profile"));
  }


  if (!token && pathWithoutLocale.startsWith("/profile")) {
    return NextResponse.redirect(createUrl("/register"));
  }

  // Admin-only pages
  if (pathWithoutLocale.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(createUrl("/register"));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(createUrl("/profile"));
    }
  }

  // Root redirect
  if (pathWithoutLocale === "/" || pathname === `/${locale}` || pathname === `/${locale}/`) {
    return NextResponse.redirect(
      createUrl(token ? "/profile" : "/register")
    );
  }

  return null; // Allow request to proceed
}

export const authConfig = {
  matcher: [
    "/",
    "/:locale",
    "/:locale/",
    "/:locale/entrance",
    "/:locale/register",
    "/:locale/profile/:path*",
    "/:locale/admin/:path*",
  ],
};
