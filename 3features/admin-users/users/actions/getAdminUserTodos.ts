"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";
import { redis } from "@/5shared/lib/redis/redis";

const CACHE_TTL = 3600;

export async function getAdminUserTodos(userId: number): Promise<ActionResult<TodoItem[]>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  const cacheKey = `admin:todos:${userId}`;

  try {
    const cached = await redis.get<TodoItem[]>(cacheKey);
    if (cached) {
      return { status: "success", data: cached };
    }

    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    await prisma.todo.deleteMany({
      where: { deletedAt: { lte: fifteenDaysAgo } },
    });

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(todos));

    return { status: "success", data: todos };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
