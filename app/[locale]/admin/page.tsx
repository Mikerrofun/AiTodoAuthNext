import { Suspense } from "react";
import { useTranslations } from 'next-intl';
import { UserList } from "@features/admin-users/users/userList/UserList";
import { AdminLink } from "@features/admin-users/users/adminLink/AdminLink";
import { SuspenseLoader } from "@/5shared/ui/SuspenseLoader";
import { LangButton } from "@/5shared/ui/LangButton";

export default function AdminPage() {
  const t = useTranslations('AdminPage');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <AdminLink isAdminPage={true} />
            <h1 className="text-2xl font-semibold text-gray-800">{t('title')}</h1>
          </div>
          <LangButton />
        </div>
        <p className="text-sm text-gray-400 mb-8">{t('description')}</p>

        <Suspense
          fallback={
            <SuspenseLoader message={t('loading')} className="mt-4" />
          }
        >
          <UserList />
        </Suspense>
      </div>
    </main>
  );
}
