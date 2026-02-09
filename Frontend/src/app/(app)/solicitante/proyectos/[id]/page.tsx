'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

export default function SolicitanteProjectDetailsPage() {
  const params = useParams();
  const project = mockProjects.find((p) => p.id === params.id);

  if (!project) notFound();

  // Solo permitimos editar si es Borrador o Rechazado (Regla SRS CU5)
  const canEdit = project.status === 'Borrador' || project.status === 'Rechazado con retroalimentación';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/solicitante/solicitudes"><ArrowLeft className="mr-2 h-4 w-4" /> Volver mis solicitudes</Link>
      </Button>

      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
            <Badge className="mt-2">{project.status}</Badge>
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
                  <div>
                      <h3 className="font-semibold">Objetivo General</h3>
                      <p className="text-muted-foreground">{project.generalObjective}</p>
                  </div>
                  <div>
                      <h3 className="font-semibold">Descripción</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  <div>
                      <h3 className="font-semibold">Actividades Esperadas</h3>
                      <p className="text-muted-foreground">{project.expectedActivities}</p>
                  </div>
              </CardContent>
          </Card>

          <div className="space-y-6">
              {project.feedback && (
                  <Card className="bg-red-50 border-red-200">
                      <CardHeader><CardTitle className="text-red-800">Retroalimentación</CardTitle></CardHeader>
                      <CardContent>
                          <p className="text-red-700 text-sm">{project.feedback}</p>
                      </CardContent>
                  </Card>
              )}
              
              <Card>
                  <CardHeader><CardTitle>Estado del Equipo</CardTitle></CardHeader>
                  <CardContent>
                      <p className="text-2xl font-bold">{project.studentsEnrolled.length} / {project.studentLimit}</p>
                      <p className="text-sm text-muted-foreground">Estudiantes inscritos</p>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
