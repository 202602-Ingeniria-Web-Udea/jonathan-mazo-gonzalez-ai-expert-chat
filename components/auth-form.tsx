'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Modo = 'login' | 'registro';

interface Props {
  modo: Modo;
}

export function AuthForm({ modo }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCargando(true);

    const formData = new FormData(event.currentTarget);
    const body =
      modo === 'registro'
        ? {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
          }
        : {
            email: formData.get('email'),
            password: formData.get('password'),
          };

    const endpoint = modo === 'registro' ? '/api/register' : '/api/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error inesperado');
        setCargando(false);
        return;
      }

      router.push('/chat');
      router.refresh();
    } catch {
      setError('No se pudo conectar con el servidor. Intente de nuevo.');
      setCargando(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        {modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {modo === 'registro'
          ? 'Regístrese para comenzar a conversar con el asistente.'
          : 'Ingrese sus credenciales para continuar.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {modo === 'registro' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-black dark:text-zinc-50">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="rounded-lg border border-black/[.08] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:focus:border-white/30"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-black dark:text-zinc-50">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-lg border border-black/[.08] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:focus:border-white/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-black dark:text-zinc-50">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={modo === 'registro' ? 8 : undefined}
            autoComplete={modo === 'registro' ? 'new-password' : 'current-password'}
            className="rounded-lg border border-black/[.08] bg-transparent px-3.5 py-2.5 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:focus:border-white/30"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {cargando ? 'Procesando...' : modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {modo === 'registro' ? (
          <>
            ¿Ya tiene una cuenta?{' '}
            <Link href="/login" className="font-medium text-black dark:text-zinc-50">
              Inicie sesión
            </Link>
          </>
        ) : (
          <>
            ¿No tiene una cuenta?{' '}
            <Link href="/registro" className="font-medium text-black dark:text-zinc-50">
              Regístrese
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
