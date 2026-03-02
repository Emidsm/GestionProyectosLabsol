import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Extraemos ambas cookies: el token de seguridad y los datos del usuario
  const token = request.cookies.get('proconecta_token')?.value;
  const userCookie = request.cookies.get('proconecta_user')?.value;
  
  let user = null;
  if (userCookie) {
    try {
      // Usamos decodeURIComponent porque al guardar la cookie usamos encodeURIComponent
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch (e) {
      user = null;
    }
  }

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/register/student', '/register/solicitante'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // 2. Si intenta acceder a ruta protegida sin autenticación completa -> al Login
  if (!isPublicRoute && (!user || !token)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Si accede a ruta pública y YA está logueado -> Redirigir por defecto
  if (isPublicRoute && user && token) {
    if (user.role === 'administrator') {
      return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
    }
    // Estudiantes y solicitantes van al dashboard por defecto
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Protección de rutas basada en roles
  if (user && token) {
    // Lógica del Dashboard: Admins no deben ver el dashboard genérico
    if (pathname === '/dashboard' && user.role === 'administrator') {
      return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
    }

    // Nota: Como no hay ningún "if" que bloquee la ruta '/perfil', 
    // los 3 roles podrán acceder a ella sin problemas.

    // Rutas exclusivas de Administrador
    if (pathname.startsWith('/administrador') && user.role !== 'administrator') {
      if (user.role === 'estudiante') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (user.role === 'solicitante') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Rutas exclusivas de Solicitante
    if (pathname.startsWith('/solicitante') && user.role !== 'solicitante') {
      if (user.role === 'administrator') {
        return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Rutas exclusivas de Estudiante
    if (pathname.startsWith('/estudiante') && user.role !== 'estudiante') {
      if (user.role === 'administrator') {
        return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
