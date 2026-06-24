"use client";

import { useBanButton } from "./BanButton.hook";
import { BanButtonProps } from "./BanButton.type";

export function BanButton({ userId, bannedAt }: BanButtonProps) {
  const { isBanned, handleClick } = useBanButton(userId, bannedAt);

  return (
    <button
      onClick={handleClick}
      className={
        isBanned
          ? "px-3 py-1 text-xs rounded bg-gray-200 text-gray-600"
          : "px-3 py-1 text-xs rounded bg-red-500 text-white animate-pulse"
      }
    >
      {isBanned ? "Banned" : "Ban"}
    </button>
  );
}
