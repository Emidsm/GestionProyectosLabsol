'use client';

import * as React from 'react';
import { mockProjects } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Eye, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminProyectosPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');

  // 1. FILTRO DE PRIVACIDAD Y LÓGICA DE NEGOCIO
  // Excluimos: Borradores (Privado), En revisión (Es solicitud), Rechazados (Es solicitud)
  const visibleProjects = mockProjects.filter((p) => 
    p.status !== 'Borrador' && 
    p.status !== 'En revisión' && 
    p.status !== 'Rechazado con retroalimentación'
  );

  // 2. FILTRO DE BÚSQUEDA Y ESTADO (UI)
  const filteredProjects = visibleProjects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.solicitante.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Función auxiliar para colores de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En desarrollo': return 'bg-green-100 text-green-800 border-green-200';
      case 'En lista de espera': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finalizado': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Directorio de Proyectos</h1>
        <p className="text-muted-foreground">
          Administra los proyectos activos, finalizados y en espera.
        </p>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full md:w-96">
          {/* Usamos top-1/2 y -translate-y-1/2 para centrar verticalmente exacto */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {/* Aumentamos a pl-10 para que el texto no toque la lupa */}
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
              <SelectItem value="En lista de espera">En lista de espera</SelectItem>
              <SelectItem value="En desarrollo">En desarrollo</SelectItem>
              <SelectItem value="Finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="border rounded-lg bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Proyecto</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Alumnos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{project.category}</div>
                  </TableCell>
                  <TableCell>{project.solicitante.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {project.studentsEnrolled?.length || 0} / {project.studentLimit}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/administrador/proyectos/${project.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Detalles
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
