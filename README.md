# AI Expert Chat — Programación

Aplicación web tipo chat que permite conversar con un asistente de
inteligencia artificial especializado en programación (explicación de
código, conceptos y errores).

Proyecto integrador · Ingeniería Web · Universidad de Antioquia.

> Documentación completa (arquitectura, modelo de datos, instrucciones de
> instalación y credenciales de prueba) pendiente hasta cerrar el Taller 2.

## Cómo ejecutarlo localmente

```bash
npm install
```

Crear un archivo `.env` (ver `.env.example`) con la cadena de conexión de un
proyecto de [Supabase](https://supabase.com) y la clave de la API de
[Groq](https://console.groq.com).

```bash
npx prisma migrate dev --name migracion-inicial
npm run dev
```
