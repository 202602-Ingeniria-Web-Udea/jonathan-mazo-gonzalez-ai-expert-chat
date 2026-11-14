'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface MensajeItem {
  id: string;
  rol: 'USUARIO' | 'ASISTENTE';
  contenido: string;
}

export function ChatConversation({
  conversacionId,
  mensajesIniciales,
}: {
  conversacionId: string;
  mensajesIniciales: MensajeItem[];
}) {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<MensajeItem[]>(mensajesIniciales);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviarMensaje(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const contenido = texto.trim();
    if (!contenido || enviando) return;

    setError(null);
    setEnviando(true);
    setTexto('');

    const mensajeOptimista: MensajeItem = {
      id: `temp-${Date.now()}`,
      rol: 'USUARIO',
      contenido,
    };
    setMensajes((actual) => [...actual, mensajeOptimista]);

    try {
      const res = await fetch(`/api/conversaciones/${conversacionId}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'No se pudo enviar el mensaje');
      }

      setMensajes((actual) => [
        ...actual.filter((m) => m.id !== mensajeOptimista.id),
        { id: data.mensajeUsuario.id, rol: 'USUARIO', contenido: data.mensajeUsuario.contenido },
        {
          id: data.mensajeAsistente.id,
          rol: 'ASISTENTE',
          contenido: data.mensajeAsistente.contenido,
        },
      ]);
      router.refresh();
    } catch (err) {
      setMensajes((actual) => actual.filter((m) => m.id !== mensajeOptimista.id));
      setTexto(contenido);
      setError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {mensajes.length === 0 && (
          <p className="text-center text-sm text-zinc-500">
            Escriba su primera pregunta para comenzar.
          </p>
        )}
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                mensaje.rol === 'USUARIO'
                  ? 'self-end bg-foreground text-background'
                  : 'self-start bg-black/[.04] text-black dark:bg-white/[.08] dark:text-zinc-50'
              }`}
            >
              {mensaje.contenido}
            </div>
          ))}
          {enviando && (
            <div className="self-start rounded-2xl bg-black/[.04] px-4 py-2.5 text-sm text-zinc-500 dark:bg-white/[.08]">
              El asistente está escribiendo...
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={enviarMensaje}
        className="flex items-center gap-2 border-t border-black/[.08] p-4 dark:border-white/[.145]"
      >
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Escriba su pregunta de programación..."
          disabled={enviando}
          className="flex-1 rounded-full border border-black/[.08] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-black/30 disabled:opacity-60 dark:border-white/[.145] dark:focus:border-white/30"
        />
        <button
          type="submit"
          disabled={enviando || !texto.trim()}
          className="flex h-10 shrink-0 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          Enviar
        </button>
      </form>
      {error && (
        <p className="px-4 pb-3 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
