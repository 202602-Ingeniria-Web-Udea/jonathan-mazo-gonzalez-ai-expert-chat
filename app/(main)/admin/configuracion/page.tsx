import { obtenerSystemPrompt } from '@/lib/configuracion';
import { DEFAULT_SYSTEM_PROMPT } from '@/lib/ai';
import { ConfiguracionForm } from '@/components/admin/configuracion-form';

export default async function AdminConfiguracionPage() {
  const systemPrompt = await obtenerSystemPrompt();

  return (
    <div className="max-w-3xl">
      <p className="mono mb-4 text-gray">
        Defina la identidad, el dominio y los límites del asistente. Los cambios se aplican a
        todas las conversaciones nuevas de inmediato.
      </p>
      <ConfiguracionForm
        systemPromptInicial={systemPrompt}
        systemPromptPredeterminado={DEFAULT_SYSTEM_PROMPT}
      />
    </div>
  );
}
