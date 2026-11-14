export default function ChatPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
          Seleccione una conversación
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          O cree una nueva desde el botón de la izquierda para empezar a conversar con el
          asistente.
        </p>
      </div>
    </div>
  );
}
