"use server";

import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { redis } from "@/5shared/lib/redis/redis";

export async function adminSoftDeleteTodo(
  todoId: number
): Promise<ActionResult<void>> {
  const t = await getTranslations('Errors');
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: t('unauthorized') };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: t('forbidden') };
  }

  try {
    // userId достаём из БД, а не из параметров клиента — иначе подмена userId
    // инвалидирует чужой кэш, оставив реальный кэш владельца несогласованным.
    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { deletedAt: new Date() },
      select: { userId: true },
    });

    await redis.del(`admin:todos:${updated.userId}`);

    return { status: "success" };
  } catch {
    return { status: "error", message: t('deleteFailed') };
  }
}
