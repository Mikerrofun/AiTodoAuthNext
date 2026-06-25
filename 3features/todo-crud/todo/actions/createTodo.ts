"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { TodoItem } from "@entities/todo";
import { CreateTodoFormData } from "@features/todo-crud/todo/createTodo/CreateTodo.type";
import { revalidatePath } from "next/cache";
import { redis } from "@/5shared/lib/redis/redis";
import { checkUserBan } from "@/5shared/lib/auth/checkBan";

export async function createTodo(data: CreateTodoFormData): Promise<ActionResult<TodoItem>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }

  if (await checkUserBan(session.user.id)) {
    return { status: "error", message: "Ваш аккаунт заблокирован" };
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() ?? null,
        completed: data.completed,
        userId: Number(session.user.id),
      },
    });

    revalidatePath("/profile");
    await redis.del(`user:todos:${session.user.id}`);
    return { status: "success", data: todo };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
