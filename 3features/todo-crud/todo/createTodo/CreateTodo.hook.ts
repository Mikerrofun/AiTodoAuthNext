"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { createTodoSchema, CreateTodoFormData } from "./CreateTodo.type";
import { createTodo } from "@features/todo-crud/todo/actions/createTodo";

type Options = {
  onSuccess: () => void;
};

export function useCreateTodo({ onSuccess }: Options) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "", description: "", completed: false },
  });

  const handleOnSubmit = handleSubmit(async (data: CreateTodoFormData) => {
    setServerError(null);
    const result = await createTodo(data);
    if (result.status === "success") {
      reset();
      onSuccess();
    } else if (result.status === "banned") {
      await update(); // Перечитает сессию с сервера, Redirector увидит isBanned
    } else {
      setServerError(result.message);
    }
  });

  return { register, handleOnSubmit, errors, isSubmitting, serverError };
}
