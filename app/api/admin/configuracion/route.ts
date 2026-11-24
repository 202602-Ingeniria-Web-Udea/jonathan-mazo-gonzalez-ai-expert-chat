import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { obtenerSystemPrompt, guardarSystemPrompt } from '@/lib/configuracion';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai';

async function verificarAdmin() {
  const session = await getSession();
  if (!session) return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) };
  if (session.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'No autorizado' }, { status: 403 }) };
  }
  return { error: null };
}

export async function GET(): Promise<NextResponse> {
  const { error } = await verificarAdmin();
  if (error) return error;

  const systemPrompt = await obtenerSystemPrompt();
  return NextResponse.json({ systemPrompt, systemPromptPredeterminado: DEFAULT_SYSTEM_PROMPT }, { status: 200 });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { error } = await verificarAdmin();
  if (error) return error;

  const data = await request.json().catch(() => ({}));
  const systemPrompt = typeof data.systemPrompt === 'string' ? data.systemPrompt.trim() : '';

  if (!systemPrompt) {
    return NextResponse.json({ error: 'El System Prompt no puede estar vacío' }, { status: 400 });
  }
  if (systemPrompt.length > 4000) {
    return NextResponse.json({ error: 'El System Prompt no puede superar los 4000 caracteres' }, { status: 400 });
  }

  const guardado = await guardarSystemPrompt(systemPrompt);
  return NextResponse.json({ systemPrompt: guardado }, { status: 200 });
}
