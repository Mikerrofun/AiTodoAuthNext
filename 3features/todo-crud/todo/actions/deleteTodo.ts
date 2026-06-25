"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { revalidatePath } from "next/cache";
import { redis } from "@/5shared/lib/redis/redis";
import { checkUserBan } from "@/5shared/lib/auth/checkBan";

export async function deleteTodo(id: number): Promise<ActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { status: "error", message: "Не авторизован" };
  }
  if (await checkUserBan(session.user.id)) {
    return { status: "error", message: "Ваш аккаунт заблокирован" };
  }

  try {
    await prisma.todo.delete({
      where: {
        id,
        userId: Number(session.user.id),
      },
    });

    revalidatePath("/profile");
    await redis.del(`user:todos:${session.user.id}`);
    return { status: "success" };
  } catch {
    return { status: "error", message: "Задача не найдена или нет доступа" };
  }
}
