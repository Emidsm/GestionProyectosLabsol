'use client';

import * as React from 'react';
import { getProjects, enrollInProject, type ApiProject } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { ProjectCard } from '@/components/project-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EstudianteProjectsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const user = getUserFromCookies();
  const { toast } = useToast();

  React.useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Proyectos disponibles para inscribirse (validado = en lista de espera)
  const availableProjects = projects.filter((p) => p.status === 'validado');

  const filteredProjects = availableProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * NOTA: El backend no incluye la lista de studentsEnrolled en GET /api/projects.
   * Para saber si el estudiante ya está inscrito en un proyecto, necesitarías llamar
   * GET /api/enrollments/project/:projectId por cada proyecto (costoso) o agregar
   * un endpoint GET /api/enrollments/my en el backend.
   * 
   * Por ahora mostramos todos los proyectos disponibles sin distinguir si ya está inscrito.
   */

  const handleEnroll = async (projectId: string) => {
    try {
      await enrollInProject(projectId);
      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud de inscripción fue enviada correctamente.',
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-12">
      {/* SECCIÓN: EXPLORADOR */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Explorar Proyectos</h1>
          <p className="text-muted-foreground">
            Encuentra proyectos aprobados y únete al equipo.
          </p>
        </div>

        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título, categoría..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEnroll={() => handleEnroll(project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64">
            <p className="text-muted-foreground">
              No se encontraron proyectos disponibles con esa búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
