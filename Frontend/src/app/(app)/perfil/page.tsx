'use client';

import * as React from 'react';
import { getUserFromCookies, setUserCookie } from '@/lib/cookie-utils';
import { getMyProfile, updateProfile, updateAvatar, uploadImage, type ApiUser } from '@/lib/api';
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, Phone, Briefcase, GraduationCap, Edit, MapPin, Camera, Upload, Link as LinkIcon, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<ApiUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isAvatarUpdating, setIsAvatarUpdating] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      setUserCookie(updated as any);
      toast({ title: 'Perfil actualizado', description: 'Tus cambios se guardaron correctamente.' });
      setIsEditing(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // --- LÓGICA DE ACTUALIZACIÓN DE FOTO ---
  const handleSaveAvatarUrl = async (newUrl: string | null) => {
    if (!user) return;
    setIsAvatarUpdating(true);
    try {
      // Usamos el endpoint que construiste
      const updatedUser = await updateAvatar(newUrl || ""); 
      
      // Actualizamos el estado local
      const newUserState = { ...user, avatarUrl: newUrl };
      setUser(newUserState);
      
      // ¡ESTO ES CLAVE! Actualizamos la cookie para que la barra de navegación (UserNav) reaccione
      setUserCookie(newUserState as any);
      
      toast({ title: 'Foto actualizada', description: 'Tu foto de perfil se ha guardado.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar la foto.' });
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAvatarUpdating(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Subimos a MinIO
      const uploadResponse = await uploadImage(formData);
      
      // Actualizamos el perfil con la URL de MinIO
      await handleSaveAvatarUrl(uploadResponse.url);
      
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al subir', description: 'Ocurrió un problema con MinIO.' });
      setIsAvatarUpdating(false);
    }
    
    // Limpiamos el input para poder subir la misma foto si queremos
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePromptLink = () => {
    const url = window.prompt("Pega el enlace de tu nueva imagen:");
    if (url) {
      // Recordatorio: Si es externa, debe estar en next.config.ts
      handleSaveAvatarUrl(url);
    }
  };

  const handleDeleteAvatar = () => {
    if (window.confirm("¿Seguro que quieres eliminar tu foto de perfil?")) {
      handleSaveAvatarUrl(null);
    }
  };

  if (loading) return <div className="p-8">Cargando perfil...</div>;
  if (!user) return <div className="p-8">No se pudo cargar el perfil.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* INPUT OCULTO PARA SUBIR ARCHIVOS */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />

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
              {/* MAGIA DE LA FOTO DE PERFIL AQUÍ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative group cursor-pointer rounded-full overflow-hidden h-24 w-24 border-4 border-muted">
                    <Avatar className="h-full w-full transition-all duration-300 group-hover:brightness-50 group-hover:blur-[1px]">
                      <AvatarImage src={user.avatarUrl || undefined} className="object-cover" />
                      <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {isAvatarUpdating ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Subir desde PC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePromptLink}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Usar un enlace
                  </DropdownMenuItem>
                  {user.avatarUrl && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDeleteAvatar} className="text-red-600 focus:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar foto
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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
