"use server";

import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";

/**
 * Проверяет статус бана пользователя по логину (БЕЗ пароля)
 * Используется клиентом ПЕРЕД попыткой логина через NextAuth
 * 
 * @param login - Логин пользователя
 * @returns объект с полем banned (true/false)
 */
export async function checkLoginStatus(
  login: string
): Promise<ActionResult<{ banned: boolean }>> {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
      select: { bannedAt: true },
    });

    return {
      status: "success",
      data: { banned: !!user?.bannedAt },
    };
  } catch (error) {
    console.error("Error checking login status:", error);
    return {
      status: "error",
      message: "Ошибка проверки статуса",
    };
  }
}
