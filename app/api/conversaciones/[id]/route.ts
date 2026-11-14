import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await params;

  const conversacion = await prisma.conversacion.findUnique({ where: { id } });
  if (!conversacion || conversacion.usuarioId !== session.id) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
  }

  await prisma.conversacion.delete({ where: { id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
