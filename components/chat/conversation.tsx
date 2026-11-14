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
          <p className="mono text-center text-gray">Escriba su primera pregunta para comenzar.</p>
        )}
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`max-w-[85%] border-2 border-ink px-4 py-2.5 text-sm whitespace-pre-wrap ${
                mensaje.rol === 'USUARIO' ? 'self-end bg-ink text-white' : 'self-start bg-white text-ink'
              }`}
            >
              {mensaje.contenido}
            </div>
          ))}
          {enviando && (
            <div className="mono self-start border-2 border-ink bg-white px-4 py-2.5 text-gray">
              El asistente está escribiendo...
            </div>
          )}
        </div>
      </div>

      <form onSubmit={enviarMensaje} className="flex items-center gap-2 border-t-2 border-ink p-4">
        <input
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Escriba su pregunta de programación..."
          disabled={enviando}
          className="flex-1 border-2 border-ink bg-transparent px-4 py-2.5 text-sm outline-none disabled:opacity-60"
        />
        <button type="submit" disabled={enviando || !texto.trim()} className="btn h-10 shrink-0 px-5">
          Enviar
        </button>
      </form>
      {error && <p className="mono px-4 pb-3 text-center text-accent">{error}</p>}
    </div>
  );
}
