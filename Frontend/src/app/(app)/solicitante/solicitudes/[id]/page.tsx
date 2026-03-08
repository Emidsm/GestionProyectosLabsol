'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProjects, STATUS_LABELS, type ApiProject } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Clock, XCircle, MessageSquareWarning } from 'lucide-react';
import Link from 'next/link';

// Extendemos temporalmente la interfaz aquí por si no la has actualizado en api.ts
interface ProjectWithFeedback extends ApiProject {
  feedback?: { message: string; createdAt: string }[];
}

export default function SolicitanteRequestDetailsPage() {
  const params = useParams();
  const user = getUserFromCookies();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [project, setProject] = React.useState<ProjectWithFeedback | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notOwner, setNotOwner] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    getProjects()
      .then((data) => {
        const found = data.find((p) => p.id === id);
        if (!found) return;
        if (user && found.solicitanteId !== user.id) {
          setNotOwner(true);
          return;
        }
        setProject(found as ProjectWithFeedback);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  }

  if (notOwner) {
    return <div className="p-8">No tienes permiso para ver esta solicitud.</div>;
  }

  if (!project) return notFound();

  const canEdit = project.status === 'borrador' || project.status === 'rechazado';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/solicitante/solicitudes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a mis solicitudes
        </Link>
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={project.status === 'en_revision' ? 'secondary' : 'outline'}>
              {STATUS_LABELS[project.status]}
            </Badge>
          </div>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/solicitante/solicitudes/${project.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" /> Editar Solicitud
            </Link>
          </Button>
        )}
      </div>

      {/* Alerta si fue rechazado CON RETROALIMENTACIÓN */}
      {project.status === 'rechazado' && (
        <Card className="bg-red-50 border-red-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700 font-medium">
              Revisa los detalles a continuación y corrígelos para enviarlo de nuevo.
            </p>
            
            {/* Caja de comentarios del Admin */}
            {project.feedback && project.feedback.length > 0 && (
              <div className="bg-white/60 p-4 rounded-md border border-red-200/60 flex items-start gap-3">
                <MessageSquareWarning className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm mb-1">Mensaje del administrador:</h4>
                  <p className="text-red-800 text-sm whitespace-pre-line">
                    {/* Mostramos el mensaje más reciente (asumiendo que el backend los ordena o el último es el índice 0) */}
                    {project.feedback[0].message}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {project.status === 'en_revision' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Clock className="h-5 w-5" /> En Revisión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              Tu solicitud está siendo evaluada. Te notificaremos cuando haya una respuesta.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Propuesta</CardTitle>
        </CardHeader>
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
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold block">Categoría:</span>
              <span className="text-muted-foreground">{project.category}</span>
            </div>
            <div>
              <span className="font-semibold block">Duración:</span>
              <span className="text-muted-foreground">{project.timeline}</span>
            </div>
            <div>
              <span className="font-semibold block">Cupo:</span>
              <span className="text-muted-foreground">{project.studentLimit} estudiantes</span>
            </div>
            <div>
              <span className="font-semibold block">Habilidades:</span>
              <span className="text-muted-foreground">
                {project.requiredSkills.join(', ') || 'No especificadas'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
