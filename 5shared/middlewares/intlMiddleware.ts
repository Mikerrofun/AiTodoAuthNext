import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/src/i18n/request';

export const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const intlConfig = {
  // Match all pathnames except for:
  // - API routes
  // - _next (internal Next.js files)
  // - Static files (images, favicon, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
