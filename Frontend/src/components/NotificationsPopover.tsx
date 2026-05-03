'use client';

import * as React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getMyNotifications, markNotificationsAsRead } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    getMyNotifications().then(setNotifications).catch(console.error);
  }, []);

  const handleMarkAllAsRead = async () => {
  await markNotificationsAsRead(); // ← Cambia el nombre aquí también
  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
              <div key={n.id} className={`p-4 text-sm border-b last:border-0 ${!n.isRead ? 'bg-muted/30' : ''}`}>
                <p className="font-semibold">{n.title}</p>
                <p className="text-muted-foreground line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-primary mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                </p>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
