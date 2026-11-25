import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Llamado diariamente por un Cron Job de Vercel (ver vercel.json) para
// mantener activo el proyecto de Supabase, cuyo plan gratuito pausa la
// base de datos tras un período de inactividad. Esta base de datos es
// compartida con el proyecto proyecto2-base (otro esquema), que tiene su
// propio cron a una hora distinta como respaldo redundante.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  const userCount = await prisma.user.count();

  return NextResponse.json({ ok: true, userCount });
}
