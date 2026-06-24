"use client";

import { Suspense } from "react";
import { SuspenseLoader } from "@/5shared/ui/SuspenseLoader";
import { ErrorBoundary } from "@/5shared/ui/ErrorBoundary";
import { UserTodoListProps } from "./UserTodoList.type";
import { useUserTodoList } from "./UserTodoList.hook";
import { TodoItem } from "./TodoItem";

function TodoListContent({ userId, userName }: UserTodoListProps) {
  const { todos, queryError, isDeletePending, isDeleteError, handleDelete } =
    useUserTodoList(userId);

  if (queryError) {
    return <div className="text-sm text-red-600">Ошибка: {queryError}</div>;
  }

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
      {isDeletePending && (
        <div className="text-xs text-blue-600">Удаление...</div>
      )}
      {isDeleteError && (
        <div className="text-xs text-red-600">Ошибка при удалении</div>
      )}
      <ul className="space-y-1.5">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

export function UserTodoList(props: UserTodoListProps) {
  return (
    <ErrorBoundary
      fallback={<div className="text-sm text-red-600">Ошибка загрузки задач</div>}
    >
      <Suspense fallback={<SuspenseLoader message="Загрузка задач..." size="sm" />}>
        <TodoListContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
