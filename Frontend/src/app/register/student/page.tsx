"use client";

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

const municipalities = [
  "Apozol", "Apulco", "Atolinga", "Benito Juárez", "Calera", "Cañitas de Felipe Pescador",
  "Concepción del Oro", "Cuauhtémoc", "Chalchihuites", "Fresnillo", "Trinidad García de la Cadena",
  "Genaro Codina", "General Enrique Estrada", "General Francisco R. Murguía", "El Plateado de Joaquín Amaro",
  "General Pánfilo Natera", "Guadalupe", "Huanusco", "Jalpa", "Jerez", "Jiménez del Teul", "Juan Aldama",
  "Juchipila", "Loreto", "Luis Moya", "Mazapil", "Melchor Ocampo", "Mezquital del Oro", "Miguel Auza",
  "Momax", "Monte Escobedo", "Morelos", "Moyahua de Estrada", "Nochistlán de Mejía", "Noria de Ángeles",
  "Ojocaliente", "Pánuco", "Pinos", "Río Grande", "Sain Alto", "El Salvador", "Sombrerete", "Susticacán",
  "Tabasco", "Tepechitlán", "Tepetongo", "Teúl de González Ortega", "Tlaltenango de Sánchez Román",
  "Valparaíso", "Vetagrande", "Villa de Cos", "Villa García", "Villa González Ortega", "Villa Hidalgo",
  "Villanueva", "Zacatecas", "Trancoso", "Santa María de la Paz"
];

const majors = [
  "Ingeniería en Computación", "Ingeniería Civil", "Ingeniería Industrial", "Ingeniería Mecatrónica",
  "Ingeniería Electrónica", "Ingeniería en Energías Renovables", "Ingeniería en Sistemas",
  "Medicina", "Psicología","Economía", "Arquitectura", "Diseño Gráfico", "Diseño Industrial", "Comunicación", "Educación", "Ciencias Políticas", "Relaciones Internacionales",
  "Gastronomía", "Turismo", "Veterinaria", "Agronomía", "Biotecnología", "Física", "Matemáticas",
  "Química", "Lenguas Extranjeras", "Ciencias Ambientales"
];


const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre completo es requerido." }),
  email: z.string().email({ message: "Por favor, ingresa un correo válido." }),
  phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 dígitos." }),
  institution: z.string().min(1, { message: "La institución académica es requerida." }),
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
      municipality: "",
      major: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registro Exitoso",
      description: "Tu cuenta ha sido creada. Por favor, inicia sesión.",
    });
    router.push("/");
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
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="55 1234 5678" {...field} />
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
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Municipio de Procedencia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu municipio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {municipalities.map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu carrera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {majors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
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
                    <Input type="password" placeholder="••••••••" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Crear Cuenta
            </Button>
          </form>
        </Form>
    </div>
  );
}