"use client";

import { useState } from "react";
import { getUsers, UserItem } from "@features/admin-users/users/actions/getUsers";

export function UserList() {
  const [users, setUsers] = useState<UserItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoad() {
    setLoading(true);
    setError(null);
    const result = await getUsers();
    setLoading(false);

    if (result.status === "error") {
      setError(result.message);
      return;
    }

    setUsers(result.data);
  }

  return (
    <div>
      <button
        onClick={handleLoad}
        disabled={loading}
        className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? "Загрузка..." : "Загрузить пользователей"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}

      {users && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Логин</th>
                <th className="py-2 pr-4 font-medium">Роль</th>
                <th className="py-2 font-medium">Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 text-gray-700">
                  <td className="py-2 pr-4">{user.id}</td>
                  <td className="py-2 pr-4">{user.login}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "text-xs font-semibold text-purple-600"
                          : "text-xs text-gray-500"
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
