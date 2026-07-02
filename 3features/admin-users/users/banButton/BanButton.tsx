"use client";

import { useTranslations } from 'next-intl';
import { useBanButton } from "./BanButton.hook";
import { BanButtonProps } from "./BanButton.type";

export function BanButton({ userId, bannedAt }: BanButtonProps) {
  const t = useTranslations('BanButton');
  const { isBanned, handleClick } = useBanButton(userId, bannedAt);

  // Fixed width so the longer "unBan User" label never widens the row.
  // Rounded corners + smooth color transition on state change.
  // The glow color tracks the current background color.
  const glowColor = isBanned ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)";
  const bgClasses = isBanned
    ? "bg-green-500 hover:bg-green-600"
    : "bg-red-500 hover:bg-red-600";

  return (
    <button
      onClick={handleClick}
      style={{ ["--glow-color" as string]: glowColor }}
      className={`ban-glow ${bgClasses} w-24 transition-colors duration-500 px-3 py-1 text-xs font-medium text-white rounded-full`}
    >
      {isBanned ? t('unban') : t('ban')}
    </button>
  );
}
