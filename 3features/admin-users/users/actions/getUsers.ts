"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import { prisma } from "@/prisma/client";
import { ActionResult } from "@/5shared/lib/types/action-result";
import { redis } from "@/5shared/lib/redis/redis";

const CACHE_KEY = "admin:users";
const CACHE_TTL = 3600;

export type UserItem = {
  id: number;
  login: string;
  role: string;
  createdAt: Date;
};

export async function getUsers(): Promise<ActionResult<UserItem[]>> {
  const session = await getServerSession(authOptions);

  
  if (!session?.user) {
    return { status: "error", message: "Не авторизован" };
  }

  if (session.user?.role !== "ADMIN") {
    return { status: "error", message: "Недостаточно прав" };
  }

  try {
    const cached = await redis.get<UserItem[]>(CACHE_KEY);
    if (cached) {
      return { status: "success", data: cached };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
      },
    });

    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(users));

    return { status: "success", data: users };
  } catch {
    return { status: "error", message: "Что-то пошло не так" };
  }
}
