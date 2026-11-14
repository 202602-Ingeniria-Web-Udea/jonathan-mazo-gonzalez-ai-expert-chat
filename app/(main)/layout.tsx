import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/[.08] px-6 py-4 dark:border-white/[.145]">
        <Link href="/chat" className="font-semibold text-black dark:text-zinc-50">
          AI Expert Chat
        </Link>
        <div className="flex items-center gap-4">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Administración
            </Link>
          )}
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
