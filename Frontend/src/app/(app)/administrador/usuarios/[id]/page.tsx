'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProjects, type ApiProject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { STATUS_LABELS } from '@/lib/api';

/**
 * NOTA: No existe endpoint GET /api/users/:id en el backend.
 * Esta página reconstruye el perfil del solicitante a partir de sus proyectos.
 * Para ver el perfil completo de cualquier usuario necesitarías agregar:
 *   router.get('/:id', verifyToken, isAdmin, getUserById);
 */

export default function AdminUserDetailsPage() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [relatedProjects, setRelatedProjects] = React.useState<ApiProject[]>([]);
  const [userInfo, setUserInfo] = React.useState<{
    name: string; email: string; company?: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    getProjects()
      .then((projects) => {
        const userProjects = projects.filter((p) => p.solicitanteId === userId);
        if (userProjects.length > 0) {
          setUserInfo(userProjects[0].solicitante);
          setRelatedProjects(userProjects);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;
  if (!userInfo) return notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/administrador/usuarios">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a usuarios
        </Link>
      </Button>

      <div className="flex items-center gap-6 pb-6 border-b">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          <AvatarFallback className="text-2xl">{userInfo.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{userInfo.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="uppercase">solicitante</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Información de Contacto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Correo Electrónico</p>
                <p className="text-muted-foreground">{userInfo.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Datos Profesionales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {userInfo.company && (
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Empresa / Institución</p>
                  <p className="text-muted-foreground">{userInfo.company}</p>
                </div>
              </div>
            )}
            {!userInfo.company && (
              <p className="text-muted-foreground italic text-sm">Sin información profesional adicional.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-lg">Proyectos Asociados ({relatedProjects.length})</CardTitle></CardHeader>
          <CardContent>
            {relatedProjects.length > 0 ? (
              <div className="space-y-2">
                {relatedProjects.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 border rounded bg-muted/20">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <Badge variant="outline" className="text-xs mt-1">{STATUS_LABELS[p.status]}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/administrador/proyectos/${p.id}`}>Ver</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tiene proyectos registrados.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
