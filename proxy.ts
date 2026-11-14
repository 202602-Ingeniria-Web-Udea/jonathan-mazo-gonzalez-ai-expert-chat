import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'session_token';

/**
 * Verificación optimista: ¿la cookie de sesión existe? La autorización real
 * (token válido, no expirado, rol correcto) vive en `requireUser`/
 * `requireAdmin`, dentro del layout de `(main)` y en cada ruta de API.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/registro');

  if (!hasSession && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/admin/:path*', '/login', '/registro'],
};
