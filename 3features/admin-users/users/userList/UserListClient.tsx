"use client";

import { useState } from "react";
import { UserItem } from "@features/admin-users/users/actions/getUsers";
import { UserTodoList } from "@features/admin-users/users/userTodoList/UserTodoList";

type Props = {
  users: UserItem[];
};

export function UserListClient({ users }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
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
            <>
              <tr
                key={user.id}
                onClick={() => toggleExpand(user.id)}
                className="border-b last:border-0 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
              >
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

              {expandedId === user.id && (
                <tr key={`${user.id}-todos`}>
                  <td colSpan={4} className="py-3 px-4 bg-gray-50">
                    <UserTodoList userId={user.id} userName={user.login} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
