"use client";

import { memo } from "react";
import { UserRowProps } from "./UserListClient.type";
import { UserTodoList } from "@features/admin-users/users/userTodoList/UserTodoList";
import { BanButton } from "@features/admin-users/users/banButton/BanButton";

function UserRowComponent({ user, isExpanded, onToggle }: UserRowProps) {
  return (
    <>
      <tr
        onClick={() => onToggle(user.id)}
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
        <td className="py-2 pr-4 text-gray-400">
          {new Date(user.createdAt).toLocaleDateString("ru-RU")}
        </td>
        <td className="py-2">
          <BanButton userId={user.id} bannedAt={user.bannedAt} />
        </td>
      </tr>

      {isExpanded && (
        <tr key={`${user.id}-todos`}>
          <td colSpan={5} className="py-3 px-4 bg-gray-50">
            <UserTodoList userId={user.id} userName={user.login} />
          </td>
        </tr>
      )}
    </>
  );
}

export const UserRow = memo(UserRowComponent);
