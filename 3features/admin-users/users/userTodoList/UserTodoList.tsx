"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserTodos } from "@features/admin-users/users/actions/getUserTodos";
import { UserTodoListProps } from "./UserTodoList.type";

function LoadingFallback() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm">Загрузка задач...</span>
    </div>
  );
}

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
      <div className="text-sm text-red-600">
        Ошибка: {result.message}
      </div>
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
          <li
            key={todo.id}
            className="flex items-start gap-3 text-sm bg-white p-2 rounded border border-gray-200"
          >
            <span
              className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-sm border ${
                todo.completed
                  ? "bg-green-100 border-green-400"
                  : "bg-gray-50 border-gray-300"
              } flex items-center justify-center`}
            >
              {todo.completed && (
                <svg
                  className="w-3 h-3 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {todo.title}
              </div>
              {todo.description && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {todo.description}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Создано: {new Date(todo.createdAt).toLocaleDateString("ru-RU")}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserTodoList(props: UserTodoListProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TodoListContent {...props} />
    </Suspense>
  );
}
