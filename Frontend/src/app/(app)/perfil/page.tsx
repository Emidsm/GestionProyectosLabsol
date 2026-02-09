'use client';

import * as React from 'react';
import { getUserFromCookies } from '@/lib/cookie-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building, MapPin, Mail, Phone, Briefcase, GraduationCap, Edit, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const user = getUserFromCookies();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);

  // Estados locales para el formulario
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  
  // Campos específicos
  const [institution, setInstitution] = React.useState(user?.academicInstitution || user?.company || '');
  const [roleDetail, setRoleDetail] = React.useState(user?.career || user?.jobTitle || '');

  if (!user) {
    return <div className="p-8">Cargando perfil...</div>;
  }

  const handleSaveChanges = () => {
    // Aquí iría la llamada al backend para actualizar el usuario
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios se han guardado correctamente.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast({
      title: "Solicitud enviada",
      description: "Te hemos enviado un correo para restablecer tu contraseña.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y profesional.</p>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Editar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Realiza cambios en tu perfil aquí. Haz clic en guardar cuando termines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Biografía / Descripción</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              {/* Campos dinámicos según rol */}
              {user.role === 'estudiante' ? (
                 <>
                   <div className="grid gap-2">
                     <Label htmlFor="inst">Institución Académica</Label>
                     <Input id="inst" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="career">Carrera</Label>
                     <Input id="career" value={roleDetail} onChange={(e) => setRoleDetail(e.target.value)} />
                   </div>
                 </>
              ) : user.role === 'solicitante' ? (
                 <>
                   <div className="grid gap-2">
                     <Label htmlFor="comp">Empresa / Institución</Label>
                     <Input id="comp" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                   </div>
                   <div className="grid gap-2">
                     <Label htmlFor="job">Cargo</Label>
                     <Input id="job" value={roleDetail} onChange={(e) => setRoleDetail(e.target.value)} />
                   </div>
                 </>
              ) : null}
            </div>
            <DialogFooter>
              <Button onClick={handleSaveChanges}>Guardar cambios</Button>
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
                
                {user.bio && (
                  <p className="text-sm text-muted-foreground italic bg-muted/20 p-3 rounded-md">
                    &quot;{user.bio}&quot;
                  </p>
                )}
                
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
                        </>
                    )}
                </div>

                <Separator />
                
                <div>
                   <h3 className="text-sm font-semibold mb-3">Seguridad</h3>
                   <Button variant="outline" size="sm" onClick={handleChangePassword}>
                      <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña
                   </Button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
