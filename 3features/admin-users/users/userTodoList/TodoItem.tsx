import { memo } from "react";
import { TodoItemProps } from "./UserTodoList.type";

function TodoItemComponent({ todo, onDelete }: TodoItemProps) {
  const isDeleted = todo.deletedAt !== null;

  return (
    <li
      className={`flex items-start gap-3 text-sm bg-white p-2 rounded border border-gray-200 relative ${
        isDeleted ? "opacity-50" : ""
      }`}
    >
      <div className={isDeleted ? "pointer-events-none flex-1 flex items-start gap-3" : "flex-1 flex items-start gap-3"}>
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
          {isDeleted && (
            <div className="text-xs text-red-500 font-semibold mt-1">
              Удалено
            </div>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(todo.id)}
          disabled={isDeleted}
          className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isDeleted ? "Уже удалено" : "Удалить задачу"}
        >
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </li>
  );
}

export const TodoItem = memo(TodoItemComponent);
