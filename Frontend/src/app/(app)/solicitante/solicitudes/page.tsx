'use client';

import * as React from 'react';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Asegúrate de tener este componente o usa un span con clases
import type { User } from '@/lib/types';
import Link from 'next/link';

export default function SolicitudesPage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('proconecta_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  // Filtrar todos los proyectos de este solicitante
  const userProjects = mockProjects.filter(
    (p) => p.solicitante.id === currentUser.id
  );

  // Clasificación de proyectos
  const draftProjects = userProjects.filter((p) => p.status === 'Borrador');
  
  const rejectedProjects = userProjects.filter(
    (p) => p.status === 'Rechazado con retroalimentación'
  );
  
  const activeProjects = userProjects.filter((p) => 
    ['En desarrollo', 'En lista de espera', 'En revisión'].includes(p.status)
  );

  const finishedProjects = userProjects.filter((p) => p.status === 'Finalizado');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Mis Solicitudes
        </h1>
        <p className="text-muted-foreground">
          Gestione sus proyectos enviados, activos y el historial.
        </p>
      </div>

      {/* --- SECCIÓN: EN PROCESO / ACTIVOS --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Solicitudes Activas</h2>
        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {/* Badge manual si no tienes el componente */}
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground line-clamp-3">
                     {project.abstract}
                   </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/solicitante/proyectos/${project.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No hay solicitudes activas.</p>
        )}
      </div>

      {/* --- SECCIÓN: BORRADORES --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Borradores</h2>
        {draftProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {draftProjects.map((project) => (
              <Card key={project.id} className="opacity-80 hover:opacity-100 transition-opacity">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/solicitante/proyectos/${project.id}/editar`}>Continuar Editando</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No tiene borradores.</p>
        )}
      </div>

      {/* --- SECCIÓN: RECHAZADAS --- */}
      {rejectedProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-red-600">Requieren Atención</h2>
          <div className="space-y-4">
            {rejectedProjects.map((project) => (
              <Card key={project.id} className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-red-800">Retroalimentación:</p>
                  <p className="text-red-700">
                    Revisar la sección de presupuesto y objetivos. Falta detalle en el cronograma.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" asChild>
                    <Link href={`/solicitante/proyectos/${project.id}/editar`}>Corregir</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- SECCIÓN: FINALIZADOS --- */}
      {finishedProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Historial Finalizado</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {finishedProjects.map((project) => (
              <Card key={project.id} className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-slate-600">{project.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button variant="secondary" asChild className="w-full">
                    <Link href={`/solicitante/proyectos/${project.id}`}>Ver Resultados</Link>
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
