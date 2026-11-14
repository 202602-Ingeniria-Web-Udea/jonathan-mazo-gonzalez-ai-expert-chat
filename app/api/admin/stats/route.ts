import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const [totalUsuarios, totalAdmins, totalConversaciones, totalMensajes] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.conversacion.count(),
    prisma.mensaje.count(),
  ]);

  return NextResponse.json(
    {
      totalUsuarios,
      totalAdmins,
      totalUsers: totalUsuarios - totalAdmins,
      totalConversaciones,
      totalMensajes,
    },
    { status: 200 }
  );
}
