"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { redis } from "@/5shared/lib/redis/redis";

export async function adminSoftDeleteTodo(
  todoId: number,
  userId: number
): Promise<ActionResult<void>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId },
      select: { id: true },
    });

    if (!todo) {
      return { status: "error", message: "Задача не найдена или не принадлежит пользователю" };
    }

    await prisma.todo.update({
      where: { id: todoId },
      data: { deletedAt: new Date() },
    });

    await redis.del(`admin:todos:${userId}`);

    return { status: "success" };
  } catch {
    return { status: "error", message: "Не удалось удалить задачу" };
  }
}
