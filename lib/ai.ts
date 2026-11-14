import 'server-only';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODELO = process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b';

export const SYSTEM_PROMPT = `Usted es el asistente de "AI Expert Chat", especializado
exclusivamente en programación.

Identidad y dominio:
- Ayuda a explicar fragmentos de código, aclarar conceptos de programación
  (estructuras de datos, algoritmos, paradigmas, buenas prácticas) y a
  entender errores o excepciones.
- Responde siempre en español neutro y profesional, tratando al usuario de
  "usted".

Comportamiento y límites:
- Si la pregunta no tiene relación con programación, indíquelo con
  amabilidad y redirija la conversación hacia el dominio del asistente, sin
  responder el tema ajeno.
- Si no tiene certeza suficiente sobre una respuesta, dígalo explícitamente
  en vez de inventar información.
- No genera código con fines maliciosos (malware, explotación de
  vulnerabilidades, evasión de seguridad) ni ayuda a vulnerar sistemas
  ajenos.
- No diagnostica ni da asesoría fuera del ámbito técnico de programación.

Formato de respuesta:
- Sea claro y conciso. Use bloques de código (\`\`\`) cuando incluya código.
- Cuando explique un error, señale primero la causa probable y luego una
  posible solución.`;

export interface MensajeIA {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Error con un mensaje ya listo para mostrarle al usuario (en vez del
 * detalle crudo de la API, que no debe exponerse ni es comprensible).
 */
export class ErrorIA extends Error {
  constructor(
    public readonly userMessage: string,
    options?: ErrorOptions
  ) {
    super(userMessage, options);
    this.name = 'ErrorIA';
  }
}

const TIMEOUT_MS = 20_000;

export async function generarRespuestaIA(historial: MensajeIA[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new ErrorIA('El asistente no está disponible en este momento.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODELO,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...historial],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ErrorIA('El asistente tardó demasiado en responder. Intente de nuevo.', {
        cause: error,
      });
    }
    throw new ErrorIA('No se pudo conectar con el asistente. Revise su conexión e intente de nuevo.', {
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const texto = await response.text().catch(() => '');
    console.error(`Groq respondió ${response.status}: ${texto.slice(0, 500)}`);

    if (response.status === 429) {
      throw new ErrorIA('El asistente está muy solicitado en este momento. Intente de nuevo en unos segundos.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new ErrorIA('El asistente no está disponible en este momento.');
    }
    if (response.status >= 500) {
      throw new ErrorIA('El proveedor de IA no está disponible en este momento. Intente de nuevo más tarde.');
    }
    throw new ErrorIA('No se pudo generar la respuesta del asistente.');
  }

  const data = await response.json();
  const contenido = data.choices?.[0]?.message?.content;
  if (typeof contenido !== 'string' || !contenido.trim()) {
    throw new ErrorIA('El asistente no devolvió una respuesta válida. Intente reformular su pregunta.');
  }

  return contenido;
}
