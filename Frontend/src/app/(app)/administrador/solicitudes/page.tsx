'use client';

import * as React from 'react';
import { getProjects, STATUS_LABELS, type ApiProject } from '@/lib/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, XCircle, ChevronRight } from 'lucide-react';

export default function AdminSolicitudesPage() {
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getProjects()
      .then((data) => {
        // Solo mostramos en_revision y rechazados
        const solicitudes = data.filter(
          (p) => p.status === 'en_revision' || p.status === 'rechazado'
        );
        setProjects(solicitudes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const pendientes = projects.filter((p) => p.status === 'en_revision');
  const rechazadas = projects.filter((p) => p.status === 'rechazado');

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando solicitudes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error al cargar solicitudes: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Solicitudes</h1>
        <p className="text-muted-foreground">
          Revisa las nuevas propuestas y consulta el historial de rechazos.
        </p>
      </div>

      {/* SECCIÓN 1: PENDIENTES */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          Pendientes de revisión ({pendientes.length})
        </h2>

        {pendientes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendientes.map((project) => (
              <Card
                key={project.id}
                className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      Requiere Acción
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription>por {project.solicitante.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.abstract || project.description}
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

      {/* SECCIÓN 2: RECHAZADAS */}
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
                  <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-700 hover:bg-red-100 border-0 w-fit"
                  >
                    Rechazado
                  </Badge>
                  <CardTitle className="mt-2 text-lg line-clamp-1 text-muted-foreground">
                    {project.title}
                  </CardTitle>
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
