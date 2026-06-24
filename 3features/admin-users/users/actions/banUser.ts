"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { redis } from "@/5shared/lib/redis/redis";

export async function banUser(
  userId: number
): Promise<ActionResult<void>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
const updated = await prisma.user.update({
  where: { 
    id: userId
  },
  data: {
    bannedAt: new Date() 
  },
  select: { id: true },
});


    await redis.set("blacklist:" + updated.id, "banned", { ex: 600 });
    await redis.del("admin:users");
    return { status: "success" };
  } catch {
    return { status: "error", message: "Не удалось забанить юзера" };
  }
}
