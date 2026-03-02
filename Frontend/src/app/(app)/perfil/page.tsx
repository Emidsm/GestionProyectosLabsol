'use client';

import * as React from 'react';
import { getUserFromCookies, setUserCookie } from '@/lib/cookie-utils';
import { getMyProfile, updateProfile, type ApiUser } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Building, Phone, Briefcase, GraduationCap, Edit, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<ApiUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form state
  const [phone, setPhone] = React.useState('');
  const [institution, setInstitution] = React.useState('');
  const [roleDetail, setRoleDetail] = React.useState('');
  const [municipality, setMunicipality] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [activity, setActivity] = React.useState('');

  React.useEffect(() => {
    getMyProfile()
      .then((data) => {
        setUser(data);
        setPhone(data.phone || '');
        setInstitution(data.academicInstitution || data.company || '');
        setRoleDetail(data.career || '');
        setMunicipality(data.municipality || '');
        setJobTitle(data.jobTitle || '');
        setActivity(data.activity || '');
      })
      .catch(() => {
        const cookie = getUserFromCookies();
        if (cookie) setUser(cookie as unknown as ApiUser);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveChanges = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const payload =
        user.role === 'estudiante'
          ? { phone, academicInstitution: institution, career: roleDetail, municipality }
          : { phone, company: institution, jobTitle, activity };

      const { user: updated } = await updateProfile(payload);
      setUser(updated);
      // Actualizar cookie para que el middleware y componentes la lean
      setUserCookie(updated as any);
      toast({ title: 'Perfil actualizado', description: 'Tus cambios se guardaron correctamente.' });
      setIsEditing(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Cargando perfil...</div>;
  if (!user) return <div className="p-8">No se pudo cargar el perfil.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal.</p>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>Haz clic en guardar cuando termines.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              {user.role === 'estudiante' && (
                <>
                  <div className="grid gap-2">
                    <Label>Municipio</Label>
                    <Input value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Institución Académica</Label>
                    <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Carrera</Label>
                    <Input value={roleDetail} onChange={(e) => setRoleDetail(e.target.value)} />
                  </div>
                </>
              )}

              {user.role === 'solicitante' && (
                <>
                  <div className="grid gap-2">
                    <Label>Empresa / Institución</Label>
                    <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Cargo</Label>
                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Giro / Actividad</Label>
                    <Input value={activity} onChange={(e) => setActivity(e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleSaveChanges} disabled={submitting}>
                {submitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24 border-4 border-muted">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <Badge variant="secondary" className="uppercase mt-2">{user.role}</Badge>
            </div>

            <div className="space-y-4 flex-1 w-full">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Teléfono
                  </span>
                  <p>{user.phone || 'No registrado'}</p>
                </div>

                {user.role === 'estudiante' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Municipio
                      </span>
                      <p>{user.municipality || 'No registrado'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Building className="h-3 w-3" /> Institución
                      </span>
                      <p>{user.academicInstitution || 'No registrada'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Carrera
                      </span>
                      <p>{user.career || 'No registrada'}</p>
                    </div>
                  </>
                )}

                {user.role === 'solicitante' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Building className="h-3 w-3" /> Empresa/Institución
                      </span>
                      <p>{user.company || 'No registrada'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Cargo
                      </span>
                      <p>{user.jobTitle || 'No registrado'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Giro / Actividad
                      </span>
                      <p>{user.activity || 'No registrado'}</p>
                    </div>
                  </>
                )}
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Miembro desde {new Date(user.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
