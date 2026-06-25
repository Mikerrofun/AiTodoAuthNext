"use server";

import { redis } from "@/5shared/lib/redis/redis";

/**
 * Проверяет, забанен ли пользователь по userId
 * Используется в server actions для защиты от прямых вызовов API
 * 
 * @param userId - ID пользователя
 * @returns true если забанен, false если нет
 */
export async function checkUserBan(userId: string): Promise<boolean> {
  try {
    const banned = await redis.get(`blacklist:${userId}`);
    return !!banned;
  } catch (error) {
    console.error("Redis error in checkUserBan:", error);
    return false;
  }
}
