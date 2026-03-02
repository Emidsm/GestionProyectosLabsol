'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getProjects, updateProject, type ApiProject } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
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
  }, [projectId]);

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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Editar Solicitud</h1>
          <p className="text-muted-foreground">Corrige o actualiza la información de tu propuesta.</p>
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
    </div>
  );
}
