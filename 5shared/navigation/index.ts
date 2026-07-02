import { createNavigation } from 'next-intl/navigation';
import { locales } from '@/src/i18n/request';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales });
