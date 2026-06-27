import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (token && (pathname.startsWith("/entrance") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/profile" : "/register", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/entrance", "/register", "/profile/:path*", "/admin/:path*"],
};
