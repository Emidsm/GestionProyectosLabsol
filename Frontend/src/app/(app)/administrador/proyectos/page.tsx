'use client';

import * as React from 'react';
import { getProjects, STATUS_LABELS, type ApiProject } from '@/lib/api';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Eye, Filter } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  en_curso:   'bg-green-100 text-green-800 border-green-200',
  validado:   'bg-blue-100 text-blue-800 border-blue-200',
  finalizado: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function AdminProyectosPage() {
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');

  React.useEffect(() => {
    getProjects()
      .then((data) => {
        // Solo mostramos proyectos que ya pasaron revisión
        setProjects(data.filter((p) =>
          p.status !== 'borrador' && p.status !== 'en_revision' && p.status !== 'rechazado'
        ));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.solicitante.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'todos' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Directorio de Proyectos</h1>
        <p className="text-muted-foreground">Administra los proyectos activos, finalizados y en espera.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o solicitante..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="validado">En lista de espera</SelectItem>
              <SelectItem value="en_curso">En desarrollo</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Proyecto</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Cargando proyectos...
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">{project.category}</div>
                  </TableCell>
                  <TableCell>{project.solicitante.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_COLORS[project.status] ?? 'bg-gray-100 text-gray-800'}
                    >
                      {STATUS_LABELS[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/administrador/proyectos/${project.id}`}>
                        <Eye className="h-4 w-4 mr-2" /> Detalles
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron proyectos con los filtros actuales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
