'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createProject } from '@/lib/api';

const formSchema = z.object({
  title: z.string().min(1, 'El nombre del proyecto es requerido.'),
  abstract: z.string().min(1, 'El resumen es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  timeline: z.string().min(1, 'La duración es requerida.'),
  requiredSkills: z.string(), // CSV separado por comas
  studentLimit: z.coerce.number().min(1).max(20),
});

export default function CreateProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      abstract: '',
      description: '',
      category: '',
      timeline: '',
      requiredSkills: '',
      studentLimit: 4,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, submitStatus: 'borrador' | 'en_revision') {
    setSubmitting(true);
    try {
      const skills = values.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await createProject({
        title: values.title,
        abstract: values.abstract,
        description: values.description,
        category: values.category,
        timeline: values.timeline,
        requiredSkills: skills,
        studentLimit: values.studentLimit,
        status: submitStatus,
      });

      toast({
        title: submitStatus === 'borrador' ? 'Borrador Guardado' : 'Solicitud Enviada',
        description:
          submitStatus === 'borrador'
            ? 'Tu proyecto fue guardado como borrador.'
            : 'Tu solicitud fue enviada a revisión.',
      });
      router.push('/solicitante/solicitudes');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline text-2xl">
            Solicitud de proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del proyecto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumen (abstract)</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción detallada</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Tecnología, IoT..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 6 meses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habilidades requeridas</FormLabel>
                    <FormControl>
                      <Input placeholder="Python, React, IoT (separadas por comas)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cupo máximo de estudiantes</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={submitting}
                  onClick={form.handleSubmit((v) => onSubmit(v, 'borrador'))}
                >
                  Guardar Borrador
                </Button>
                <Button
                  type="button"
                  className="flex-1"
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
