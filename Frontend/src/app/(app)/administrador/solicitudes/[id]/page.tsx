'use client';

import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import {
  getProjects,
  getProjectEnrollments,
  reviewProject,
  type ApiProject,
  type ApiEnrollment,
} from '@/lib/api';
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
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  AlertTriangle,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewSolicitudPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [project, setProject] = React.useState<ApiProject | null>(null);
  const [enrollments, setEnrollments] = React.useState<ApiEnrollment[]>([]);
  const [feedback, setFeedback] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  React.useEffect(() => {
    if (!id) return;

    Promise.all([
      getProjects(),
      getProjectEnrollments(id),
    ])
      .then(([projects, enr]) => {
        const found = projects.find((p) => p.id === id);
        if (!found) return;
        setProject(found);
        setEnrollments(enr);
      })
      .catch((err) => {
        toast({ variant: 'destructive', title: 'Error', description: err.message });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!project) return;
    setSubmitting(true);
    try {
      await reviewProject(project.id, { status: 'validado' });
      toast({
        title: 'Solicitud Aprobada',
        description: `"${project.title}" ha pasado a Lista de Espera.`,
      });
      router.push('/administrador/solicitudes');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!project) return;
    if (!feedback.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes escribir una retroalimentación.',
      });
      return;
    }
    setSubmitting(true);
    try {
      await reviewProject(project.id, {
        status: 'rechazado',
        feedbackMessage: feedback,
      });
      toast({
        variant: 'destructive',
        title: 'Solicitud Rechazada',
        description: 'Se ha enviado la retroalimentación al solicitante.',
      });
      router.push('/administrador/solicitudes');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  }

  if (!project) return notFound();

  const statusLabel =
    project.status === 'en_revision'
      ? 'En revisión'
      : project.status === 'rechazado'
      ? 'Rechazado'
      : project.status === 'validado'
      ? 'Validado'
      : project.status;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/administrador/solicitudes">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Revisión de Solicitud</h1>
          <p className="text-muted-foreground">Detalles de la propuesta enviada.</p>
        </div>
        <Badge
          className="text-sm px-3 py-1"
          variant={project.status === 'en_revision' ? 'default' : 'secondary'}
        >
          {statusLabel}
        </Badge>
      </div>

      {/* Motivos del rechazo si ya fue rechazado */}
      {project.status === 'rechazado' && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Motivos del Rechazo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 font-medium">Retroalimentación registrada:</p>
            <p className="text-red-600 mt-1 text-sm">
              Consulta el historial de feedback del proyecto para ver los motivos detallados.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* COLUMNA DETALLES (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Título</Label>
                <p className="text-lg font-medium">{project.title}</p>
              </div>
              {project.abstract && (
                <div>
                  <Label className="text-muted-foreground">Resumen</Label>
                  <p className="text-sm">{project.abstract}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Descripción Detallada</Label>
                <p className="whitespace-pre-wrap text-sm">{project.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Habilidades Requeridas</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.requiredSkills.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inscripciones si las hay */}
          {enrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estudiantes Inscritos ({enrollments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{enr.student.name}</p>
                      <p className="text-xs text-muted-foreground">{enr.student.email}</p>
                      {enr.student.career && (
                        <p className="text-xs text-muted-foreground">{enr.student.career}</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        enr.status === 'aceptado'
                          ? 'default'
                          : enr.status === 'rechazado'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {enr.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* COLUMNA LATERAL (1/3) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos del Solicitante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{project.solicitante.name}</span>
              </div>
              <p className="text-muted-foreground ml-6">{project.solicitante.email}</p>
              {project.solicitante.company && (
                <div className="border-t pt-2 mt-2">
                  <p>
                    <span className="font-semibold">Empresa:</span>{' '}
                    {project.solicitante.company}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logística</CardTitle>
            </CardHeader>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creado:</span>
                <span className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString('es-MX')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Acciones — solo si está pendiente */}
          {project.status === 'en_revision' && (
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleApprove}
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {submitting ? 'Procesando...' : 'Aprobar Solicitud'}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={submitting}>
                    <XCircle className="mr-2 h-4 w-4" /> Rechazar...
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rechazar Solicitud</DialogTitle>
                    <DialogDescription>
                      Indica las razones del rechazo para que el solicitante pueda
                      corregirlas.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Ej: El objetivo no es claro, falta definir las actividades..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      disabled={submitting}
                    >
                      {submitting ? 'Enviando...' : 'Confirmar Rechazo'}
                    </Button>
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
