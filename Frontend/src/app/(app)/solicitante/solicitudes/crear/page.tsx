
"use client";

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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(1, "El nombre del proyecto es requerido."),
  objective: z.string().min(1, "El objetivo general es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  expectedActivities: z.string().min(1, "Las actividades esperadas son requeridas."),
});

export default function CreateProjectPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      objective: "",
      description: "",
      expectedActivities: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would save this to the database.
    // We'll just log it and show a toast.
    console.log(values);
    toast({
      title: "Borrador Guardado",
      description: "Su solicitud de proyecto ha sido guardada como borrador.",
    });
    router.push("/solicitante/solicitudes");
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="text-center font-headline text-2xl">Solicitud de proyecto</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    name="objective"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Objetivo general</FormLabel>
                        <FormControl>
                            <Input {...field} />
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
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                            <Textarea className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="expectedActivities"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Actividades esperadas</FormLabel>
                        <FormControl>
                           <Textarea className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full">
                        Guardar Borrador
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
