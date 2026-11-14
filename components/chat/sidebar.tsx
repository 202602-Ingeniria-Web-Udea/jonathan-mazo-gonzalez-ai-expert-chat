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
    <aside className="flex w-72 shrink-0 flex-col border-r-2 border-ink">
      <div className="p-4">
        <button onClick={nuevaConversacion} disabled={creando} className="btn h-10 w-full">
          {creando ? 'Creando...' : 'Nueva conversación'}
        </button>
        {error && <p className="mono mt-2 text-xs text-accent">{error}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4">
        {conversaciones.length === 0 && (
          <p className="mono px-2 py-4 text-center text-gray">Todavía no tiene conversaciones.</p>
        )}
        {conversaciones.map((conversacion) => {
          const activa = pathname === `/chat/${conversacion.id}`;
          return (
            <div
              key={conversacion.id}
              className={`group flex items-center justify-between gap-2 border-2 px-3 py-2 text-sm ${
                activa ? 'border-ink bg-white' : 'border-transparent hover:border-ink'
              }`}
            >
              <Link href={`/chat/${conversacion.id}`} className="flex-1 truncate">
                {conversacion.titulo}
              </Link>

              {confirmarEliminar === conversacion.id ? (
                <div className="mono flex shrink-0 items-center gap-1.5 text-xs">
                  <button onClick={() => eliminarConversacion(conversacion.id)} className="acc">
                    Eliminar
                  </button>
                  <button onClick={() => setConfirmarEliminar(null)} className="text-gray">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmarEliminar(conversacion.id)}
                  className="mono shrink-0 text-xs text-gray opacity-0 transition-opacity group-hover:opacity-100"
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
