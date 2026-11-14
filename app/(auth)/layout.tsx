import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Link href="/" className="x text-xl">
          AI Expert Chat<span className="acc">.</span>
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12">{children}</div>
    </div>
  );
}
