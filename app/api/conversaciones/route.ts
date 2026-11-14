import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const conversaciones = await prisma.conversacion.findMany({
    where: { usuarioId: session.id },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ conversaciones }, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  const titulo = typeof data.titulo === 'string' && data.titulo.trim() ? data.titulo.trim() : 'Nueva conversación';

  const conversacion = await prisma.conversacion.create({
    data: { titulo, usuarioId: session.id },
  });

  return NextResponse.json({ conversacion }, { status: 201 });
}
