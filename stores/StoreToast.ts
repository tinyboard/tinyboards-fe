import { defineStore } from 'pinia';

// GraphQL error details for debugging
interface GraphQLErrorDetail {
  message: string;
  path?: string[];
  code?: string;
  field?: string;
  line?: number;
  column?: number;
}

// Optional detailed error information
interface ToastErrorDetails {
  errors?: GraphQLErrorDetail[];
  errorId?: string;
  requestId?: string;
  timestamp?: string;
  showDetails?: boolean;
}

interface ToastOptions {
  header: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  // Optional error details for GraphQL errors
  details?: ToastErrorDetails;
  // Optional duration override (ms)
  duration?: number;
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