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
    <div className="card-ink w-full max-w-sm p-8">
      <span className="mono text-gray">[ {modo === 'registro' ? 'Registro' : 'Acceso'} ]</span>
      <h1 className="x mt-2 text-3xl">{modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
      <p className="mt-2 text-sm text-gray">
        {modo === 'registro'
          ? 'Regístrese para comenzar a conversar con el asistente.'
          : 'Ingrese sus credenciales para continuar.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {modo === 'registro' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="mono">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="border-2 border-ink bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="mono">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="border-2 border-ink bg-transparent px-3.5 py-2.5 text-sm outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="mono">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={modo === 'registro' ? 8 : undefined}
            autoComplete={modo === 'registro' ? 'new-password' : 'current-password'}
            className="border-2 border-ink bg-transparent px-3.5 py-2.5 text-sm outline-none"
          />
        </div>

        {error && (
          <p className="border-2 border-ink bg-accent/10 px-3.5 py-2.5 text-sm text-ink">
            {error}
          </p>
        )}

        <button type="submit" disabled={cargando} className="btn mt-2 h-11 w-full">
          {cargando ? 'Procesando...' : modo === 'registro' ? 'Crear cuenta →' : 'Iniciar sesión →'}
        </button>
      </form>

      <p className="mono mt-6 text-center text-gray">
        {modo === 'registro' ? (
          <>
            ¿Ya tiene una cuenta?{' '}
            <Link href="/login" className="acc">
              Inicie sesión
            </Link>
          </>
        ) : (
          <>
            ¿No tiene una cuenta?{' '}
            <Link href="/registro" className="acc">
              Regístrese
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
