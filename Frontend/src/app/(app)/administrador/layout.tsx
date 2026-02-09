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

        {/* CONTENIDO PRINCIPAL: Sin header extra, sin duplicados */}
        <div className="flex-1 flex flex-col">
          {/* Botón para abrir/cerrar menú en móvil (opcional, pero recomendado) */}
          <div className="md:hidden p-4">
             <SidebarTrigger />
          </div>
          
          <main className="flex-1 p-4 md:p-6 w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
