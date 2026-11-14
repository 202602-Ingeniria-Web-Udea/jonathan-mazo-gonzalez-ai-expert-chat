import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { id } = await params;
  const data = await request.json().catch(() => ({}));
  const { role } = data;

  if (role !== 'ADMIN' && role !== 'USER') {
    return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
  }

  if (id === session.id && role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'No puede quitarse su propio rol de administrador' },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 200 });
}
