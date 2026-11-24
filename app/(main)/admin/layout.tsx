import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b-2 border-ink px-6 pt-6">
        <h1 className="x text-2xl">Administración</h1>
        <nav className="mono mt-4 flex gap-5 text-gray">
          <Link href="/admin" className="pb-3 hover:text-ink">
            Estadísticas
          </Link>
          <Link href="/admin/usuarios" className="pb-3 hover:text-ink">
            Usuarios
          </Link>
          <Link href="/admin/configuracion" className="pb-3 hover:text-ink">
            Configuración
          </Link>
        </nav>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
