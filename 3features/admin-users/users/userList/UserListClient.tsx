"use client";

import { useState, useCallback } from "react";
import { UserListClientProps } from "./UserListClient.type";
import { UserRow } from "./UserRow";

const MAX_EXPANDED = 3;

export function UserListClient({ users }: UserListClientProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const handleToggle = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_EXPANDED) {
          const firstId = Array.from(next)[0];
          next.delete(firstId);
        }
        next.add(id);
      }

      return next;
    });
  }, []);

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
            <UserRow
              key={user.id}
              user={user}
              isExpanded={expandedIds.has(user.id)}
              onToggle={handleToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
