import { z } from "zod";

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Заголовок не может быть пустым").optional(),
  description: z.string().optional(),
  completed: z.boolean(),
});

export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
