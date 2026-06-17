import { Suspense } from "react";
import { UserList } from "@features/admin-users/users/userList/UserList";
import { AdminLink } from "@features/admin-users/users/adminLink/AdminLink";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-1">
          <AdminLink isAdminPage={true} />
          <h1 className="text-2xl font-semibold text-gray-800">Панель администратора</h1>
        </div>
        <p className="text-sm text-gray-400 mb-8">Управление пользователями и данными</p>

        <Suspense
          fallback={
            <div className="mt-4 flex items-center gap-2 text-gray-500">
              <svg
                className="animate-spin h-5 w-5"
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
              <span>Загрузка пользователей...</span>
            </div>
          }
        >
          <UserList />
        </Suspense>
      </div>
    </main>
  );
}
