'use client';

import * as React from 'react';
import { mockProjects } from '@/lib/mock-data';
import { ProjectCard } from '@/components/project-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { User } from '@/lib/types'; // Asegúrate de importar el tipo
import { getUserFromCookies } from '@/lib/cookie-utils';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // Obtenemos el usuario de manera segura en el cliente
    const u = getUserFromCookies();
    setUser(u);
  }, []);

  // 1. Proyectos Disponibles (Buscador)
  const availableProjects = mockProjects.filter(
    (p) => p.status === 'En lista de espera'
  );

  const filteredProjects = availableProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Proyectos Inscritos (Corrección del Bug)
  // Filtramos proyectos donde el array de estudiantes inscritos incluya al usuario actual
  const myProjects = user 
    ? mockProjects.filter(p => p.studentsEnrolled?.some(student => student.id === user.id))
    : [];

  return (
    <div className="space-y-12">
      
      {/* SECCIÓN: MIS PROYECTOS (Nueva) */}
      {user && (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline border-b pb-2">Mis Proyectos Inscritos</h2>
            {myProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myProjects.map((project) => (
                         // Nota: Podrías querer un componente distinto para "Mis proyectos" con estado de progreso
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="bg-muted/30 p-6 rounded-lg border text-center">
                    <p className="text-muted-foreground">No estás inscrito en ningún proyecto aún.</p>
                </div>
            )}
        </div>
      )}

      {/* SECCIÓN: EXPLORADOR */}
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Explorar Proyectos</h1>
            <p className="text-muted-foreground">
            Encuentra nuevos proyectos aprobados y únete al equipo.
            </p>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Buscar por título, categoría o palabra clave..."
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
