'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserFromCookies, clearUserCookie } from '@/lib/cookie-utils';
import { LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/types';

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  // EFECTO DE HIDRATACIÓN: 
  // Esperamos a que el componente se monte para leer la cookie.
  // Esto evita el error de "Hydration failed" porque el primer render
  // en el cliente coincidirá con el del servidor (ambos null/loading).
  React.useEffect(() => {
    setIsMounted(true);
    const u = getUserFromCookies();
    setUser(u);
  }, []);

  const handleLogout = () => {
    clearUserCookie();
    router.push('/');
  };

  // MIENTRAS CARGA (Skeleton):
  // Mostramos un avatar gris para que la interfaz no "salte" ni parpadee.
  if (!isMounted || !user) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full" disabled>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-muted animate-pulse"></AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const profileLink = user.role === 'administrator' 
    ? '/administrador/perfil' 
    : '/perfil';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push(profileLink)} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
