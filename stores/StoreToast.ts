import { defineStore } from 'pinia';

interface ToastOptions {
  header: string;
  message: string;
  type: 'success' | 'error';
}

type Toast = ToastOptions & { id: string }; // Toast ID does not have to be specified by the callee

interface ToastStore {
  hasInit: boolean;
  notifications: Toast[];
}

export const useToastStore = defineStore('toast', {
  // State
  state: (): ToastStore => {
    return {
      hasInit: false,
      notifications: []
    }
  },
  // Getters
  getters: {
    toastsLength(state) {
      return this.notifications.length;
    }
  },
  // Actions
  actions: {
    addNotification(notification: ToastOptions) {
      this.hasInit = true;
      const toast: Toast = {
        ...notification,
        id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
      };
      this.notifications.push(toast);
    },
    removeNotification(notificationToRemove: Toast) {
      this.notifications = this.notifications.filter(notification => {
        return notification.id !== notificationToRemove.id
      })
    }
  }
});