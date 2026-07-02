"use client";

import { Suspense } from "react";
import { useTranslations } from 'next-intl';
import { SuspenseLoader } from "@/5shared/ui/SuspenseLoader";
import { ErrorBoundary } from "@/5shared/ui/ErrorBoundary";
import { UserTodoListProps } from "./UserTodoList.type";
import { useUserTodoList } from "./UserTodoList.hook";
import { TodoItem } from "./TodoItem";

function TodoListContent({ userId, userName }: UserTodoListProps) {
  const t = useTranslations('UserTodoList');
  const { todos, queryError, isDeletePending, isDeleteError, handleDelete } =
    useUserTodoList(userId);

  if (queryError) {
    return <div className="text-sm text-red-600">{t('errorQuery', { error: queryError })}</div>;
  }

  if (todos.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        {t('emptyState', { userName })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {t('tasksCount', { userName, count: todos.length })}
      </div>
      {isDeletePending && (
        <div className="text-xs text-blue-600">{t('deleting')}</div>
      )}
      {isDeleteError && (
        <div className="text-xs text-red-600">{t('deleteError')}</div>
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
  const t = useTranslations('UserTodoList');

  return (
    <ErrorBoundary
      fallback={<div className="text-sm text-red-600">{t('errorBoundary')}</div>}
    >
      <Suspense fallback={<SuspenseLoader message={t('loading')} size="sm" />}>
        <TodoListContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
