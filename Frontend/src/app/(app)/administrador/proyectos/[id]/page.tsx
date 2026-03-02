'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProjects, getProjectEnrollments, STATUS_LABELS, type ApiProject, type ApiEnrollment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Users, Edit } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  en_curso:   'bg-green-100 text-green-800 border-green-200',
  validado:   'bg-blue-100 text-blue-800 border-blue-200',
  finalizado: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function AdminProjectDetailsPage() {
  const params = useParams();
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
        setEnrollments(enr.filter((e) => e.status === 'aceptado'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  if (!project) return notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
        <Link href="/administrador/proyectos" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver al directorio
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={STATUS_COLORS[project.status] ?? ''}>
              {STATUS_LABELS[project.status]}
            </Badge>
            <span className="text-sm text-muted-foreground px-2 border-l">
              Categoría: {project.category}
            </span>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/administrador/proyectos/${project.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" /> Editar Proyecto
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {project.abstract && (
                <>
                  <div>
                    <h3 className="font-semibold mb-1">Resumen</h3>
                    <p className="text-muted-foreground">{project.abstract}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <h3 className="font-semibold mb-1">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Equipo de Estudiantes</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {enrollments.length} / {project.studentLimit} cupos
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enr) => (
                    <div key={enr.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{enr.student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{enr.student.name}</p>
                          <p className="text-xs text-muted-foreground">{enr.student.email}</p>
                          {enr.student.career && (
                            <p className="text-xs text-muted-foreground">{enr.student.career}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                  No hay estudiantes aceptados aún.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Solicitante</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                {project.solicitante.name[0]}
              </div>
              <h3 className="font-bold text-lg">{project.solicitante.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{project.solicitante.email}</p>
              {project.solicitante.company && (
                <p className="text-xs text-muted-foreground mb-4">{project.solicitante.company}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Detalles</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Duración
                </span>
                <span className="font-medium">{project.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" /> Cupo
                </span>
                <span className="font-medium">{project.studentLimit}</span>
              </div>
              <div className="pt-2">
                <p className="font-semibold mb-2">Habilidades:</p>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
