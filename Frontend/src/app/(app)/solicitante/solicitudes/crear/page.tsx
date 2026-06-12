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

// El solicitante solo captura nombre, resumen y descripción.
// El administrador completa el resto (categoría, duración, habilidades, cupo).
const formSchema = z.object({
  title: z.string().min(1, 'El nombre del proyecto es requerido.'),
  abstract: z.string().min(1, 'El resumen es requerido.'),
  description: z.string().min(1, 'La descripción es requerida.'),
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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, submitStatus: 'borrador' | 'en_revision') {
    setSubmitting(true);
    try {
      await createProject({
        title: values.title,
        abstract: values.abstract,
        description: values.description,
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

              <p className="text-sm text-muted-foreground bg-muted/40 border rounded-md p-3">
                Solo necesitas el nombre, el resumen y la descripción. El equipo
                administrador definirá la categoría, duración, habilidades
                requeridas y el cupo de estudiantes al revisar tu solicitud.
              </p>

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
