'use client';

import * as React from 'react';
import { getAllUsers, type ApiUser } from '@/lib/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { AddAdminDialog } from '@/components/add-admin-dialog';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [isAddAdminOpen, setIsAddAdminOpen] = React.useState(false);
  const [users, setUsers] = React.useState<ApiUser[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de usuarios</h1>
          <p className="text-muted-foreground text-sm mt-1">Administra los accesos y roles de la plataforma.</p>
        </div>
        <Button onClick={() => setIsAddAdminOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Añadir administrador
        </Button>
      </div>

      <div className="border rounded-lg bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Empresa / Institución</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Cargando usuarios...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No hay usuarios registrados.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role === 'administrator' ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : user.role === 'solicitante' ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-green-100 text-green-800 border-green-200'}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.company || user.academicInstitution || '—'}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <span className={`mr-2 h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-400'}`} />
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/administrador/usuarios/${user.id}`}>Ver detalles</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AddAdminDialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen} />
    </div>
  );
}
