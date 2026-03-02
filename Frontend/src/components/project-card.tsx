import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusBadge } from "./project-status-badge";
import { ArrowRight, Calendar, Users, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ApiProject } from "@/lib/api";
import type { Project } from "@/lib/types";

/**
 * ProjectCard acepta tanto el tipo viejo (Project del mock) como el nuevo (ApiProject del backend).
 * Una vez que elimines el mock-data completamente, puedes quedarte solo con ApiProject.
 */
interface ProjectCardProps {
  project: Project | ApiProject;
  /** Callback opcional para inscribirse desde el catálogo de estudiante */
  onEnroll?: () => void;
}

// Helper: determina si es el tipo nuevo del backend
function isApiProject(p: Project | ApiProject): p is ApiProject {
  return 'solicitanteId' in p;
}

export function ProjectCard({ project, onEnroll }: ProjectCardProps) {
  const solicitanteName = isApiProject(project)
    ? project.solicitante.name
    : project.solicitante.name;

  const solicitanteAvatar = isApiProject(project)
    ? undefined
    : (project.solicitante as any).avatarUrl;

  const abstract = isApiProject(project)
    ? project.abstract || project.description
    : (project as any).abstract || project.description;

  // studentsEnrolled no existe en ApiProject (el backend no lo expone en el listado)
  const enrolledCount = isApiProject(project)
    ? null
    : (project as Project).studentsEnrolled?.length ?? 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-2">
            <Link
              href={`/estudiante/proyectos/${project.id}`}
              className="hover:underline"
            >
              {project.title}
            </Link>
          </CardTitle>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            {solicitanteAvatar && (
              <img src={solicitanteAvatar} alt={solicitanteName} />
            )}
            <AvatarFallback>{solicitanteName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{solicitanteName}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{abstract}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.requiredSkills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4">
        <div className="w-full space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>{project.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{project.timeline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {enrolledCount !== null ? (
              <span>
                {enrolledCount} / {project.studentLimit} Estudiantes
              </span>
            ) : (
              <span>Cupo: {project.studentLimit} estudiantes</span>
            )}
          </div>
        </div>

        <div className="w-full flex gap-2">
          <Link href={`/estudiante/proyectos/${project.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          {onEnroll && (
            <Button onClick={onEnroll} className="flex-1">
              Inscribirme
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
