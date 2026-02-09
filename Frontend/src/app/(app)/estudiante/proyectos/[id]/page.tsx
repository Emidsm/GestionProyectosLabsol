'use client';

import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getUserFromCookies } from '@/lib/cookie-utils';

export default function StudentProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const user = getUserFromCookies();
  
  const project = mockProjects.find((p) => p.id === params.id);

  if (!project) notFound();

  // Lógica de validación para inscripción (SRS)
  const isEnrolled = project.studentsEnrolled.some(s => s.id === user?.id);
  const isFull = project.studentsEnrolled.length >= project.studentLimit;
  const canJoin = project.status === 'En lista de espera' && !isEnrolled && !isFull;

  const handleInscripcion = () => {
    // Aquí iría la llamada a tu API para inscribir al alumno
    toast({
      title: "Solicitud enviada",
      description: `Te has inscrito exitosamente al proyecto "${project.title}".`,
    });
    router.push('/estudiante/proyectos');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/estudiante/proyectos"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo</Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-sm text-muted-foreground px-2 border-l">
              Publicado el {new Date(project.createdAt || '').toLocaleDateString('es-MX')}
            </span>
          </div>
        </div>
        
        {/* BOTÓN DE ACCIÓN (CU8) */}
        <div className="w-full md:w-auto">
            {isEnrolled ? (
                <Button disabled className="w-full bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                    <CheckCircle className="mr-2 h-4 w-4" /> Ya estás inscrito
                </Button>
            ) : canJoin ? (
                <Button onClick={handleInscripcion} className="w-full">
                    Solicitar Inscripción
                </Button>
            ) : (
                <Button disabled variant="secondary" className="w-full">
                    {isFull ? "Cupo Lleno" : "No disponible para inscripción"}
                </Button>
            )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Detalles del Proyecto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                 <h3 className="font-semibold text-lg mb-1">Objetivo General</h3>
                 <p className="text-muted-foreground">{project.generalObjective}</p>
              </div>
              <Separator />
              <div>
                 <h3 className="font-semibold text-lg mb-1">Descripción</h3>
                 <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
              </div>
              <Separator />
              <div>
                 <h3 className="font-semibold text-lg mb-1">Actividades a Realizar</h3>
                 <p className="text-muted-foreground whitespace-pre-line">{project.expectedActivities}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Requisitos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
               </div>
               <div className="space-y-3 pt-2 text-sm">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" /> Cupo
                      </div>
                      <span className="font-medium">{project.studentsEnrolled.length} / {project.studentLimit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" /> Duración
                      </div>
                      <span className="font-medium">{project.timeline}</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader><CardTitle className="text-lg">Solicitante</CardTitle></CardHeader>
             <CardContent>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {project.solicitante.name[0]}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{project.solicitante.name}</p>
                        <p className="text-xs text-muted-foreground">{project.solicitante.email}</p>
                    </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
