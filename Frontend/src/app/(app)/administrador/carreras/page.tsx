'use client';

import * as React from 'react';
import {
  getCarreras,
  createCarrera,
  updateCarrera,
  deleteCarrera,
  type ApiCarrera,
} from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Pencil, Trash2, GraduationCap } from 'lucide-react';

export default function CarrerasPage() {
  const { toast } = useToast();
  const [carreras, setCarreras] = React.useState<ApiCarrera[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Diálogo de crear / editar
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ApiCarrera | null>(null);
  const [nombre, setNombre] = React.useState('');

  // Confirmación de borrado
  const [toDelete, setToDelete] = React.useState<ApiCarrera | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    getCarreras()
      .then(setCarreras)
      .catch((err) =>
        toast({ variant: 'destructive', title: 'Error', description: err.message })
      )
      .finally(() => setLoading(false));
  }, [toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setNombre('');
    setDialogOpen(true);
  };

  const openEdit = (c: ApiCarrera) => {
    setEditing(c);
    setNombre(c.nombre);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const value = nombre.trim();
    if (!value) return;
    setSaving(true);
    try {
      if (editing) {
        await updateCarrera(editing.id, { nombre: value });
        toast({ title: 'Carrera actualizada' });
      } else {
        await createCarrera(value);
        toast({ title: 'Carrera creada' });
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: ApiCarrera) => {
    // Optimista: reflejamos el cambio de inmediato.
    setCarreras((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, isActive: !x.isActive } : x))
    );
    try {
      await updateCarrera(c.id, { isActive: !c.isActive });
    } catch (err: any) {
      setCarreras((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, isActive: c.isActive } : x))
      );
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCarrera(toDelete.id);
      toast({ title: 'Carrera eliminada' });
      setToDelete(null);
      load();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Carreras
          </h1>
          <p className="text-muted-foreground">
            Administra el catálogo de carreras disponible para los estudiantes.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar carrera
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Carrera</TableHead>
              <TableHead className="w-[120px] text-center">Activa</TableHead>
              <TableHead className="w-[140px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Cargando carreras...
                </TableCell>
              </TableRow>
            ) : carreras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Aún no hay carreras. Agrega la primera.
                </TableCell>
              </TableRow>
            ) : (
              carreras.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={c.isActive}
                      onCheckedChange={() => handleToggleActive(c)}
                      aria-label="Activar o desactivar carrera"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setToDelete(c)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo crear / editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar carrera' : 'Nueva carrera'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Actualiza el nombre de la carrera.'
                : 'Escribe el nombre de la nueva carrera.'}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Ingeniería en Software"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !nombre.trim()}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de borrado */}
      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar carrera?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{toDelete?.nombre}&quot; del catálogo. Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
