"use server";

import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { redis } from "@/5shared/lib/redis/redis";

export async function unbanUser(
  userId: number
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
const updated = await prisma.user.update({
  where: { 
    id: userId
  },
  data: {
    bannedAt: null 
  },
  select: { id: true },
});


    await redis.del("blacklist:" + updated.id) 
    await redis.del("admin:users")

    return { status: "success" };
  } catch {
    return { status: "error", message: t('unbanFailed') };
  }
}
