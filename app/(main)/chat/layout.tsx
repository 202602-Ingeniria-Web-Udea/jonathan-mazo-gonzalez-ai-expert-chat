import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChatSidebar } from '@/components/chat/sidebar';

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const conversaciones = await prisma.conversacion.findMany({
    where: { usuarioId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, titulo: true },
  });

  return (
    <div className="flex flex-1 overflow-hidden">
      <ChatSidebar conversaciones={conversaciones} />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
