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
import { setUserCookie } from "@/lib/cookie-utils";

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

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Pequeño delay artificial para UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === values.email);

    if (user) {
      // 🔒 SEGURIDAD: Separamos la contraseña para NO guardarla
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userSafe } = user;

      // Usamos la utilidad centralizada
      setUserCookie(userSafe as any);

      toast({
        title: "Inicio de Sesión Exitoso",
        description: `¡Bienvenido, ${user.name}! Redirigiendo...`,
      });
      
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
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image 
            src="/images/logo.png" 
            alt="Logo" 
            width={300} 
            height={75}
            priority
            className="mb-4"
          />
          <h1 className="text-3xl font-bold font-headline text-center">
            Sistema de Proyectos
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Inicia sesión para gestionar o inscribirte en proyectos.
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
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
