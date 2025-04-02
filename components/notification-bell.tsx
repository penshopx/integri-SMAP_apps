// components/notification-bell.tsx
"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { Notification } from '@/types/notification';

export function NotificationBell() {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (!authState.user) return;
    
    // In a real app, you would fetch from an API
    const notificationService = new NotificationService();
    const userNotifications = notificationService.getUserNotifications(authState.user.id);
    setNotifications(userNotifications.slice(0, 5)); // Show only 5 most recent
    setUnreadCount(notificationService.getUnreadCount(authState.user.id));
    
    // Set up polling or WebSocket for real-time updates
    const interval = setInterval(() => {
      const updatedNotifications = notificationService.getUserNotifications(authState.user.id);
      setNotifications(updatedNotifications.slice(0, 5));
      setUnreadCount(notificationService.getUnreadCount(authState.user.id));
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [authState.user]);
  
  const handleMarkAsRead = (notificationId: string) => {
    if (!authState.user) return;
    
    const notificationService = new NotificationService();
    notificationService.markAsRead(notificationId, authState.user.id);
    
    // Update local state
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const handleMarkAllAsRead = () => {
    if (!authState.user) return;
    
    const notificationService = new NotificationService();
    notificationService.markAllAsRead(authState.user.id);
    
    // Update local state
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Tandai semua dibaca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`py-3 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button variant="ghost" size="sm" className="w-full">
            Lihat semua notifikasi
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}