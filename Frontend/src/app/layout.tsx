import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// Configuramos las fuentes nativas de Next.js
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "ProConecta | Sistema de Proyectos",
  description: "Plataforma integral para la gestión y vinculación de proyectos tecnológicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* Inyectamos las variables de las fuentes en el body */}
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        spaceGrotesk.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
