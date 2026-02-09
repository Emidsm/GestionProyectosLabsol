'use client';

import * as React from 'react';
import { mockProjects } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, XCircle, ChevronRight } from 'lucide-react';

export default function AdminSolicitudesPage() {
  // LOGICA: Solo mostramos lo que "pide permiso" (En revisión) o lo que se rechazó.
  // Los borradores son privados y los aceptados ya son "Proyectos".
  const solicitudes = mockProjects.filter((p) => 
    p.status === 'En revisión' || 
    p.status === 'Rechazado con retroalimentación'
  );

  const pendientes = solicitudes.filter(p => p.status === 'En revisión');
  const rechazadas = solicitudes.filter(p => p.status === 'Rechazado con retroalimentación');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Solicitudes</h1>
        <p className="text-muted-foreground">
          Revisa las nuevas propuestas y consulta el historial de rechazos.
        </p>
      </div>

      {/* SECCIÓN 1: PENDIENTES (Prioridad Alta) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          Pendientes de revisión ({pendientes.length})
        </h2>
        
        {pendientes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendientes.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Requiere Acción
                    </Badge>
                    <span className="text-xs text-muted-foreground">Hace 2 días</span>
                  </div>
                  <CardTitle className="mt-2 text-lg line-clamp-1">{project.title}</CardTitle>
                  <CardDescription>por {project.solicitante.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.abstract}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/administrador/solicitudes/${project.id}`}>
                      Revisar Propuesta
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border rounded-lg bg-muted/20 text-muted-foreground">
            No hay solicitudes pendientes por el momento.
          </div>
        )}
      </div>

      {/* SECCIÓN 2: RECHAZADAS (Historial) */}
      {rechazadas.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
            <XCircle className="h-5 w-5" />
            Rechazadas recientemente
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-80 hover:opacity-100 transition-opacity">
            {rechazadas.map((project) => (
              <Card key={project.id} className="bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                      Rechazado
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg line-clamp-1 text-muted-foreground">{project.title}</CardTitle>
                  <CardDescription>{project.solicitante.name}</CardDescription>
                </CardHeader>
                <CardFooter>
                   <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href={`/administrador/solicitudes/${project.id}`}>
                      Ver motivos <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
