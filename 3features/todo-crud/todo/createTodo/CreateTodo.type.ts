import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Заголовок не может быть пустым"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
