'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { mockProjects } from '@/lib/mock-data';
import { getUserFromCookies } from '@/lib/cookie-utils';

export default function DashboardPage() {
  const user = getUserFromCookies();
  const finishedProjects = mockProjects.filter(p => p.status === 'Finalizado').slice(0, 3);
  const isSolicitante = user?.role === 'solicitante';

  return (
    <div className="flex flex-col">
      {/* Sección Hero con menos padding vertical (py-12 en vez de py-32) */}
      <section className="w-full py-12 md:py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Sistema de desarrollo de proyectos
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Plataforma integral para la gestión y vinculación de proyectos tecnológicos.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href={isSolicitante ? "/solicitante/solicitudes/crear" : "/estudiante/proyectos"}>
                    {isSolicitante ? "Subir un proyecto" : "Inscribirme en un proyecto"}
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Sección Explora */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Explora</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Algunos proyectos finalizados recientemente
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {finishedProjects.map(project => (
              <div key={project.id} className="flex flex-col items-center text-center">
                <Image 
                  src={project.studentsEnrolled.length > 0 ? project.studentsEnrolled[0].avatarUrl! : "https://placehold.co/400x225.png"} 
                  alt={project.title} 
                  width={400} 
                  height={225} 
                  className="rounded-lg object-cover mb-4 shadow-sm" 
                />
                <h3 className="text-xl font-bold font-headline mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
