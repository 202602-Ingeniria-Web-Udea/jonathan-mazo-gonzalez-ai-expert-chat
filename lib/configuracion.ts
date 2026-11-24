import 'server-only';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai';

const ID_CONFIGURACION = 'default';

export async function obtenerSystemPrompt(): Promise<string> {
  const configuracion = await prisma.configuracionAsistente.findUnique({
    where: { id: ID_CONFIGURACION },
  });
  return configuracion?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
}

export async function guardarSystemPrompt(systemPrompt: string): Promise<string> {
  const configuracion = await prisma.configuracionAsistente.upsert({
    where: { id: ID_CONFIGURACION },
    create: { id: ID_CONFIGURACION, systemPrompt },
    update: { systemPrompt },
  });
  return configuracion.systemPrompt;
}
