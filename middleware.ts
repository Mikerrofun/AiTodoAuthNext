import { NextRequest, NextResponse } from "next/server";
import { intlMiddleware } from "@/5shared/middlewares/intlMiddleware";
import { authMiddleware } from "@/5shared/middlewares/authMiddleware";

export async function middleware(req: NextRequest) {
  // Step 1: Handle internationalization (locale detection, rewriting)
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a redirect (e.g., / -> /ru), return it immediately
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // Step 2: Run auth middleware with the processed request
  // Auth middleware will check the pathname that includes locale
  const authResponse = await authMiddleware(req);
  
  // If auth middleware returns a redirect (unauthorized, wrong role, etc.)
  if (authResponse && authResponse.status >= 300 && authResponse.status < 400) {
    return authResponse;
  }

  // Step 3: Return the intl response if it exists (contains locale headers/rewrites)
  // Otherwise return the auth response or just continue
  return intlResponse || authResponse || NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
