import { redirect } from 'next/navigation';
import { defaultLocale } from '@/src/i18n/request';

export default function RootPage() {
  // Redirect to default locale
  // The middleware will handle further redirects based on auth status
  redirect(`/${defaultLocale}`);
}
