import { SignOutButton } from "./SignOutButton";

export default function BannedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold text-gray-800">Вы забанены</h1>
      <p className="text-gray-500 text-sm">Ваш аккаунт заблокирован администратором.</p>
      <SignOutButton />
    </div>
  );
}
