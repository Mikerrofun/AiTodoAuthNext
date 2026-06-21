import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUserTodos } from "@features/admin-users/users/actions/getAdminUserTodos";
import { adminSoftDeleteTodo } from "@features/admin-users/users/actions/adminSoftDeleteTodo";

export function useUserTodoList(userId: number) {
  const queryClient = useQueryClient();

  const { data: result, error } = useQuery({
    queryKey: ["admin-todos", userId],
    queryFn: () => getAdminUserTodos(userId),
    staleTime: 0, // всегда свежие данные для админки
  });

  const deleteMutation = useMutation({
    mutationFn: ({ todoId, userId }: { todoId: number; userId: number }) =>
      adminSoftDeleteTodo(todoId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-todos", userId] });
    },
  });

  const handleDelete = useCallback(
    (todoId: number) => {
      if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
        deleteMutation.mutate({ todoId, userId });
      }
    },
    [deleteMutation, userId]
  );

  const todos = result?.status === "success" ? result.data : [];
  const queryError = error?.message ?? (result?.status === "error" ? result.message : null);

  return {
    todos,
    queryError,
    isDeletePending: deleteMutation.isPending,
    isDeleteError: deleteMutation.isError,
    handleDelete,
  };
}
