"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, CreateTodoFormData } from "./CreateTodo.type";
import { createTodo } from "@features/todo-crud/todo/actions/createTodo";
import { useSessionStore } from "@/5shared/store/useSessionStore";

type Options = {
  onSuccess: () => void;
};

export function useCreateTodo({ onSuccess }: Options) {
  const [serverError, setServerError] = useState<string | null>(null);
  const setBanned = useSessionStore((s) => s.setBanned);

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
      setBanned(true);
    } else {
      setServerError(result.message);
    }
  });

  return { register, handleOnSubmit, errors, isSubmitting, serverError };
}
