import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';


export const locales = ['ru', 'en'] as const;
export const defaultLocale = 'ru' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: {
      ...(await import(`../../messages/admin/${locale}.json`)).default,
      Errors: (await import(`../../messages/admin/errors/${locale}.json`)).default,
    },
  };
});
