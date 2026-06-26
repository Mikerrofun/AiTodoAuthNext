import { useState } from "react";
import { banUser } from "@features/admin-users/users/actions/banUser";
import { unbanUser } from "@features/admin-users/users/actions/unbanUser";

export function useBanButton(userId: number, initialBannedAt: Date | null) {
  const [isBanned, setIsBanned] = useState(!!initialBannedAt);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();

    const prev = isBanned;
    setIsBanned(!prev);

    const result = prev ? await unbanUser(userId) : await banUser(userId, 0);

    if (result.status === "error") {
      setIsBanned(prev);
    }
  }

  return { isBanned, handleClick };
}
