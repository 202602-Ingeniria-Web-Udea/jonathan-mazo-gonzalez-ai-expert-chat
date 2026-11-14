import Link from "next/link";

const caracteristicas = [
  {
    numero: "01",
    titulo: "Explicación de código",
    descripcion:
      "Pregunte sobre un fragmento de código y reciba una explicación clara de qué hace y por qué.",
  },
  {
    numero: "02",
    titulo: "Conceptos de programación",
    descripcion:
      "Resuelva dudas sobre estructuras de datos, algoritmos, paradigmas y buenas prácticas.",
  },
  {
    numero: "03",
    titulo: "Diagnóstico de errores",
    descripcion:
      "Comparta un error o una excepción y obtenga una pista de su causa y una posible solución.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-6xl px-6 pt-6">
        <nav className="flex items-center justify-between border-b-2 border-ink pb-4">
          <span className="x text-xl">
            AI Expert Chat<span className="acc">.</span>
          </span>
          <Link href="/login" className="btn light">
            Iniciar sesión
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <section className="pt-16 pb-10">
          <span className="mono text-gray">[ Asistente / Programación ]</span>
          <h1 className="x mt-4 text-[clamp(40px,8vw,120px)]">
            Programar <span className="acc">se entiende</span> conversando.
          </h1>
          <div className="mt-10 grid gap-8 border-t-2 border-ink pt-8 sm:grid-cols-2">
            <p className="text-lg text-gray">
              Un asistente de inteligencia artificial que explica código, aclara conceptos y
              ayuda a entender errores — en una conversación, a su ritmo.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <Link href="/registro" className="btn">
                Crear cuenta →
              </Link>
              <Link href="/login" className="btn light">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="lab">
            <span className="x text-2xl">Qué puede preguntar</span>
            <span className="mono text-gray">03 formas de usarlo</span>
          </div>
          <div className="card-ink mt-8 grid sm:grid-cols-3">
            {caracteristicas.map((caracteristica, index) => (
              <div
                key={caracteristica.titulo}
                className={`flex min-h-[220px] flex-col justify-between p-6 ${
                  index < caracteristicas.length - 1 ? "border-b-2 border-ink sm:border-r-2 sm:border-b-0" : ""
                }`}
              >
                <span className="mono text-accent">{caracteristica.numero}</span>
                <div>
                  <h2 className="x text-xl">{caracteristica.titulo}</h2>
                  <p className="mt-2 text-sm text-gray">{caracteristica.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink bg-ink py-8 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 mono">
          <span>AI Expert Chat</span>
          <span className="text-gray">Proyecto integrador · Ingeniería Web</span>
        </div>
      </footer>
    </div>
  );
}
