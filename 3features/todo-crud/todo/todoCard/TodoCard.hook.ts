"use client";

import { useOptimistic, useTransition } from "react";
import { updateTodo } from "@features/todo-crud/todo/actions/updateTodo";
import { deleteTodo } from "@features/todo-crud/todo/actions/deleteTodo";
import { TodoItem } from "@entities/todo";

export function useTodoCard(todo: TodoItem) {
  const [, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(todo.completed);

  function handleToggleCompleted() {
    startTransition(async () => {
      setOptimisticCompleted(!optimisticCompleted);
      await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description ?? undefined,
        completed: !todo.completed,
      });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  }

  return { optimisticCompleted, handleToggleCompleted, handleDelete };
}
