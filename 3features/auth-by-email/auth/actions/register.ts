"use server";

import { RegisterFormData } from '@features/auth-by-email/auth/register/Register.type'
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";

export async function registerUser(data : RegisterFormData ) {
  const hashed = await bcrypt.hash(data.password, 10)

  await prisma.user.create({
    data: {
      login: data.login,
      password: hashed
    }
  })
}