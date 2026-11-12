import Link from "next/link";

const caracteristicas = [
  {
    titulo: "Explicación de código",
    descripcion:
      "Pregunte sobre un fragmento de código y reciba una explicación clara de qué hace y por qué.",
  },
  {
    titulo: "Conceptos de programación",
    descripcion:
      "Resuelva dudas sobre estructuras de datos, algoritmos, paradigmas y buenas prácticas.",
  },
  {
    titulo: "Diagnóstico de errores",
    descripcion:
      "Comparta un error o una excepción y obtenga una pista de su causa y una posible solución.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <span className="rounded-full border border-black/[.08] px-4 py-1 text-sm font-medium text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          Asistente especializado en programación
        </span>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-black sm:text-5xl dark:text-zinc-50">
          AI Expert Chat
        </h1>

        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Converse con un asistente de inteligencia artificial que responde
          preguntas de programación: explica código, aclara conceptos y ayuda
          a entender errores.
        </p>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] sm:w-auto dark:hover:bg-[#ccc]"
            href="/login"
          >
            Iniciar sesión
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] sm:w-auto dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="/registro"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="mt-8 grid w-full gap-6 text-left sm:grid-cols-3">
          {caracteristicas.map((caracteristica) => (
            <div
              key={caracteristica.titulo}
              className="rounded-2xl border border-black/[.08] p-6 dark:border-white/[.145]"
            >
              <h2 className="text-base font-semibold text-black dark:text-zinc-50">
                {caracteristica.titulo}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {caracteristica.descripcion}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
