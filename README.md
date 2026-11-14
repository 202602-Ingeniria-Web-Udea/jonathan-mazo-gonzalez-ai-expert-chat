# AI Expert Chat — Programación

Aplicación web tipo chat que permite conversar con un asistente de
inteligencia artificial especializado en programación (explicación de
código, conceptos y errores), construida con **Next.js (App Router) +
TypeScript + TailwindCSS + Prisma + Supabase (PostgreSQL)**. Incluye
autenticación real (sesiones con cookie `httpOnly`, contraseñas con hash
bcrypt) y control de acceso por roles tanto en el front como en el back.

Proyecto integrador · Ingeniería Web · Universidad de Antioquia.

**Demo en vivo:** _(se agrega aquí una vez desplegado en Vercel)_

## Integrantes

- Jonathan Mazo González

## Dominio elegido: Programación

El asistente está especializado en programación: explica fragmentos de
código, aclara conceptos (estructuras de datos, algoritmos, paradigmas,
buenas prácticas) y ayuda a entender errores y excepciones. No está
diseñado para responder sobre temas fuera de ese dominio.

> **Estado de la integración de IA**: en esta entrega (Taller 2) las
> respuestas del asistente son **simuladas** (`lib/ai-simulado.ts`), tal
> como pide el enunciado para esta fase. La integración con un proveedor de
> IA real (Groq) y el System Prompt especializado se desarrollan en la
> siguiente fase (Proyecto IA), reemplazando únicamente esa función sin
> tocar el resto de la arquitectura.

## Credenciales de prueba

Creadas por el script de seed (`npm run db:seed`):

| Rol   | Correo                         | Contraseña     |
| ----- | ------------------------------- | -------------- |
| ADMIN | `admin@aiexpertchat.test`       | `Admin1234`    |
| USER  | `usuario@aiexpertchat.test`     | `Usuario1234`  |

> Credenciales de prueba para evaluación — en un sistema real nunca se
> documentarían así.

## Roles

- **ADMIN**: gestiona usuarios (cambia roles) y consulta estadísticas
  generales del sistema, además de poder conversar como cualquier usuario.
- **USER**: crea conversaciones, envía mensajes y gestiona únicamente sus
  propias conversaciones (historial, eliminación). No puede ver ni
  modificar usuarios. Esto se valida tanto ocultando la UI como en cada
  ruta de API (`getSession()` + chequeo de rol), así que no basta con
  conocer la URL para saltarse la restricción.

## Cómo ejecutarlo localmente

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [Supabase](https://supabase.com) y copiar su
   connection string, y una clave de API en [Groq](https://console.groq.com)
   (se usa a partir de la fase de integración real de IA).

3. Crear un archivo `.env` en la raíz (ver `.env.example`) con:

   ```bash
   # Pooler en modo transacción (runtime de la app)
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
   # Pooler en modo sesión / conexión directa (requerida por Prisma Migrate)
   DIRECT_URL="postgresql://...:5432/postgres"
   # Clave de la API de Groq — nunca se expone en el navegador
   GROQ_API_KEY=""
   ```

   > Si la base de datos de Supabase se comparte con otro proyecto, se
   > puede aislar este en su propio esquema de Postgres agregando
   > `&schema=nombre_del_esquema` al final de ambas URLs. Prisma Migrate sí
   > entiende ese parámetro directamente desde la URL, pero el cliente en
   > runtime (`lib/prisma.ts`, que usa el adapter de `pg`) lo ignora — por
   > eso ese mismo nombre de esquema también se pasa explícitamente como
   > segundo argumento de `PrismaPg`.

4. Crear las tablas y generar el cliente de Prisma:

   ```bash
   npx prisma migrate dev --name migracion-inicial
   ```

5. Crear los usuarios de prueba (ADMIN/USER):

   ```bash
   npm run db:seed
   ```

6. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

   > En algunos equipos Windows con antivirus/EDR activo, Turbopack (el
   > bundler por defecto de `next dev`) puede chocar con el escaneo en
   > tiempo real y fallar con errores `EPERM` al renombrar archivos de
   > `.next/`. Si eso ocurre, usar `npx next dev --webpack` en su lugar.

## Estructura del proyecto

```
app/
  (auth)/login/, registro/   # Páginas públicas de autenticación
  (main)/                    # Rutas protegidas (requieren sesión)
    chat/                    # Lista de conversaciones + ventana de chat
    admin/                   # Estadísticas y gestión de usuarios (solo ADMIN)
  api/                       # Rutas de API (register, login, logout,
                              # conversaciones, mensajes, users, admin/stats)
components/
  auth-form.tsx              # Formulario compartido de login/registro
  chat/                      # Sidebar, ventana de conversación
  admin/                     # Selector de rol
lib/
  auth.ts                    # requireUser()/requireAdmin() — autorización real
  session.ts                 # Creación/lectura/destrucción de sesiones (cookie httpOnly)
  password.ts                # Hash y verificación con bcrypt
  prisma.ts                  # Cliente de Prisma (vía adapter de Postgres)
  ai-simulado.ts              # Respuestas simuladas del asistente (Taller 2)
prisma/
  schema.prisma               # User, Session, Conversacion, Mensaje
  seed.ts                      # Usuarios de prueba
proxy.ts                       # Redirección optimista si no hay sesión
```

## Cómo funciona la autenticación

1. **Registro** (`/api/register`): crea el usuario con rol `USER` (el rol
   `ADMIN` solo se asigna manualmente desde el panel de administración),
   hashea la contraseña con bcrypt y crea sesión.
2. **Login** (`/api/login`): compara la contraseña contra el hash
   guardado, crea un registro en `Session` (token aleatorio + expiración a
   3 días) y lo guarda en una cookie `httpOnly` (no accesible desde JS en
   el navegador, protege contra XSS).
3. **`proxy.ts`**: hace una verificación **optimista** — si no existe la
   cookie, redirige a `/login`. No consulta la base de datos aquí.
4. **`requireUser()` / `requireAdmin()`** (`lib/auth.ts`): esta es la
   autorización **real**. Se usa en el layout de `(main)` y en cada ruta de
   API — valida el token contra la base de datos y revisa expiración y rol.
5. **Logout** (`/api/logout`): borra la sesión de la base de datos y la
   cookie.

## Identidad visual

Sistema tipográfico y gráfico propio: tipografía **Archivo** (variable,
expandida al 125% en títulos) para encabezados y **JetBrains Mono** para
etiquetas y datos secundarios, sobre un fondo hueso con retícula vertical
visible. Bordes gruesos de 2px, botones con sombra dura tipo "offset" y
acento en azul eléctrico (`#2f6fff`).

## Notas de implementación

- El título de cada conversación se asigna automáticamente a partir del
  primer mensaje enviado (antes de eso se llama "Nueva conversación").
- Un usuario `ADMIN` no puede quitarse su propio rol de administrador
  desde el panel (validado en `PATCH /api/users/[id]`), para evitar
  quedarse sin acceso por accidente.
- `generarRespuestaSimulada()` (`lib/ai-simulado.ts`) es el único punto que
  cambia al integrar un proveedor de IA real; el resto del flujo de
  conversaciones y mensajes no se modifica.
