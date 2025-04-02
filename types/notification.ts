// types/notification.ts
export type NotificationType = 'document_update' | 'approval_request' | 'approval_complete' | 'assessment_due' | 'audit_scheduled';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  relatedItemType?: string;
  isRead: boolean;
  createdAt: string;
}

// lib/notification-service.ts
class NotificationService {
  createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    const userNotifications = this.getUserNotifications(notification.userId);
    localStorage.setItem(`notifications_${notification.userId}`, 
      JSON.stringify([newNotification, ...userNotifications]));
    
    return newNotification;
  }
  
  getUserNotifications(userId: string): Notification[] {
    const notificationsJson = localStorage.getItem(`notifications_${userId}`);
    return notificationsJson ? JSON.parse(notificationsJson) : [];
  }
  
  markAsRead(notificationId: string, userId: string): boolean {
    const notifications = this.getUserNotifications(userId);
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index === -1) return false;
    
    notifications[index].isRead = true;
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    
    return true;
  }
  
  markAllAsRead(userId: string): boolean {
    const notifications = this.getUserNotifications(userId).map(n => ({
      ...n,
      isRead: true
    }));
    
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    return true;
  }
  
  deleteNotification(notificationId: string, userId: string): boolean {
    const notifications = this.getUserNotifications(userId);
    const filteredNotifications = notifications.filter(n => n.id !== notificationId);
    
    if (filteredNotifications.length === notifications.length) return false;
    
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(filteredNotifications));
    return true;
  }
  
  getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId).filter(n => !n.isRead).length;
  }
}