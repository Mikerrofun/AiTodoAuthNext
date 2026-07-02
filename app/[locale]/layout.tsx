import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/src/i18n/request';
import { QueryProvider } from "@/5shared/providers/QueryProvider";
import { SessionProviderWrapper } from "@/5shared/providers/SessionProviderWrapper";
import { Redirector } from "@/5shared/components/Redirector";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <SessionProviderWrapper>
          <NextIntlClientProvider messages={messages}>
            <QueryProvider>
              {children}
              <Redirector />
            </QueryProvider>
          </NextIntlClientProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
