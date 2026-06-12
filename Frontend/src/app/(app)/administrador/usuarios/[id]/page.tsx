'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { getUserById, STATUS_LABELS, type ApiUserDetail } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Mail, Phone, MapPin, Building, GraduationCap, Briefcase, UserX,
} from 'lucide-react';
import Link from 'next/link';

function Field({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [user, setUser] = React.useState<ApiUserDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then(setUser)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando...</div>;

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Usuario no encontrado</h1>
        <p className="text-muted-foreground">No pudimos cargar la información de este usuario.</p>
        <Button asChild>
          <Link href="/administrador/usuarios">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a usuarios
          </Link>
        </Button>
      </div>
    );
  }

  const isStudent = user.role === 'estudiante';
  const isSolicitante = user.role === 'solicitante';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/administrador/usuarios">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a usuarios
        </Link>
      </Button>

      <div className="flex items-center gap-6 pb-6 border-b">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="uppercase">{user.role}</Badge>
            <Badge variant={user.isActive ? 'default' : 'secondary'}>
              {user.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Información de Contacto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field icon={Mail} label="Correo Electrónico" value={user.email} />
            <Field icon={Phone} label="Teléfono" value={user.phone} />
            {isStudent && <Field icon={MapPin} label="Estado" value={user.estado} />}
            {isStudent && <Field icon={MapPin} label="Municipio" value={user.municipality} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isStudent ? 'Datos Académicos' : 'Datos Profesionales'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSolicitante && (
              <>
                <Field icon={Building} label="Empresa / Institución" value={user.company} />
                <Field icon={Briefcase} label="Cargo" value={user.jobTitle} />
                <Field icon={Briefcase} label="Giro / Actividad" value={user.activity} />
              </>
            )}
            {isStudent && (
              <>
                <Field icon={Building} label="Institución" value={user.academicInstitution} />
                <Field icon={GraduationCap} label="Carrera" value={user.career} />
              </>
            )}
            {!isStudent && !isSolicitante && (
              <p className="text-muted-foreground italic text-sm">Cuenta administrativa.</p>
            )}
          </CardContent>
        </Card>

        {isSolicitante && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                Proyectos Asociados ({user.projectsCreated.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.projectsCreated.length > 0 ? (
                <div className="space-y-2">
                  {user.projectsCreated.map((p) => (
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
        )}
      </div>
    </div>
  );
}
