import { Suspense } from "react";
import { TodoList } from "@features/todo-crud/todo/todoList/TodoList";
import { CreateTodoDialog } from "@features/todo-crud/todo/createTodo/CreateTodoDialog";
import { AdminLink } from "@features/admin-users/users/adminLink/AdminLink";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AdminLink isAdminPage={false} />
            <h1 className="text-2xl font-semibold text-gray-800">Мои задачи</h1>
          </div>
          <CreateTodoDialog />
        </div>

        <Suspense fallback={<p className="text-sm text-gray-400">Загрузка...</p>}>
          <TodoList />
        </Suspense>
      </div>
    </main>
  );
}
