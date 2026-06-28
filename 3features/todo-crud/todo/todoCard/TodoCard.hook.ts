"use client";

import { useOptimistic, useTransition } from "react";
import { useSession } from "next-auth/react";
import { updateTodo } from "@features/todo-crud/todo/actions/updateTodo";
import { deleteTodo } from "@features/todo-crud/todo/actions/deleteTodo";
import { TodoItem } from "@entities/todo";

export function useTodoCard(todo: TodoItem) {
  const [, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(todo.completed);
  const { update } = useSession();

  function handleToggleCompleted() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      const result = await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description ?? undefined,
        completed: !todo.completed,
      });
      if (result.status === "banned") {
        await update(); 
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTodo(todo.id);
      if (result.status === "banned") {
        await update(); 
      }
    });
  }

  return { optimisticCompleted, handleToggleCompleted, handleDelete };
}
