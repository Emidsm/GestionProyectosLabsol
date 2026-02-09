"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/lib/mock-data";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const user = mockUsers.find((u) => u.email === values.email);

    if (user) {
      // Set cookie instead of localStorage for server-side access
      document.cookie = `proconecta_user=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=Strict`;
      
      // Keep localStorage for backward compatibility (optional)
      localStorage.setItem("proconecta_user", JSON.stringify(user));

      toast({
        title: "Inicio de Sesión Exitoso",
        description: `¡Bienvenido, ${user.name}! Redirigiendo...`,
      });
      
      // Redirect based on role - middleware will handle the rest
      if (user.role === 'administrator') {
        router.push("/administrador/solicitudes");
      } else if (user.role === 'solicitante') {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Inicio de Sesión Fallido",
        description: "Correo o contraseña inválidos. Por favor, intenta de nuevo.",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image 
            src="/images/logo.png" 
            alt="Logo" 
            width={300} 
            height={75}
            priority
          />
          <h1 className="mt-4 text-3xl font-bold font-headline text-center">
            Bienvenido al Sistema de Proyectos
          </h1>
          <p className="text-muted-foreground text-center">
            Inicia sesión para conectarte con proyectos de impacto.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-card p-8 rounded-lg shadow-sm border"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register/student"
              className="font-medium text-primary hover:underline"
            >
              Regístrate como Estudiante
            </Link>{" "}
            o{" "}
            <Link
              href="/register/solicitante"
              className="font-medium text-primary hover:underline"
            >
              como Solicitante
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
