"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";

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
    // Проверяем что задача принадлежит указанному пользователю (для консистентности)
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
    
    revalidateTag(`user-todos-${userId}`, "max");
    
    return { status: "success" };
  } catch {
    return { status: "error", message: "Не удалось удалить задачу" };
  }
}
