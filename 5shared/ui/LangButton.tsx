'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/5shared/navigation';
import { locales } from '@/src/i18n/request';

export function LangButton() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageSwitch = () => {
    const currentIndex = locales.indexOf(currentLocale as any);
    const nextLocale = locales[(currentIndex + 1) % locales.length];

    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={handleLanguageSwitch}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      aria-label="Switch language"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span className="uppercase font-semibold">
        {currentLocale === 'ru' ? 'EN' : 'RU'}
      </span>
    </button>
  );
}
