import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Code2, Mail } from 'lucide-react';

export const metadata = {
  title: 'Acerca de | Gestión de Proyectos Labsol',
  description: 'Información sobre la plataforma y su desarrollador.',
};

export default function AcercaDePage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
        </Link>

        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={260}
            height={65}
            priority
            className="mb-4"
          />
          <h1 className="text-3xl font-bold font-headline">Acerca de la plataforma</h1>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Sistema de gestión de proyectos que conecta a solicitantes, estudiantes
            y administradores para proponer, evaluar y dar seguimiento a proyectos
            colaborativos.
          </p>
        </div>

        <section className="bg-card border rounded-lg p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Desarrollo</h2>
              <p className="text-sm text-muted-foreground">Diseño y construcción del sistema</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-lg font-bold">Emiliano De Santiago</p>
            <p className="text-muted-foreground">Desarrollador Full-Stack</p>
            <a
              href="mailto:emidsm2005@gmail.com"
              className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
            >
              <Mail className="mr-2 h-4 w-4" /> emidsm2005@gmail.com
            </a>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          © 2025 - 2027 Labsol Network · Bajo licencia GPL v.3
        </p>
      </div>
    </div>
  );
}
