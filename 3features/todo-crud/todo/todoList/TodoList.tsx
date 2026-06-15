import { getTodos } from "@features/todo-crud/todo/actions/getTodos";
import { TodoCard } from "@features/todo-crud/todo/todoCard/TodoCard";

export async function TodoList() {
  const result = await getTodos();

  if (result.status === "error") {
    return <p className="text-sm text-red-500">{result.message}</p>;
  }

  const todos = result.data;

  if (todos.length === 0) {
    return <p className="text-sm text-gray-400">Задач пока нет</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
