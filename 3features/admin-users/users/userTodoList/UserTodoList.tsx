"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserTodos } from "@features/admin-users/users/actions/getUserTodos";
import { UserTodoListProps } from "./UserTodoList.type";
import { TodoItem } from "./TodoItem";
import { SuspenseLoader } from "@/5shared/ui/SuspenseLoader";

function TodoListContent({ userId, userName }: UserTodoListProps) {
  const { data: result, error } = useQuery({
    queryKey: ["todos", userId],
    queryFn: () => getUserTodos(userId),
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Ошибка загрузки задач: {error.message}
      </div>
    );
  }

  if (result?.status === "error") {
    return (
      <div className="text-sm text-red-600">Ошибка: {result.message}</div>
    );
  }

  const todos = result?.data ?? [];

  if (todos.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        У пользователя {userName} пока нет задач
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">
        Задачи пользователя {userName} ({todos.length})
      </div>
      <ul className="space-y-1.5">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export function UserTodoList(props: UserTodoListProps) {
  return (
    <Suspense fallback={<SuspenseLoader message="Загрузка задач..." size="sm" />}>
      <TodoListContent {...props} />
    </Suspense>
  );
}
