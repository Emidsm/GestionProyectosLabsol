'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { mockUsers, mockProjects } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, Building, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function AdminUserDetailsPage() {
  const params = useParams();
  const user = mockUsers.find((u) => u.id === params.id);

  if (!user) notFound();

  // Buscar proyectos relacionados (si es solicitante = sus proyectos, si es estudiante = donde está inscrito)
  const relatedProjects = mockProjects.filter(p => 
    (user.role === 'solicitante' && p.solicitante.id === user.id) ||
    (user.role === 'estudiante' && p.studentsEnrolled.some(s => s.id === user.id))
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="pl-0">
        <Link href="/administrador/usuarios"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a usuarios</Link>
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
             <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" /> {user.municipality || 'Zacatecas'}
             </span>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* INFO DE CONTACTO (Común) */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Información de Contacto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-3">
               <Mail className="h-5 w-5 text-muted-foreground" />
               <div>
                 <p className="text-sm font-medium">Correo Electrónico</p>
                 <p className="text-muted-foreground">{user.email}</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Phone className="h-5 w-5 text-muted-foreground" />
               <div>
                 <p className="text-sm font-medium">Teléfono</p>
                 <p className="text-muted-foreground">{user.phone || 'No registrado'}</p>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* INFO ESPECÍFICA POR ROL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
                {user.role === 'estudiante' ? 'Datos Académicos' : 'Datos Profesionales'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.role === 'estudiante' ? (
                <>
                   <div className="flex items-center gap-3">
                     <Building className="h-5 w-5 text-muted-foreground" />
                     <div>
                       <p className="text-sm font-medium">Institución</p>
                       <p className="text-muted-foreground">{user.academicInstitution || 'N/A'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <GraduationCap className="h-5 w-5 text-muted-foreground" />
                     <div>
                       <p className="text-sm font-medium">Carrera</p>
                       <p className="text-muted-foreground">{user.career || 'N/A'}</p>
                     </div>
                   </div>
                </>
            ) : user.role === 'solicitante' ? (
                <>
                   <div className="flex items-center gap-3">
                     <Building className="h-5 w-5 text-muted-foreground" />
                     <div>
                       <p className="text-sm font-medium">Empresa / Institución</p>
                       <p className="text-muted-foreground">{user.company || 'N/A'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Briefcase className="h-5 w-5 text-muted-foreground" />
                     <div>
                       <p className="text-sm font-medium">Cargo y Giro</p>
                       <p className="text-muted-foreground">{user.jobTitle} - {user.activity}</p>
                     </div>
                   </div>
                </>
            ) : (
                <p className="text-muted-foreground italic">Es un administrador del sistema.</p>
            )}
          </CardContent>
        </Card>

        {/* HISTORIAL DE PROYECTOS */}
        <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-lg">Proyectos Asociados</CardTitle></CardHeader>
            <CardContent>
                {relatedProjects.length > 0 ? (
                    <div className="space-y-2">
                        {relatedProjects.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 border rounded bg-muted/20">
                                <div>
                                    <p className="font-medium">{p.title}</p>
                                    <Badge variant="outline" className="text-xs">{p.status}</Badge>
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
