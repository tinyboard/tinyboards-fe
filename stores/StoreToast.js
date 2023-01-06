import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  // State
  state: () => {
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
  	addNotification(notification) {
      this.hasInit = true;
  		notification.id = (Math.random().toString(36) + Date.now().toString(36)).substr(2);
      this.notifications.push(notification);
    },
    removeNotification(notificationToRemove) {
      this.notifications = this.notifications.filter(notification => {
       return notification.id !== notificationToRemove.id
     })
    }
  }
});