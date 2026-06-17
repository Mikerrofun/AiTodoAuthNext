"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";

export async function getUserTodos(userId: number): Promise<ActionResult<TodoItem[]>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId },
    });

    return { status: "success", data: todos };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
