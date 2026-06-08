import { z } from "zod";
import {
  LOGIN_MAX_LENGTH,
  LOGIN_MAX_LENGTH_MESSAGE,
} from "@/5shared/lib/consts";

export const registerSchema = z
  .object({
    login: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    const login = data.login.trim();
    const password = data.password;

    if (login.length < 1 || password.length < 1) {
      if (login.length < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["login"],
          message: "Заполните все поля",
        });
      }
      if (password.length < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Заполните все поля",
        });
      }
      return;
    }

    if (login.length > LOGIN_MAX_LENGTH) {
      ctx.addIssue({
        code: "custom",
        path: ["login"],
        message: LOGIN_MAX_LENGTH_MESSAGE,
      });
    }

    if (password.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Пароль минимум 6 символов",
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
