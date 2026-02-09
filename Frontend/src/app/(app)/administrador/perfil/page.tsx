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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, Mail, Edit, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminProfilePage() {
  const user = getUserFromCookies();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [phone, setPhone] = React.useState(user?.phone || '');

  if (!user) return <div>Cargando...</div>;

  const handleSaveChanges = () => {
    toast({ title: "Perfil actualizado", description: "Cambios guardados." });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Perfil de Administrador</h1>
          <p className="text-muted-foreground">Gestiona tus credenciales de acceso.</p>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Editar Datos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Datos de Contacto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono de contacto</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveChanges}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
                <Avatar className="h-32 w-32 border-4 border-primary/10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
                </Avatar>
                <Badge variant="default" className="bg-purple-600 hover:bg-purple-700 uppercase">
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
                
                <div className="flex justify-center md:justify-start">
                   <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                      <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña Maestra
                   </Button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
