import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get user data from cookie
  const userCookie = request.cookies.get('proconecta_user');
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/register/student', '/register/solicitante'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If accessing public route and already logged in, redirect based on role
  if (isPublicRoute && user) {
    if (user.role === 'administrator') {
      return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
    }
    // Both estudiante and solicitante go to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing protected route without authentication, redirect to login
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based route protection
  if (user) {
    // Admin routes - only administrators can access
    if (pathname.startsWith('/administrador') && user.role !== 'administrator') {
      // Non-admins trying to access admin routes go to their appropriate dashboard
      if (user.role === 'estudiante') {
        return NextResponse.redirect(new URL('/estudiante/proyectos', request.url));
      }
      if (user.role === 'solicitante') {
        return NextResponse.redirect(new URL('/solicitante/solicitudes', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Solicitante routes - only solicitantes can access
    if (pathname.startsWith('/solicitante') && user.role !== 'solicitante') {
      if (user.role === 'administrator') {
        return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
      }
      if (user.role === 'estudiante') {
        return NextResponse.redirect(new URL('/estudiante/proyectos', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Estudiante routes - only estudiantes can access
    if (pathname.startsWith('/estudiante') && user.role !== 'estudiante') {
      if (user.role === 'administrator') {
        return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
      }
      if (user.role === 'solicitante') {
        return NextResponse.redirect(new URL('/solicitante/solicitudes', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Dashboard redirect logic - admins shouldn't access generic dashboard
    if (pathname === '/dashboard' && user.role === 'administrator') {
      return NextResponse.redirect(new URL('/administrador/solicitudes', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
