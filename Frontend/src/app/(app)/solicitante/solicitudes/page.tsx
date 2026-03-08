'use client';

import * as React from 'react';
import { getProjects, STATUS_LABELS, type ApiProject } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function SolicitudesPage() {
  const currentUser = getUserFromCookies();
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!currentUser) return;
    getProjects()
      .then((data) => {
        // Solo los proyectos del solicitante actual
        setProjects(data.filter((p) => p.solicitanteId === currentUser.id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Cargando solicitudes...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">Error: {error}</div>;
  }

  const draftProjects = projects.filter((p) => p.status === 'borrador');
  const rejectedProjects = projects.filter((p) => p.status === 'rechazado');
  const activeProjects = projects.filter((p) =>
    ['en_curso', 'validado', 'en_revision'].includes(p.status)
  );
  const finishedProjects = projects.filter((p) => p.status === 'finalizado');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Mis Solicitudes</h1>
        <p className="text-muted-foreground">
          Gestione sus proyectos enviados, activos y el historial.
        </p>
      </div>

      {/* ACTIVOS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Solicitudes Activas</h2>
        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800 whitespace-nowrap ml-2">
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.abstract || project.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/solicitante/solicitudes/${project.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No hay solicitudes activas.</p>
        )}
      </div>

      {/* BORRADORES */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Borradores</h2>
        {draftProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {draftProjects.map((project) => (
              <Card
                key={project.id}
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/solicitante/solicitudes/${project.id}/editar`}>
                      Continuar Editando
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No tiene borradores.</p>
        )}
      </div>

      {/* RECHAZADOS */}
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
                  <p className="font-semibold text-red-800 text-sm">
                    Este proyecto fue rechazado por un administrador.
                  </p>
                </CardContent>
                <CardFooter>
                  {/* CAMBIO: Ahora manda a los detalles, no directo a editar */}
                  <Button variant="destructive" asChild>
                    <Link href={`/solicitante/solicitudes/${project.id}`}>
                      Ver motivos
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FINALIZADOS */}
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
                    <Link href={`/solicitante/solicitudes/${project.id}`}>
                      Ver Resultados
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
