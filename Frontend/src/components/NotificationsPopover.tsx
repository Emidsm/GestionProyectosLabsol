'use client';

import * as React from 'react';
import { Bell, CheckCheck, Check } from 'lucide-react';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getMyNotifications, markNotificationsAsRead, markOneNotificationAsRead } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    getMyNotifications().then(setNotifications).catch(console.error);

    // Tiempo real: escuchamos nuevas notificaciones por Socket.IO.
    const socket = getSocket();
    if (!socket) return;

    const handleNew = (notification: any) => {
      setNotifications((prev) => {
        // Evitamos duplicados si la notificación ya llegó por el fetch inicial.
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
  await markNotificationsAsRead(); // ← Cambia el nombre aquí también
  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkOneAsRead = async (id: string) => {
    // Optimista: la marcamos como leída de inmediato.
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await markOneNotificationAsRead(id);
    } catch {
      // Si falla, revertimos.
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: false } : n)));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-bold">Notificaciones</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-1 h-3 w-3" /> Marcar como leídas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No tienes notificaciones.</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-2 p-4 text-sm border-b last:border-0 ${!n.isRead ? 'bg-muted/30' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-primary mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                    title="Marcar como leída"
                    aria-label="Marcar como leída"
                    onClick={() => handleMarkOneAsRead(n.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
