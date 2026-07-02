import { useTranslations } from 'next-intl';
import { getUsers } from "@features/admin-users/users/actions/getUsers";
import { UserListClient } from "./UserListClient";

export async function UserList() {
  const t = useTranslations('UserList');
  const result = await getUsers();

  if (result.status === "error") {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
        {result.message}
      </div>
    );
  }

  if (!result.data || result.data.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-gray-600">
        {t('emptyState')}
      </div>
    );
  }

  return <UserListClient users={result.data} />;
}
