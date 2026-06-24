import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/5shared/lib/redis/redis";

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

  // Залогинен но не админ и пытается попасть на /admin → в профиль
  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Корень / → редирект по статусу сессии
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/profile" : "/register", req.url)
    );
  }

  if (pathname === "/banned" && token) {
    return NextResponse.next();
  }
  
  const banned = await redis.get(`blacklist:${token?.userId}`);
  if (banned) {
    return NextResponse.redirect("/banned");
  }



  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/entrance", "/register", "/profile/:path*", "/admin/:path*" , "/banned"],
};
