import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChatConversation } from '@/components/chat/conversation';

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const conversacion = await prisma.conversacion.findUnique({ where: { id } });
  if (!conversacion || conversacion.usuarioId !== user.id) {
    notFound();
  }

  const mensajes = await prisma.mensaje.findMany({
    where: { conversacionId: id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, rol: true, contenido: true },
  });

  return <ChatConversation conversacionId={id} mensajesIniciales={mensajes} />;
}
