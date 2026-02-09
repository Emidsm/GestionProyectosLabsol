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
import type { Project } from "@/lib/types";
import { ProjectStatusBadge } from "./project-status-badge";
import { ArrowRight, Calendar, Users, Briefcase } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-2">
            <Link href={`/estudiante/proyectos/${project.id}`} className="hover:underline">
              {project.title}
            </Link>
          </CardTitle>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={project.solicitante.avatarUrl} />
            <AvatarFallback>
                {project.solicitante.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{project.solicitante.name}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">
          {project.abstract}
        </CardDescription>
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
                <span>{project.studentsEnrolled.length} / {project.studentLimit} Estudiantes</span>
            </div>
        </div>
        <Link href={`/estudiante/proyectos/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
