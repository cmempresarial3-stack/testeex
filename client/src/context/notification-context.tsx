import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useApp } from './app-context';
import { notificationService } from '@/services/notification-service';

interface NotificationContextType {
  requestPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  scheduleNotifications: (enabled: boolean) => void;
  getPermissionStatus: () => NotificationPermission;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, settings } = useApp();

  useEffect(() => {
    // Initialize notification system when user and settings are available
    if (user && settings.notificationsEnabled) {
      notificationService.scheduleQuizNotifications(user.name, settings.notificationsEnabled);
    }
  }, [user, settings.notificationsEnabled]);

  const requestPermission = async (): Promise<boolean> => {
    return await notificationService.requestPermission();
  };

  const sendTestNotification = (): void => {
    if (user) {
      notificationService.sendTestQuizNotification(user.name);
    }
  };

  const scheduleNotifications = (enabled: boolean): void => {
    if (user) {
      notificationService.scheduleQuizNotifications(user.name, enabled);
    }
  };

  const getPermissionStatus = (): NotificationPermission => {
    return notificationService.getPermissionStatus();
  };

  const value = {
    requestPermission,
    sendTestNotification,
    scheduleNotifications,
    getPermissionStatus
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}