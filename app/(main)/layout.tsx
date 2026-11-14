import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b-2 border-ink px-6 py-3">
        <Link href="/chat" className="x text-lg">
          AI Expert Chat<span className="acc">.</span>
        </Link>
        <div className="flex items-center gap-4">
          {user.role === 'ADMIN' && (
            <Link href="/admin" className="mono text-gray hover:text-ink">
              Administración
            </Link>
          )}
          <span className="mono text-gray">{user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
