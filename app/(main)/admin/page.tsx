import { prisma } from '@/lib/prisma';

export default async function AdminStatsPage() {
  const [totalUsuarios, totalAdmins, totalConversaciones, totalMensajes] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.conversacion.count(),
    prisma.mensaje.count(),
  ]);

  const tarjetas = [
    { titulo: 'Usuarios totales', valor: totalUsuarios },
    { titulo: 'Administradores', valor: totalAdmins },
    { titulo: 'Usuarios estándar', valor: totalUsuarios - totalAdmins },
    { titulo: 'Conversaciones', valor: totalConversaciones },
    { titulo: 'Mensajes enviados', valor: totalMensajes },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tarjetas.map((tarjeta) => (
        <div key={tarjeta.titulo} className="card-ink p-5">
          <span className="mono text-gray">{tarjeta.titulo}</span>
          <p className="x mt-2 text-4xl text-accent">{tarjeta.valor}</p>
        </div>
      ))}
    </div>
  );
}
