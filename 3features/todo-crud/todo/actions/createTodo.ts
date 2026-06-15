"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { Todo } from "@prisma/client";
import { CreateTodoFormData } from "@features/todo-crud/todo/createTodo/CreateTodo.type";

export async function createTodo(data: CreateTodoFormData): Promise<ActionResult<Todo>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
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

    return { status: "success", data: todo };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
