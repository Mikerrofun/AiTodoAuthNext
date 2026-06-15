"use client";

import { Heart, Trash2 } from "lucide-react";
import { TodoItem } from "@entities/todo";
import { useTodoCard } from "./TodoCard.hook";

type Props = {
  todo: TodoItem;
};

export function TodoCard({ todo }: Props) {
  const { optimisticCompleted, handleToggleCompleted, handleDelete } = useTodoCard(todo);

  return (
    <div className="flex items-start justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className={`font-medium text-gray-800 truncate ${
            optimisticCompleted ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.title}
        </span>
        {todo.description && (
          <span className="text-sm text-gray-400 truncate">{todo.description}</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleToggleCompleted}
          aria-label={optimisticCompleted ? "Отметить незавершённой" : "Отметить завершённой"}
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <Heart
            size={20}
            className={optimisticCompleted ? "fill-red-400 text-red-400" : ""}
          />
        </button>

        <button
          onClick={handleDelete}
          aria-label="Удалить задачу"
          className="text-gray-300 hover:text-red-400 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
