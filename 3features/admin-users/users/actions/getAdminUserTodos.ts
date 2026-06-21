"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";

export async function getAdminUserTodos(userId: number): Promise<ActionResult<TodoItem[]>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    await prisma.todo.deleteMany({
      where: { deletedAt: { lte: fifteenDaysAgo } },
    });

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return { status: "success", data: todos };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
