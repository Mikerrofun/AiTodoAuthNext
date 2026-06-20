import { Suspense } from "react";
import { UserList } from "@features/admin-users/users/userList/UserList";
import { AdminLink } from "@features/admin-users/users/adminLink/AdminLink";
import { SuspenseLoader } from "@/5shared/ui/SuspenseLoader";

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
            <SuspenseLoader message="Загрузка пользователей..." className="mt-4" />
          }
        >
          <UserList />
        </Suspense>
      </div>
    </main>
  );
}
