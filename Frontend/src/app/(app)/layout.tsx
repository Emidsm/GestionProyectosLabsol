'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Bell } from 'lucide-react';
// 1. IMPORTANTE: Importa tu componente aquí
import { SiteFooter } from '@/components/site-footer'; 

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminSection = pathname.startsWith('/administrador');
  const user = getUserFromCookies();
  const isUserSolicitante = user?.role === 'solicitante';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm h-16">
        <div className="w-full h-full px-6 flex items-center justify-between">
          
          {/* IZQUIERDA: LOGO */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="Logo COZCYT" 
                width={180} 
                height={45}
                className="object-contain"
                priority
              />
            </Link>

            {/* Menú de navegación (Solo si NO es admin) */}
            {!isAdminSection && (
              <nav className="hidden md:flex items-center ml-8 space-x-6 text-sm font-medium">
                {isUserSolicitante ? (
                  <>
                    <Link href="/dashboard" className={cn('transition-colors hover:text-primary', pathname === '/dashboard' ? 'text-primary font-bold' : 'text-muted-foreground')}>Inicio</Link>
                    <Link href="/solicitante/solicitudes" className={cn('transition-colors hover:text-primary', pathname.startsWith('/solicitante/solicitudes') ? 'text-primary font-bold' : 'text-muted-foreground')}>Solicitudes</Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className={cn('transition-colors hover:text-primary', pathname === '/dashboard' ? 'text-primary font-bold' : 'text-muted-foreground')}>Inicio</Link>
                    <Link href="/estudiante/proyectos" className={cn('transition-colors hover:text-primary', pathname.startsWith('/estudiante/proyectos') ? 'text-primary font-bold' : 'text-muted-foreground')}>Proyectos</Link>
                  </>
                )}
                <a href="mailto:RafaelUribeC@outlook.com" className="transition-colors hover:text-primary text-muted-foreground">Contacto</a>
              </nav>
            )}
          </div>

          {/* DERECHA: CAMPANA Y PERFIL */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
            </Button>
            
            <div className="border-l pl-4 ml-2">
              <UserNav />
            </div>
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full">
        <div className={cn(
          "h-full",
          isAdminSection ? "p-6 w-full" : "container py-8"
        )}>
          {children}
        </div>
      </main>

      {/* 2. AQUÍ VA EL FOOTER */}
      {/* Usamos !isAdminSection para que SOLO salga en el Dashboard de estudiantes/solicitantes */}
      {!isAdminSection && <SiteFooter />}

    </div>
  );
}
