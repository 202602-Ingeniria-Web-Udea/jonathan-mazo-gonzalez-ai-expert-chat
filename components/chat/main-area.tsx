'use client';

import { usePathname } from 'next/navigation';

export function ChatMainArea({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enLista = pathname === '/chat';

  return (
    <div className={`flex-1 flex-col overflow-hidden ${enLista ? 'hidden sm:flex' : 'flex'}`}>
      {children}
    </div>
  );
}
