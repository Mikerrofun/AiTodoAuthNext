"use server";

import { prisma } from "@shared/lib/prisma";
import bcrypt from "bcrypt";

export async function registerUser(data: { login: string; password: string }) {
  const hashed = await bcrypt.hash(data.password, 10)

  await prisma.user.create({
    data: {
      login: data.login,
      password: hashed
    }
  })
}