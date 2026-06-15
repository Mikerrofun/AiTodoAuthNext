import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/entrance", "/register"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Не залогинен и пытается попасть на /profile → на вход
  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // Корень / → редирект по статусу сессии
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/profile" : "/register", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/entrance", "/register", "/profile/:path*"],
};
