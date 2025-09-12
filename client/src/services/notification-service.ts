// Simple notification service for quiz reminders
export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private quizScheduleKey = 'quiz-schedule';
  private lastQuizKey = 'last-quiz-sent';
  private activeTimers: number[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  getPermissionStatus(): NotificationPermission {
    // Always read fresh from the browser
    return ('Notification' in window) ? Notification.permission : 'denied';
  }

  // Schedule quiz notifications every 3 days
  scheduleQuizNotifications(userName: string, enabled: boolean = true): void {
    // Clear existing timers
    this.clearScheduledNotifications();

    if (!enabled || this.getPermissionStatus() !== 'granted') {
      return;
    }

    // Set up recurring notifications every 3 days
    const scheduleNextQuiz = () => {
      const now = new Date();
      const lastQuiz = localStorage.getItem(this.lastQuizKey);
      const lastQuizDate = lastQuiz ? new Date(lastQuiz) : new Date(0);
      
      // Check if 3 days have passed since last quiz
      const daysDiff = Math.floor((now.getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 3) {
        this.sendQuizNotification(userName);
        localStorage.setItem(this.lastQuizKey, now.toISOString());
        
        // Schedule next notification in 3 days
        const timerId = setTimeout(scheduleNextQuiz, 3 * 24 * 60 * 60 * 1000);
        this.activeTimers.push(timerId);
      } else {
        // Schedule for remaining time
        const remainingMs = (3 - daysDiff) * 24 * 60 * 60 * 1000;
        const timerId = setTimeout(scheduleNextQuiz, remainingMs);
        this.activeTimers.push(timerId);
      }
    };

    // Start scheduling
    scheduleNextQuiz();
    localStorage.setItem(this.quizScheduleKey, 'active');
  }

  private clearScheduledNotifications(): void {
    // Cancel all active timers
    this.activeTimers.forEach(timerId => clearTimeout(timerId));
    this.activeTimers = [];
    localStorage.removeItem(this.quizScheduleKey);
  }

  sendQuizNotification(userName: string): void {
    if (this.getPermissionStatus() !== 'granted') {
      return;
    }

    const messages = [
      `Olá ${userName}, como você está se sentindo hoje?`,
      `${userName}, que tal compartilhar como está seu coração?`,
      `Oi ${userName}, como Deus tem falado contigo hoje?`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const notification = new Notification('Verso & Paz 💙', {
      body: randomMessage,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'quiz-reminder',
      requireInteraction: true,
      data: {
        type: 'quiz',
        timestamp: Date.now()
      }
    });

    notification.onclick = () => {
      window.focus();
      // Trigger quiz modal
      window.dispatchEvent(new CustomEvent('show-quiz-modal'));
      notification.close();
    };

    // Auto-close after 10 seconds if not interacted with
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  // For testing purposes - send notification immediately
  sendTestQuizNotification(userName: string): void {
    if (this.getPermissionStatus() === 'granted') {
      this.sendQuizNotification(userName);
    }
  }
}

export const notificationService = NotificationService.getInstance();