import { requireUser } from '@/lib/auth';

export default async function ChatPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Hola, {user.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          El chat con el asistente se habilita en la próxima fase.
        </p>
      </div>
    </div>
  );
}
