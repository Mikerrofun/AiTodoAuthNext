"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { Todo } from "@prisma/client";
import { UpdateTodoFormData } from "@features/todo-crud/todo/updateTodo/UpdateTodo.type";

export async function updateTodo(id: number, data: UpdateTodoFormData): Promise<ActionResult<Todo>> {
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
        ...(data.completed !== undefined && { completed: data.completed }),
      },
    });

    return { status: "success", data: todo };
  } catch {
    return { status: "error", message: "Задача не найдена или нет доступа" };
  }
}
