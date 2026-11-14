import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-2 border-ink px-4 py-3 sm:px-6">
        <Link href="/chat" className="x text-base sm:text-lg">
          AI Expert Chat<span className="acc">.</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {user.role === 'ADMIN' && (
            <Link href="/admin" className="mono text-gray hover:text-ink">
              Admin
            </Link>
          )}
          <span className="mono hidden text-gray sm:inline">{user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
