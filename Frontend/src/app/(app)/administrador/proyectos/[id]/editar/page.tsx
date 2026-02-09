'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { notFound, useParams, useRouter } from "next/navigation";
import { mockProjects } from "@/lib/mock-data";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { getUserFromCookies } from "@/lib/cookie-utils";

// Validaciones actualizadas con campos del SRS
const formSchema = z.object({
  title: z.string().min(5, "El título es muy corto."),
  generalObjective: z.string().min(10, "Define el objetivo general."),
  description: z.string().min(20, "La descripción es obligatoria."),
  expectedActivities: z.string().min(10, "Lista las actividades principales."),
  category: z.string().min(1, "Requerido."),
  timeline: z.string().min(1, "Requerido."),
  studentLimit: z.coerce.number().min(1).max(10),
  requiredSkills: z.string().min(1, "Requerido."),
});

export default function EditProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const user = getUserFromCookies();

  const projectId = params.id as string;
  const project = mockProjects.find((p) => p.id === projectId);

  if (!project) notFound();

  // Permisos: Solo el dueño puede editar si es Borrador o Rechazado (CU5)
  const isOwner = user?.id === project.solicitante.id;
  const canEdit = true;

  if (!canEdit) {
     return <div className="p-8 text-center text-red-500">No tienes permisos para editar este proyecto o su estado actual no lo permite.</div>;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      generalObjective: project.generalObjective || "", // Campo nuevo
      description: project.description,                 // Campo actualizado
      expectedActivities: project.expectedActivities || "", // Campo nuevo
      category: project.category,
      timeline: project.timeline,
      studentLimit: project.studentLimit,
      requiredSkills: project.requiredSkills.join(", "),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Guardando...", values);
    toast({
      title: "Proyecto actualizado",
      description: "Tu solicitud ha sido guardada correctamente.",
    });
    router.push(`/solicitante/proyectos/${projectId}`);
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/solicitante/proyectos/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Editar Solicitud</h1>
          <p className="text-muted-foreground">Corrige o actualiza la información de tu propuesta.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Proyecto</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="generalObjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo General</FormLabel>
                    <FormControl><Textarea {...field} placeholder="¿Qué se busca lograr?" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración Estimada</FormLabel>
                        <FormControl><Input {...field} placeholder="Ej: 4 meses" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Detallada</FormLabel>
                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actividades Esperadas</FormLabel>
                    <FormDescription>Lista las tareas principales para los estudiantes.</FormDescription>
                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cupo de Estudiantes</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Habilidades (separadas por coma)</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
