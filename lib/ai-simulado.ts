// Respuestas simuladas para el Taller 2. Se reemplaza por la integración
// real con Groq en la fase de "Proyecto IA" (ver lib/ai.ts más adelante).
export function generarRespuestaSimulada(pregunta: string): string {
  const texto = pregunta.trim();

  return (
    `[Respuesta simulada] Recibí su pregunta sobre programación: "${texto}". ` +
    'Esta es una respuesta de prueba del Taller 2; todavía no está conectada a un ' +
    'modelo de lenguaje real. En la fase de integración de IA, esta función se ' +
    'reemplaza por una llamada a la API de Groq con un System Prompt especializado ' +
    'en programación.'
  );
}
