import { TodoItem as TodoItemType } from "@entities/todo";

export type UserTodoListProps = {
  userId: number;
  userName: string;
};

export type TodoItemProps = {
  todo: TodoItemType;
  onDelete?: (todoId: number) => void;
};
