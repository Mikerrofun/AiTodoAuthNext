"use server";

import { RegisterFormData } from '@features/auth-by-email/auth/register/Register.type';
import { ActionResult } from "@/5shared/lib/types/action-result";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { redis } from "@/5shared/lib/redis/redis";
import { checkTokenBucket, getClientIp, RATE_LIMITS } from "@/5shared/lib/rateLimit";

export async function registerUser(data: RegisterFormData): Promise<ActionResult> {
  try {
    const ip = await getClientIp();
    if (ip === "unknown" && process.env.NODE_ENV === "production") {
      return {
        status: "error",
        message: "Невозможно определить IP адрес. Попробуйте позже."
      };
    }

    const key = `ratelimit:register:${ip}:${data.login}`;
    const isAllowed = await checkTokenBucket(key, RATE_LIMITS.REGISTER);

    if (!isAllowed) {
      return {
        status: "error",
        message: "Слишком много попыток регистрации. Попробуйте позже."
      };
    }

    const hashed = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        login: data.login,
        password: hashed,
      },
    });

    await redis.del("admin:users");

    return { status: "success" };

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { status: "error", message: "Этот логин уже занят" };
    }

    return { status: "error", message: "Что-то пошло не так" };
  }
}
