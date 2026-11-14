import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { generarRespuestaSimulada } from '@/lib/ai-simulado';

async function obtenerConversacionPropia(id: string, usuarioId: string) {
  const conversacion = await prisma.conversacion.findUnique({ where: { id } });
  if (!conversacion || conversacion.usuarioId !== usuarioId) return null;
  return conversacion;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const conversacion = await obtenerConversacionPropia(id, session.id);
  if (!conversacion) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
  }

  const mensajes = await prisma.mensaje.findMany({
    where: { conversacionId: id },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ mensajes }, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const conversacion = await obtenerConversacionPropia(id, session.id);
  if (!conversacion) {
    return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
  }

  const data = await request.json().catch(() => ({}));
  const contenido = typeof data.contenido === 'string' ? data.contenido.trim() : '';

  if (!contenido) {
    return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
  }

  const mensajeUsuario = await prisma.mensaje.create({
    data: { conversacionId: id, rol: 'USUARIO', contenido },
  });

  // Fase de IA simulada (Taller 2): se reemplaza por una llamada real al
  // proveedor de IA en la fase de integración.
  const respuesta = generarRespuestaSimulada(contenido);
  const mensajeAsistente = await prisma.mensaje.create({
    data: { conversacionId: id, rol: 'ASISTENTE', contenido: respuesta },
  });

  const esPrimerMensaje = conversacion.titulo === 'Nueva conversación';
  await prisma.conversacion.update({
    where: { id },
    data: {
      updatedAt: new Date(),
      ...(esPrimerMensaje ? { titulo: contenido.slice(0, 60) } : {}),
    },
  });

  return NextResponse.json({ mensajeUsuario, mensajeAsistente }, { status: 201 });
}
