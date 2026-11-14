import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RoleSelect } from '@/components/admin/role-select';

function formatFecha(fecha: Date) {
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminUsuariosPage() {
  const admin = await requireAdmin();

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="card-ink overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="mono border-b-2 border-ink text-gray">
          <tr>
            <th className="px-4 py-3 font-normal">Nombre</th>
            <th className="px-4 py-3 font-normal">Correo</th>
            <th className="px-4 py-3 font-normal">Creado</th>
            <th className="px-4 py-3 text-right font-normal">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-line">
              <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
              <td className="px-4 py-3 text-gray">{user.email}</td>
              <td className="mono px-4 py-3 text-gray">{formatFecha(user.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <RoleSelect
                  userId={user.id}
                  rolActual={user.role}
                  esUsuarioActual={user.id === admin.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
