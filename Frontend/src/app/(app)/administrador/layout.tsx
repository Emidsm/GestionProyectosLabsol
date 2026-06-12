'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Users,
  FileCheck,
  FolderKanban,
  User,
  GraduationCap,
} from 'lucide-react';

// NOTA: Eliminamos imports de UserNav e Image porque ya no se usan aquí.
// La barra superior global se encarga de eso.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR LIMPIA: Solo navegación, sin logo (ya está arriba) */}
        <Sidebar className="pt-16 border-r"> {/* pt-16 para que no quede debajo del header global sticky */}
          <SidebarContent>
            <SidebarMenu className="p-4">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/administrador/usuarios'}>
                  <Link href="/administrador/usuarios">
                    <Users />
                    Usuarios
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/administrador/solicitudes')}>
                  <Link href="/administrador/solicitudes">
                    <FileCheck />
                    Solicitudes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/administrador/proyectos')}>
                  <Link href="/administrador/proyectos">
                    <FolderKanban />
                    Proyectos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/administrador/inscripciones'}>
                  <Link href="/administrador/inscripciones">
                    <User />
                    Inscripciones
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/administrador/carreras')}>
                  <Link href="/administrador/carreras">
                    <GraduationCap />
                    Carreras
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/administrador/perfil'}>
                  <Link href="/administrador/perfil">
                    <User />
                    Perfil
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* CONTENIDO PRINCIPAL: Sin header extra, sin duplicados.
            min-w-0 es clave: sin él, un hijo ancho (p. ej. una tabla con scroll)
            estira toda la columna y desborda la página en vez de hacer scroll interno. */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Botón de menú en móvil: pegado debajo del header global (sticky)
              para que no se pierda al hacer scroll. */}
          <div className="md:hidden sticky top-16 z-30 flex items-center gap-2 border-b bg-background/95 backdrop-blur px-4 py-2">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">Menú</span>
          </div>

          <main className="flex-1 p-4 md:p-6 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
