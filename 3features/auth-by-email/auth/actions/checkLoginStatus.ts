"use server";

import { prisma } from "@/prisma/client";
import { redis } from "@/5shared/lib/redis/redis";
import { ActionResult } from "@/5shared/lib/types/action-result";

/**
 * Проверяет статус бана пользователя по логину (БЕЗ пароля)
 * Используется клиентом ПЕРЕД попыткой логина через NextAuth
 * Источник истины — Redis (чтобы учитывать TTL временных банов)
 */
export async function checkLoginStatus(
  login: string
): Promise<ActionResult<{ banned: boolean }>> {
  try {
    const user = await prisma.user.findUnique({
      where: { login },
      select: { id: true },
    });

    if (!user) {
      return { status: "success", data: { banned: false } };
    }

    // Проверяем Redis — единственный источник истины для актуального статуса
    const banned = await redis.get(`blacklist:${user.id}`);

    return {
      status: "success",
      data: { banned: !!banned },
    };
  } catch (error) {
    console.error("Error checking login status:", error);
    return {
      status: "error",
      message: "Ошибка проверки статуса",
    };
  }
}
