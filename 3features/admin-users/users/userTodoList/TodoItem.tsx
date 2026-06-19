import { memo } from "react";
import { TodoItemProps } from "./UserTodoList.type";

function TodoItemComponent({ todo }: TodoItemProps) {
  return (
    <li className="flex items-start gap-3 text-sm bg-white p-2 rounded border border-gray-200">
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
  );
}

export const TodoItem = memo(TodoItemComponent);
