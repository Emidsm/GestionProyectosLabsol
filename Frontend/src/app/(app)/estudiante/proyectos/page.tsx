'use client';

import * as React from 'react';
import { getProjects, enrollInProject, getMyEnrollments, type ApiProject } from '@/lib/api';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { ProjectCard } from '@/components/project-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EstudianteProjectsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  // Cambiamos el Set por un Map para guardar projectId -> status
  const [enrollmentStatuses, setEnrollmentStatuses] = React.useState<Map<string, string>>(new Map());
  const [loading, setLoading] = React.useState(true);
  
  const user = getUserFromCookies();
  const { toast } = useToast();

  React.useEffect(() => {
    Promise.all([getProjects(), getMyEnrollments()])
      .then(([projectsData, enrollmentsData]) => {
        setProjects(projectsData);
        
        // Mapeamos el ID del proyecto con el estado de la inscripción
        const statusMap = new Map<string, string>();
        enrollmentsData.forEach((e: any) => statusMap.set(e.projectId, e.status));
        setEnrollmentStatuses(statusMap);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (projectId: string) => {
    try {
      await enrollInProject(projectId);
      
      // Actualización optimista: lo metemos como 'pendiente'
      setEnrollmentStatuses(prev => new Map(prev).set(projectId, 'pendiente'));

      toast({
        title: 'Solicitud enviada',
        description: 'Tu solicitud de inscripción fue enviada correctamente.',
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  // Filtramos usando el Map
  const availableProjects = projects.filter((p) => p.status === 'validado' && !enrollmentStatuses.has(p.id));
  const myProjects = projects.filter((p) => enrollmentStatuses.has(p.id));

  const filterBySearch = (list: ApiProject[]) => list.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailable = filterBySearch(availableProjects);
  const filteredMine = filterBySearch(myProjects);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Proyectos</h1>
        <p className="text-muted-foreground">
          Explora proyectos validados o revisa el estado de tus solicitudes.
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

      <Tabs defaultValue="disponibles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
          <TabsTrigger value="mis-proyectos">Mis Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="disponibles" className="mt-6">
          {filteredAvailable.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvailable.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEnroll={() => handleEnroll(project.id)}
                  // Le pasamos el estado real ('pendiente', 'aceptado', etc.) o undefined
                  enrollmentStatus={enrollmentStatuses.get(project.id)}
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
        </TabsContent>

        <TabsContent value="mis-proyectos" className="mt-6">
          {filteredMine.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMine.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEnroll={() => handleEnroll(project.id)}
                  // Le pasamos el estado real ('pendiente', 'aceptado', etc.) o undefined
                  enrollmentStatus={enrollmentStatuses.get(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64">
              <p className="text-muted-foreground">
                Aún no has enviado solicitudes para ningún proyecto.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
