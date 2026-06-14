"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { Todo } from "@prisma/client";

export async function createTodo(title: string): Promise<ActionResult<Todo>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }

  if (!title.trim()) {
    return { status: "error", message: "Заголовок не может быть пустым" };
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId: Number(session.user.id),
      },
    });

    return { status: "success", data: todo };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
