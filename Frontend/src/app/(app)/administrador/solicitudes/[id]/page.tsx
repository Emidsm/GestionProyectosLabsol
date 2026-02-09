'use client';

import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, XCircle, User, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewSolicitudPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [feedback, setFeedback] = React.useState('');
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) notFound();

  const handleApprove = () => {
    toast({
      title: "Solicitud Aprobada",
      description: `El proyecto "${project.title}" ha pasado a Lista de Espera.`,
    });
    router.push('/administrador/solicitudes');
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Debes escribir una retroalimentación." });
      return;
    }
    toast({
      variant: "destructive",
      title: "Solicitud Rechazada",
      description: "Se ha enviado la retroalimentación al solicitante.",
    });
    router.push('/administrador/solicitudes');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/administrador/solicitudes"><ArrowLeft className="mr-2 h-4 w-4" /> Volver</Link>
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Revisión de Solicitud</h1>
          <p className="text-muted-foreground">Detalles de la propuesta enviada.</p>
        </div>
        <Badge className="text-sm px-3 py-1" variant={project.status === 'En revisión' ? 'default' : 'secondary'}>
          {project.status}
        </Badge>
      </div>

      {/* --- CORRECCIÓN: MOSTRAR MOTIVOS SI YA FUE RECHAZADA --- */}
      {project.status === 'Rechazado con retroalimentación' && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Motivos del Rechazo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 font-medium">Retroalimentación registrada:</p>
            <p className="text-red-600 mt-1 whitespace-pre-wrap">
              {project.feedback || "No se especificó una razón detallada en el sistema."}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* COLUMNA DETALLES (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Información del Proyecto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Título</Label>
                <p className="text-lg font-medium">{project.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Objetivo General</Label>
                <p className="whitespace-pre-wrap">{project.generalObjective}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descripción Detallada</Label>
                <p className="whitespace-pre-wrap text-sm">{project.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Actividades Esperadas</Label>
                <p className="whitespace-pre-wrap text-sm">{project.expectedActivities}</p>
              </div>
              <div>
                 <Label className="text-muted-foreground">Habilidades Requeridas</Label>
                 <div className="flex flex-wrap gap-2 mt-1">
                    {project.requiredSkills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA LATERAL (1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Datos del Solicitante</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{project.solicitante.name}</span>
              </div>
              <p className="text-muted-foreground ml-6">{project.solicitante.email}</p>
              <p className="text-muted-foreground ml-6">{project.solicitante.phone}</p>
              <div className="border-t pt-2 mt-2">
                <p><span className="font-semibold">Empresa:</span> {project.solicitante.company || 'N/A'}</p>
                <p><span className="font-semibold">Cargo:</span> {project.solicitante.jobTitle || 'N/A'}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href={`/administrador/usuarios/${project.solicitante.id}`}>Ver Perfil Completo</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
             <CardHeader><CardTitle className="text-lg">Logística</CardTitle></CardHeader>
             <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">{project.timeline}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Cupo:</span>
                    <span className="font-medium">{project.studentLimit} estudiantes</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="font-medium">{project.category}</span>
                </div>
             </CardContent>
          </Card>

          {/* ACCIONES DE REVISIÓN (Solo visibles si está pendiente) */}
          {project.status === 'En revisión' && (
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> Aprobar Solicitud
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" /> Rechazar...
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rechazar Solicitud</DialogTitle>
                    <DialogDescription>
                      Por favor, indica las razones del rechazo para que el solicitante pueda corregirlas.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea 
                    placeholder="Ej: El objetivo no es claro, falta definir las actividades..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button onClick={handleReject} variant="destructive">Confirmar Rechazo</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
