import { getServerSession } from "next-auth";
import { authOptions } from "@/5shared/lib/auth/authOptions";
import Link from "next/link";

type AdminLinkProps = {
  isAdminPage: boolean;
};

export async function AdminLink({ isAdminPage }: AdminLinkProps) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") return null;

  if (isAdminPage) {
    return (
      <Link
        href="/profile"
        title="Вернуться в профиль"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        ←
      </Link>
    );
  }

  return (
    <Link
      href="/admin"
      title="Панель администратора"
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      ⚙️
    </Link>
  );
}
