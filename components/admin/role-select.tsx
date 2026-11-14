'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function RoleSelect({
  userId,
  rolActual,
  esUsuarioActual,
}: {
  userId: string;
  rolActual: 'ADMIN' | 'USER';
  esUsuarioActual: boolean;
}) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cambiarRol(nuevoRol: string) {
    setError(null);
    setGuardando(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nuevoRol }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'No se pudo actualizar el rol');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el rol');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        defaultValue={rolActual}
        disabled={guardando || esUsuarioActual}
        onChange={(event) => cambiarRol(event.target.value)}
        className="mono border-2 border-ink bg-transparent px-2.5 py-1.5 outline-none disabled:opacity-60"
      >
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
      </select>
      {error && <span className="mono text-xs text-accent">{error}</span>}
    </div>
  );
}
