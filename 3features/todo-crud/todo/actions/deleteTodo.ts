"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";

export async function deleteTodo(id: number): Promise<ActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }

  try {
    await prisma.todo.delete({
      where: {
        id,
        userId: Number(session.user.id),
      },
    });

    return { status: "success" };
  } catch {
    return { status: "error", message: "Задача не найдена или нет доступа" };
  }
}
