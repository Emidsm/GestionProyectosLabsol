import Link from "next/link";
import Image from "next/image";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/">
             <Image src="/images/logo.png" alt="Logo" width={300} height={75} />
          </Link>
          <h1 className="mt-4 text-3xl font-bold font-headline text-center">
            Únete al Sistema de Proyectos
          </h1>
        </div>
        {children}
         <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/"
              className="font-medium text-primary hover:underline"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
