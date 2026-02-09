'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Users, Briefcase, Edit, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminProjectDetailsPage() {
  const params = useParams();
  // Validamos que params.id exista y sea string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En desarrollo': return 'bg-green-100 text-green-800 border-green-200';
      case 'En lista de espera': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finalizado': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent">
        <Link href="/administrador/proyectos" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver al directorio
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">{project.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <span className="text-sm text-muted-foreground px-2 border-l">
              Categoría: {project.category}
            </span>
          </div>
        </div>
        
        <Button variant="outline" asChild>
          <Link href={`/administrador/proyectos/${project.id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Proyecto
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Equipo de Estudiantes</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {project.studentsEnrolled.length} / {project.studentLimit} cupos
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {project.studentsEnrolled.length > 0 ? (
                <div className="space-y-4">
                  {project.studentsEnrolled.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatarUrl} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                         <Link href={`/administrador/usuarios/${student.id}`}>Ver Perfil</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                  No hay estudiantes inscritos.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Solicitante</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center text-center">
               <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={project.solicitante.avatarUrl} />
                  <AvatarFallback className="text-2xl">{project.solicitante.name[0]}</AvatarFallback>
               </Avatar>
               <h3 className="font-bold text-lg">{project.solicitante.name}</h3>
               <p className="text-sm text-muted-foreground mb-4">{project.solicitante.email}</p>
               <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/administrador/usuarios/${project.solicitante.id}`}>
                    Ver perfil
                  </Link>
               </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Detalles</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Duración</span>
                <span className="font-medium">{project.timeline}</span>
              </div>
              <div className="pt-2">
                <p className="font-semibold mb-2">Habilidades:</p>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
