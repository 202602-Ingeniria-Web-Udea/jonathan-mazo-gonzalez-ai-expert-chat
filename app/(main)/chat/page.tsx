export default function ChatPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 text-center">
      <div>
        <span className="mono text-gray">[ Sin conversación activa ]</span>
        <h1 className="x mt-2 text-2xl">Seleccione una conversación</h1>
        <p className="mt-1 text-sm text-gray">
          O cree una nueva desde el botón de la izquierda para empezar a conversar con el
          asistente.
        </p>
      </div>
    </div>
  );
}
