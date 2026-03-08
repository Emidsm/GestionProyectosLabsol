'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getProjects, updateProject, forceEnrollStudent, type ApiProject } from '@/lib/api';
import { getUserFromCookies, getTokenFromCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, ShieldAlert, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(5, 'El título es muy corto.'),
  abstract: z.string().min(5, 'El resumen es requerido.'),
  description: z.string().min(20, 'La descripción es obligatoria.'),
  category: z.string().min(1, 'Requerido.'),
  timeline: z.string().min(1, 'Requerido.'),
  studentLimit: z.coerce.number().min(1).max(20),
  requiredSkills: z.string().min(1, 'Requerido.'),
  status: z.enum(['borrador', 'en_revision']),
});

interface EditProjectPageProps {
  /** 'solicitante' redirige a /solicitante/proyectos/:id  |  'admin' redirige a /administrador/proyectos/:id */
  role?: 'solicitante' | 'admin';
}

export default function EditProjectPage({ role = 'solicitante' }: EditProjectPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const user = getUserFromCookies();

  const projectId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [project, setProject] = React.useState<ApiProject | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // Estados para el God Mode
  const [enrollEmail, setEnrollEmail] = React.useState('');
  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '', abstract: '', description: '',
      category: '', timeline: '', studentLimit: 4,
      requiredSkills: '', status: 'borrador',
    },
  });

  React.useEffect(() => {
    if (!projectId) return;
    getProjects()
      .then((projects) => {
        const found = projects.find((p) => p.id === projectId);
        if (!found) return;
        setProject(found);
        form.reset({
          title: found.title,
          abstract: found.abstract || '',
          description: found.description,
          category: found.category,
          timeline: found.timeline,
          studentLimit: found.studentLimit,
          requiredSkills: found.requiredSkills.join(', '),
          status: (found.status === 'borrador' || found.status === 'en_revision')
            ? found.status : 'borrador',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId, form]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  if (!project) return notFound();

  // Permiso: solo el dueño puede editar si está en borrador/rechazado (admins pueden siempre)
  const isOwner = user?.id === project.solicitanteId;
  const canEdit = role === 'admin' || (isOwner && (project.status === 'borrador' || project.status === 'rechazado'));

  if (!canEdit) {
    return (
      <div className="p-8 text-center text-red-500">
        No tienes permisos para editar este proyecto o su estado actual no lo permite.
      </div>
    );
  }

  const backHref = role === 'admin'
    ? `/administrador/proyectos/${projectId}`
    : `/solicitante/proyectos/${projectId}`;

  async function onSubmit(values: z.infer<typeof formSchema>, submitStatus: 'borrador' | 'en_revision') {
    setSubmitting(true);
    try {
      const skills = values.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await updateProject(projectId, {
        title: values.title,
        abstract: values.abstract,
        description: values.description,
        category: values.category,
        timeline: values.timeline,
        studentLimit: values.studentLimit,
        requiredSkills: skills,
        status: submitStatus,
      });
      toast({
        title: submitStatus === 'borrador' ? 'Borrador guardado' : 'Enviado a revisión',
        description: 'Los cambios se guardaron correctamente.',
      });
      router.push(backHref);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================================================
  // FUNCIONES DEL GOD MODE (Solo Admin)
  // =========================================================================

  const handleDeleteProject = async () => {
    if (!window.confirm("¿ESTÁS SEGURO DE ELIMINAR ESTE PROYECTO? Esta acción es irreversible y borrará las inscripciones relacionadas.")) return;
    setIsDeleting(true);
    try {
      const token = getTokenFromCookies();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al eliminar el proyecto.');
      }
      toast({ title: 'Proyecto eliminado', description: 'El proyecto fue borrado del sistema.' });
      router.push('/administrador/proyectos');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error al eliminar', description: err.message });
      setIsDeleting(false);
    }
  };

  const handleForceEnroll = async () => {
    if (!enrollEmail) {
      toast({ variant: 'destructive', title: 'Atención', description: 'Debes ingresar un correo electrónico.' });
      return;
    }
    setIsEnrolling(true);
    try {
      await forceEnrollStudent({ projectId, email: enrollEmail.trim() });
      toast({ title: 'Inscripción forzada exitosa', description: `El alumno con correo ${enrollEmail} ha sido añadido al proyecto.` });
      setEnrollEmail('');
      setIsEnrollDialogOpen(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error al inscribir', description: err.message });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Editar Proyecto</h1>
          <p className="text-muted-foreground">Corrige o actualiza la información de la propuesta.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form className="space-y-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="abstract" render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl><Textarea {...field} placeholder="Resumen breve del proyecto." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="timeline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración Estimada</FormLabel>
                    <FormControl><Input {...field} placeholder="Ej: 4 meses" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Detallada</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="studentLimit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cupo de Estudiantes</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="requiredSkills" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habilidades (separadas por coma)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={form.handleSubmit((v) => onSubmit(v, 'borrador'))}
                >
                  <Save className="mr-2 h-4 w-4" /> Guardar Borrador
                </Button>
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={form.handleSubmit((v) => onSubmit(v, 'en_revision'))}
                >
                  {submitting ? 'Enviando...' : 'Enviar a Revisión'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* GOD MODE: SOLO VISIBLE PARA ADMINISTRADORES */}
      {/* ========================================================================= */}
      {role === 'admin' && (
        <Card className="border-red-200 bg-red-50 mt-8 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-900 font-headline">God Mode</h2>
            </div>
            <p className="text-sm text-red-800 mb-6">
              Estas acciones de administrador afectan directamente la base de datos y saltan las validaciones normales. Úsalas con extrema precaución.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800">
                    <UserPlus className="mr-2 h-4 w-4" /> Forzar Inscripción
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inscribir Estudiante Manualmente</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Esta acción inscribe inmediatamente a un usuario (estudiante) a este proyecto saltándose el límite de cupos y el proceso de revisión.
                    </p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Correo del estudiante</label>
                      <Input 
                        placeholder="ejemplo@correo.com" 
                        type="email" 
                        value={enrollEmail} 
                        onChange={(e) => setEnrollEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleForceEnroll} disabled={isEnrolling || !enrollEmail}>
                      {isEnrolling ? 'Inscribiendo...' : 'Inscribir Estudiante'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                variant="destructive" 
                onClick={handleDeleteProject} 
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" /> 
                {isDeleting ? 'Eliminando...' : 'Eliminar Proyecto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
