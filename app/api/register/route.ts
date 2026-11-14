import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Nombre, correo y contraseña son obligatorios' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 8 caracteres' },
      { status: 400 }
    );
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return NextResponse.json({ error: 'Ya existe una cuenta con ese correo' }, { status: 409 });
  }

  // El registro público siempre crea usuarios con rol USER; el rol ADMIN
  // solo se asigna manualmente desde el panel de administración.
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
      role: 'USER',
    },
  });

  await createSession(user.id);

  return NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
}
