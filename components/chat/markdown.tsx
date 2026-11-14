'use client';

import { useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CodeBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const texto = ref.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // Clipboard no disponible (p. ej. contexto no seguro); se ignora.
    }
  }

  return (
    <div className="relative mb-2 last:mb-0">
      <button
        type="button"
        onClick={copiar}
        className="mono absolute top-2 right-2 border border-white/30 bg-ink px-2 py-1 text-[11px] text-white hover:bg-[#2a2a28]"
      >
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
      <pre ref={ref} className="overflow-x-auto border-2 border-ink bg-ink p-3 pr-20 text-white">
        {children}
      </pre>
    </div>
  );
}

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="acc underline">
      {children}
    </a>
  ),
  h1: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-semibold">{children}</p>,
  code: ({ className, children }) => {
    const esBloque = /language-/.test(className ?? '');
    if (!esBloque) {
      return (
        <code className="mono rounded-sm bg-accent/15 px-1 py-0.5 text-[0.85em]">{children}</code>
      );
    }
    return <code className={`mono block text-xs ${className ?? ''}`}>{children}</code>;
  },
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
};

export function Markdown({ contenido }: { contenido: string }) {
  return (
    <div className="text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {contenido}
      </ReactMarkdown>
    </div>
  );
}
