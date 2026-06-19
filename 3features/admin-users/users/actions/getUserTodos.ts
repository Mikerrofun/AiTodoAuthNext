"use server";

import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";

const getCachedUserTodos = unstable_cache(
  async (userId: number) => {
    return await prisma.todo.findMany({
      where: { userId },
    });
  },
  ["user-todos"],
  { revalidate: 300 }
);

export async function getUserTodos(userId: number): Promise<ActionResult<TodoItem[]>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
    const todos = await getCachedUserTodos(userId);
    return { status: "success", data: todos };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
