"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";
import { redis } from "@/5shared/lib/redis/redis";

const CACHE_TTL = 300;

export async function getTodos(): Promise<ActionResult<TodoItem[]>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }

  const cacheKey = `user:todos:${session.user.id}`;

  try {
    const cached = await redis.get<TodoItem[]>(cacheKey);
    if (cached) {
      return { status: "success", data: cached };
    }

    const todos = await prisma.todo.findMany({
      where: { userId: Number(session.user.id), deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(todos));

    return { status: "success", data: todos };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
