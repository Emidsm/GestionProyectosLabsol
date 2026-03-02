'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProjects, getProjectEnrollments, STATUS_LABELS, type ApiProject, type ApiEnrollment } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

export default function SolicitanteProjectDetailsPage() {
  const params = useParams();
  const user = getUserFromCookies();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = React.useState<ApiProject | null>(null);
  const [enrollments, setEnrollments] = React.useState<ApiEnrollment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    Promise.all([getProjects(), getProjectEnrollments(id)])
      .then(([projects, enr]) => {
        const found = projects.find((p) => p.id === id);
        if (found) setProject(found);
        setEnrollments(enr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  if (!project) return notFound();

  const canEdit = project.status === 'borrador' || project.status === 'rechazado';
  const accepted = enrollments.filter((e) => e.status === 'aceptado');
  const pending = enrollments.filter((e) => e.status === 'pendiente');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/solicitante/solicitudes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a mis solicitudes
        </Link>
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
          <Badge className="mt-2">{STATUS_LABELS[project.status]}</Badge>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/solicitante/proyectos/${project.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" /> Editar Solicitud
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Detalles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {project.abstract && (
              <div>
                <h3 className="font-semibold">Resumen</h3>
                <p className="text-muted-foreground">{project.abstract}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Descripción</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Estado del Equipo</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{accepted.length} / {project.studentLimit}</p>
              <p className="text-sm text-muted-foreground">Estudiantes aceptados</p>
              {pending.length > 0 && (
                <p className="text-sm text-yellow-600 mt-1">{pending.length} solicitud(es) pendiente(s)</p>
              )}
            </CardContent>
          </Card>

          {project.status === 'rechazado' && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader><CardTitle className="text-red-800">Retroalimentación</CardTitle></CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm">
                  Este proyecto fue rechazado. Edítalo y envíalo nuevamente a revisión.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lista de inscripciones si las hay */}
      {enrollments.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Solicitudes de Inscripción</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {enrollments.map((enr) => (
              <div key={enr.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium text-sm">{enr.student.name}</p>
                  <p className="text-xs text-muted-foreground">{enr.student.email}</p>
                  {enr.student.career && (
                    <p className="text-xs text-muted-foreground">{enr.student.career}</p>
                  )}
                </div>
                <Badge variant={
                  enr.status === 'aceptado' ? 'default' :
                  enr.status === 'rechazado' ? 'destructive' : 'secondary'
                }>
                  {enr.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
