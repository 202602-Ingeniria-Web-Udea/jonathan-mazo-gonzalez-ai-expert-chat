'use client';

import { useState } from 'react';

export function ConfiguracionForm({
  systemPromptInicial,
  systemPromptPredeterminado,
}: {
  systemPromptInicial: string;
  systemPromptPredeterminado: string;
}) {
  const [texto, setTexto] = useState(systemPromptInicial);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  async function guardar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const systemPrompt = texto.trim();
    if (!systemPrompt) return;

    setGuardando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'No se pudo guardar la configuración');
      setTexto(data.systemPrompt);
      setMensaje({ tipo: 'ok', texto: 'Configuración guardada correctamente.' });
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'No se pudo guardar la configuración.',
      });
    } finally {
      setGuardando(false);
    }
  }

  function restaurarPredeterminado() {
    setTexto(systemPromptPredeterminado);
    setMensaje(null);
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-3">
      <label className="mono text-gray" htmlFor="system-prompt">
        System Prompt del asistente
      </label>
      <textarea
        id="system-prompt"
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        rows={16}
        maxLength={4000}
        className="border-2 border-ink bg-white p-3 text-sm outline-none"
      />
      <p className="mono text-right text-xs text-gray">{texto.length}/4000</p>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={guardando || !texto.trim()} className="btn h-10 px-5">
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={restaurarPredeterminado} className="btn light h-10 px-5">
          Restaurar predeterminado
        </button>
      </div>

      {mensaje && (
        <p className={`mono text-sm ${mensaje.tipo === 'ok' ? 'text-ink' : 'text-accent'}`}>
          {mensaje.texto}
        </p>
      )}
    </form>
  );
}
