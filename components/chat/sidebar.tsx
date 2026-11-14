'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export interface ConversacionItem {
  id: string;
  titulo: string;
}

export function ChatSidebar({ conversaciones }: { conversaciones: ConversacionItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [creando, setCreando] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function nuevaConversacion() {
    setCreando(true);
    setError(null);
    try {
      const res = await fetch('/api/conversaciones', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'No se pudo crear la conversación');
      router.push(`/chat/${data.conversacion.id}`);
      router.refresh();
    } catch {
      setError('No se pudo crear la conversación. Intente de nuevo.');
    } finally {
      setCreando(false);
    }
  }

  async function eliminarConversacion(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/conversaciones/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'No se pudo eliminar la conversación');
      }
      setConfirmarEliminar(null);
      if (pathname === `/chat/${id}`) {
        router.push('/chat');
      }
      router.refresh();
    } catch {
      setError('No se pudo eliminar la conversación. Intente de nuevo.');
    }
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-black/[.08] dark:border-white/[.145]">
      <div className="p-4">
        <button
          onClick={nuevaConversacion}
          disabled={creando}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {creando ? 'Creando...' : 'Nueva conversación'}
        </button>
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4">
        {conversaciones.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-zinc-500">
            Todavía no tiene conversaciones.
          </p>
        )}
        {conversaciones.map((conversacion) => {
          const activa = pathname === `/chat/${conversacion.id}`;
          return (
            <div
              key={conversacion.id}
              className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                activa
                  ? 'bg-black/[.06] dark:bg-white/[.08]'
                  : 'hover:bg-black/[.04] dark:hover:bg-white/[.06]'
              }`}
            >
              <Link href={`/chat/${conversacion.id}`} className="flex-1 truncate">
                {conversacion.titulo}
              </Link>

              {confirmarEliminar === conversacion.id ? (
                <div className="flex shrink-0 items-center gap-1.5 text-xs">
                  <button
                    onClick={() => eliminarConversacion(conversacion.id)}
                    className="font-medium text-red-600 dark:text-red-400"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setConfirmarEliminar(null)}
                    className="text-zinc-500"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmarEliminar(conversacion.id)}
                  className="shrink-0 text-xs text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Eliminar conversación"
                >
                  Eliminar
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
