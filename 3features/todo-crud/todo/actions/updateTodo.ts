"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";
import { UpdateTodoFormData } from "@features/todo-crud/todo/updateTodo/UpdateTodo.type";
import { revalidatePath } from "next/cache";
import { redis } from "@/5shared/lib/redis/redis";

export async function updateTodo(id: number, data: UpdateTodoFormData): Promise<ActionResult<TodoItem>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }

  try {
    const todo = await prisma.todo.update({
      where: {
        id,
        userId: Number(session.user.id),
      },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() || null }),
        completed: data.completed,
      },
    });

    revalidatePath("/profile");
    await redis.del(`user:todos:${session.user.id}`);
    return { status: "success", data: todo };
  } catch {
    return { status: "error", message: "Задача не найдена или нет доступа" };
  }
}
