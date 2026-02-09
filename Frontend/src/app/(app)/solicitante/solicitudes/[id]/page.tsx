'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Clock, XCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getUserFromCookies } from '@/lib/cookie-utils';

export default function SolicitanteRequestDetailsPage() {
  const params = useParams();
  const user = getUserFromCookies();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) notFound();

  // Seguridad básica: solo el dueño ve esto
  if (user?.id !== project.solicitante.id) {
    return <div className="p-8">No tienes permiso para ver esta solicitud.</div>;
  }

  // Permitir edición solo si es Borrador o Rechazado
  const canEdit = project.status === 'Borrador' || project.status === 'Rechazado con retroalimentación';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/solicitante/solicitudes"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a mis solicitudes</Link>
      </Button>

      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
            <div className="mt-2 flex items-center gap-2">
                <Badge variant={project.status === 'En revisión' ? 'secondary' : 'outline'}>
                    {project.status}
                </Badge>
            </div>
         </div>
         {canEdit && (
             <Button asChild>
                 {/* Apuntamos a la ruta de edición dentro de solicitudes */}
                 <Link href={`/solicitante/solicitudes/${project.id}/editar`}>
                    <Edit className="mr-2 h-4 w-4" /> Editar Solicitud
                 </Link>
             </Button>
         )}
      </div>

      {project.feedback && (
          <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                      <XCircle className="h-5 w-5" /> Atención Requerida
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-red-700 font-medium">Retroalimentación del administrador:</p>
                  <p className="text-red-600 mt-1 text-sm">{project.feedback}</p>
              </CardContent>
          </Card>
      )}

      {project.status === 'En revisión' && (
          <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                      <Clock className="h-5 w-5" /> En Revisión
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-yellow-700 text-sm">
                      Tu solicitud está siendo evaluada por un administrador. Te notificaremos cuando haya una respuesta.
                  </p>
              </CardContent>
          </Card>
      )}

      <Card>
          <CardHeader><CardTitle>Detalles de la Propuesta</CardTitle></CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="font-semibold mb-1">Objetivo General</h3>
                  <p className="text-muted-foreground">{project.generalObjective}</p>
              </div>
              <Separator />
              <div>
                  <h3 className="font-semibold mb-1">Descripción</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
              </div>
              <Separator />
              <div>
                  <h3 className="font-semibold mb-1">Actividades Esperadas</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{project.expectedActivities}</p>
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
                      <span className="text-muted-foreground">{project.requiredSkills.join(', ')}</span>
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
