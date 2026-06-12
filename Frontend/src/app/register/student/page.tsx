"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getCarreras,
  getEstados,
  getMunicipios,
  type ApiCarrera,
  type ApiEstado,
  type ApiMunicipio,
} from "@/lib/api";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";

// Datos de ejemplo para los combobox
const institutions = [
  "Universidad Autónoma de Zacatecas (UAZ)",
  "Instituto Tecnológico de Zacatecas (ITZ)",
  "Universidad Tecnológica del Estado de Zacatecas (UTZAC)",
  "Escuela Normal Manuel Ávila Camacho",
  "Universidad Interamericana para el Desarrollo (UNID) - Zacatecas",
  "Universidad de la Vera-Cruz",
  "Universidad del Desarrollo Profesional (UNIDEP)",
];

const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre completo es requerido." }),
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }),
  // Validación de 10 dígitos exactos y solo números
  phone: z
    .string()
    .length(10, { message: "El teléfono debe tener exactamente 10 dígitos." })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números." }),
  institution: z.string().min(1, { message: "La institución académica es requerida." }),
  estado: z.string().min(1, { message: "El estado es requerido." }),
  municipality: z.string().min(1, { message: "El municipio es requerido." }),
  major: z.string().min(1, { message: "La carrera es requerida." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  confirmPassword: z.string().min(8, { message: "La confirmación de contraseña es requerida." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function StudentRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      institution: "",
      estado: "",
      municipality: "",
      major: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  // Catálogos cargados desde el backend (carreras dinámicas + INEGI).
  const [carreras, setCarreras] = React.useState<ApiCarrera[]>([]);
  const [estados, setEstados] = React.useState<ApiEstado[]>([]);
  const [municipios, setMunicipios] = React.useState<ApiMunicipio[]>([]);

  React.useEffect(() => {
    getCarreras().then((data) => setCarreras(data.filter((c) => c.isActive))).catch(() => {});
    getEstados().then(setEstados).catch(() => {});
  }, []);

  // Cuando cambia el estado seleccionado, cargamos sus municipios.
  const selectedEstado = form.watch("estado");
  React.useEffect(() => {
    if (!selectedEstado) {
      setMunicipios([]);
      return;
    }
    const estado = estados.find((e) => e.nombre === selectedEstado);
    if (!estado) return;
    getMunicipios(estado.id).then(setMunicipios).catch(() => setMunicipios([]));
  }, [selectedEstado, estados]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          password: values.password,
          role: "estudiante",
          phone: values.phone,
          academicInstitution: values.institution, // Mapeado a Prisma
          estado: values.estado,                    // Mapeado a Prisma (INEGI)
          municipality: values.municipality,        // Mapeado a Prisma (INEGI)
          career: values.major                      // Mapeado a Prisma
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar la cuenta.");
      }

      toast({
        title: "Registro Exitoso",
        description: "Tu cuenta ha sido creada. Por favor, inicia sesión.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message,
      });
    }
  }

  return (
    <div>
        <p className="text-muted-foreground text-center mb-6">
            Regístrate como estudiante para encontrar y postularte a proyectos emocionantes.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-card p-8 rounded-lg shadow-sm border"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan.perez@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
		  control={form.control}
		  name="phone"
		  render={({ field }) => (
		    <FormItem>
		      <FormLabel>Teléfono (10 dígitos)</FormLabel>
		      <FormControl>
			<Input 
			  type="tel" 
			  placeholder="4921234567" 
			  {...field} 
			  // Limpiamos la entrada para permitir solo números en tiempo real
			  onChange={(e) => {
			    const value = e.target.value.replace(/\D/g, "");
			    field.onChange(value.slice(0, 10)); // Limitamos a 10 caracteres
			  }}
			/>
		    </FormControl>
		   <FormMessage />
		</FormItem>
		)}
	    />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institución Académica</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu institución" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {institutions.map((institution) => (
                        <SelectItem key={institution} value={institution}>
                          {institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Al cambiar de estado reiniciamos el municipio.
                      form.setValue("municipality", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.id} value={estado.nombre}>
                          {estado.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipio de Procedencia</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedEstado}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedEstado ? "Selecciona tu municipio" : "Primero elige un estado"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {municipios.map((m) => (
                        <SelectItem key={m.id} value={m.nombre}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu carrera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carreras.map((c) => (
                        <SelectItem key={c.id} value={c.nombre}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>
        </Form>
    </div>
  );
}
