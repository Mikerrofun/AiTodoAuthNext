import { UserItem } from "@features/admin-users/users/actions/getUsers";

export type UserListClientProps = {
  users: UserItem[];
};

export type UserRowProps = {
  user: UserItem;
  isExpanded: boolean;
  onToggle: (id: number) => void;
};
