'use client';
import { getPendingEnrollments, reviewEnrollment } from '@/lib/api';
import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


// Tipado rápido basado en el backend que armamos
type PendingEnrollment = {
  id: string;
  enrolledAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    career: string;
    academicInstitution: string;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    title: string;
    solicitante: {
      name: string;
    };
  };
};

export default function AdminInscripcionesPage() {
  const [enrollments, setEnrollments] = React.useState<PendingEnrollment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const fetchEnrollments = async () => {
    try {
      // Ahora sí usamos tu cliente API que lee las cookies correctamente
      const data = await getPendingEnrollments(); 
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleReview = async (id: string, status: 'aceptado' | 'rechazado') => {
    try {
      // También limpiamos esta para que use la API centralizada
      const result = await reviewEnrollment(id, status);

      toast({
        title: status === 'aceptado' ? "Alumno aceptado" : "Alumno rechazado",
        description: result.message,
      });

      setEnrollments((prev) => prev.filter(e => e.id !== id));

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando inscripciones pendientes...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Inscripciones</h1>
        <p className="text-muted-foreground">
          Revisa y gestiona qué alumnos se integran a qué proyectos.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Alumnos en espera ({enrollments.length})
        </h2>

        {enrollments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="border-l-4 border-l-blue-500 shadow-sm flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Nueva Solicitud
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar>
                      <AvatarImage src={enrollment.student.avatarUrl || ''} />
                      <AvatarFallback>{enrollment.student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{enrollment.student.name}</CardTitle>
                      <CardDescription className="text-xs">{enrollment.student.career}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow text-sm">
                  <div className="bg-muted/30 p-3 rounded-md mt-2">
                    <p className="font-medium text-xs text-muted-foreground mb-1">Quiere unirse a:</p>
                    <p className="font-semibold line-clamp-2">{enrollment.project.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Líder: {enrollment.project.solicitante.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Institución: <span className="font-medium text-foreground">{enrollment.student.academicInstitution}</span>
                  </p>
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReview(enrollment.id, 'rechazado')}
                  >
                    <X className="h-4 w-4 mr-1" /> Rechazar
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleReview(enrollment.id, 'aceptado')}
                  >
                    <Check className="h-4 w-4 mr-1" /> Aceptar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border rounded-lg bg-muted/20 text-muted-foreground">
            No hay alumnos en lista de espera.
          </div>
        )}
      </div>
    </div>
  );
}
