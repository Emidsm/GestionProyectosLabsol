// src/app/(app)/administrador/perfil/page.tsx
'use client';

import * as React from 'react';
import { getUserFromCookies, setUserCookie } from '@/lib/cookie-utils';
import { updateAvatar, uploadImage, getMyProfile, updateProfile } from '@/lib/api'; // Asegúrate de importar estos
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, Edit, Lock, ShieldCheck, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<any>(null);
  const [isAvatarUpdating, setIsAvatarUpdating] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Carga inicial de datos reales para tener el avatarUrl fresco
  React.useEffect(() => {
    getMyProfile().then((data) => {
      setUser(data);
      setPhone(data.phone || '');
    }).catch(() => {
      setUser(getUserFromCookies());
    });
  }, []);

  if (!user) return <div className="p-8 text-center">Cargando...</div>;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAvatarUpdating(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const { url } = await uploadImage(formData); // Sube a MinIO
      await updateAvatar(url); // Guarda en Postgres
      
      const updatedUser = { ...user, avatarUrl: url };
      setUser(updatedUser);
      setUserCookie(updatedUser); // Actualiza la barra de navegación
      
      toast({ title: "Éxito", description: "Foto de perfil actualizada." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
    } finally {
      setIsAvatarUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveChanges = async () => {
    try {
      const { user: updated } = await updateProfile({ phone });
      setUser(updated);
      setUserCookie(updated as any);
      toast({ title: "Perfil actualizado", description: "Cambios guardados." });
      setIsEditing(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron guardar los cambios." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Perfil de Administrador</h1>
          <p className="text-muted-foreground">Gestiona tus credenciales y foto de perfil.</p>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild><Button><Edit className="mr-2 h-4 w-4" /> Editar Datos</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Datos de Contacto</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono de contacto</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <DialogFooter><Button onClick={handleSaveChanges}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
                {/* Avatar con hover para cambiar imagen */}
                <div 
                  className="relative group cursor-pointer rounded-full overflow-hidden h-32 w-32 border-4 border-primary/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                    <Avatar className="h-full w-full group-hover:brightness-50 transition-all">
                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isAvatarUpdating ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
                    </div>
                </div>
                <Badge variant="default" className="bg-purple-600 uppercase">
                    <ShieldCheck className="mr-1 h-3 w-3" /> {user.role}
                </Badge>
            </div>
            
            <div className="space-y-6 flex-1 w-full text-center md:text-left">
                <div>
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    <p className="text-lg text-muted-foreground">{user.email}</p>
                </div>
                <Separator />
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2 justify-center md:justify-start">
                            <Phone className="h-4 w-4" /> Teléfono
                        </span>
                        <p className="font-medium">{user.phone || 'No registrado'}</p>
                    </div>
                    <div className="space-y-1 p-3 bg-muted/20 rounded-lg">
                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2 justify-center md:justify-start">
                            <Mail className="h-4 w-4" /> Correo
                        </span>
                        <p className="font-medium">{user.email}</p>
                    </div>
                </div>
                <Separator />
                <Button variant="outline" className="text-red-600 border-red-200">
                    <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña Maestra
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
