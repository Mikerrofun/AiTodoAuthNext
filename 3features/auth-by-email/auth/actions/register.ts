"use server";

import { RegisterFormData } from '@features/auth-by-email/auth/register/Register.type';
import { ActionResult } from "@/5shared/lib/types/action-result";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export async function registerUser(data: RegisterFormData): Promise<ActionResult> {
  try {
    const hashed = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        login: data.login,
        password: hashed,
      },
    });

    return { status: "success" };

  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { status: "error", message: "Этот логин уже занят" };
    }

    return { status: "error", message: "Что-то пошло не так" };
  }
}
